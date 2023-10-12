import React, { useContext, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { WebContainer } from '@webcontainer/api';
import { PreviewLoading } from './previewLoading';
import { EditorContext } from '@/contexts/editor-context';

export const PreviewComponent = () => {
    const theme = useTheme();
    const { files, setFiles, webContainer, setWebContainer } = useContext(EditorContext)
    const [isLoading, setIsLoading] = React.useState(true);
    const [isInstallingDependencies, setIsInstallingDependencies] = React.useState(false);
    const [isStartingServer, setIsStartingServer] = React.useState(false);
    const [preview, setPreview] = React.useState(null);


    useEffect(async () => {
        // Use pnpm to install dependencies 💭
        const webContainerInstance = await WebContainer.boot({
            workdirName: 'react-app'
        });
        // webContainerInstance.mount(files['my-project'].directory)
        setWebContainer(webContainerInstance);

        setIsInstallingDependencies(true);
        const exitCode = await installDependencies(webContainerInstance);
        if (exitCode !== 0) {
            throw new Error('Installation failed');
        }
        setIsInstallingDependencies(false);

        setIsStartingServer(true);
        await runServer(webContainerInstance);
        setIsStartingServer(false);
    }, [])

    const installDependencies = async (webContainerInstance) => {
        //Instead of using npx to initialize a new react project I should just mount the files from our project then install dependencies 💭
        const installProcess = await webContainerInstance.spawn('npx', ['--yes', 'create-react-app', '.']);
        installProcess.output.pipeTo(
            new WritableStream({
                write(data) {
                    console.log(data);
                },
            })
        )
        return installProcess.exit;
    }

    const runServer = async (webContainerInstance) => {
        const startProcess = await webContainerInstance.spawn('npm', ['start']);
        startProcess.output.pipeTo(
            new WritableStream({
                write(data) {
                    console.log(data);
                },
            })
        )
        webContainerInstance.on('server-ready', (port, url) => {
            setPreview(url);
        });
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            width: '100%',
            height: '100%',
        }}>
            <div style={{
                position: 'absolute',
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
            }}>
                <PreviewLoading isInstallingDependencies={isInstallingDependencies} isStartingServer={isStartingServer} />
            </div>
            {isLoading ? null : (<>
                <div style={{
                    height: '30px',
                    width: '100%',
                    backgroundColor: "#020103",
                    borderTopLeftRadius: theme.shape.borderRadius,
                    borderTopRightRadius: theme.shape.borderRadius,
                    zIndex: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    color: theme.palette.text.primary,
                }}>
                    <div>Refresh</div>
                    <div>BIIIIIIIIIIIIIIIIG LOOOOOOOOOOOOOOOOOOONG URL</div>
                    <div>New Tab</div>
                </div>
            </>)}
            <iframe style={{
                width: '100%',
                height: 'calc(100% - 30px)',
                position: 'relative',
                top: "30px",
                borderBottomLeftRadius: theme.shape.borderRadius,
                borderBottomRightRadius: theme.shape.borderRadius,
                zIndex: 2,
            }} src={preview} onLoad={() => setIsLoading(false)} />
        </Box>
    );
}
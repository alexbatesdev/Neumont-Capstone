import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { WebContainer } from '@webcontainer/api';


export const PreviewComponent = () => {
    const theme = useTheme();
    console.log(theme)
    const [isLoading, setIsLoading] = React.useState(true);
    // Will probably hoist into the parent component or a context 💭
    const [preview, setPreview] = React.useState(null);
    const [webContainer, setWebContainer] = React.useState(null);
    //This will 100% be pulled into a context or parent 💭
    const [files, setFiles] = React.useState({

    });

    useEffect(async () => {
        // Use pnpm to install dependencies 💭
        const webContainerInstance = await WebContainer.boot({
            workdirName: 'react-app'
        });
        setWebContainer(webContainerInstance);

        const exitCode = await installDependencies(webContainerInstance);
        if (exitCode !== 0) {
            throw new Error('Installation failed');
        }

        await runServer(webContainerInstance);
    }, [])

    const installDependencies = async (webContainerInstance) => {
        //Instead of using npx to initialize a new react project I should just copy the files from our project then install dependencies 💭
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
        console.log("attempting start")
        const startProcess = await webContainerInstance.spawn('npm', ['start']);
        startProcess.output.pipeTo(
            new WritableStream({
                write(data) {
                    console.log(data);
                },
            })
        )
        webContainerInstance.on('server-ready', (port, url) => {
            console.log(`Server is listening on port ${port}`);
            setPreview(url);
            setIsLoading(false);
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
            {isLoading ? "Loading..." : (<>
                <iframe style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: theme.shape.borderRadius,
                }} src={preview} />
            </>)}
        </Box>
    );
}
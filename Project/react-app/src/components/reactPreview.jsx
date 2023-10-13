import React, { useContext, useEffect } from 'react';
import { Box, FormControl, FormHelperText, Input, InputLabel, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { WebContainer } from '@webcontainer/api';
import { PreviewLoading } from './previewLoading';
import { EditorContext } from '@/contexts/editor-context';
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

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
        webContainerInstance.mount(files)
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
        const installProcess = await webContainerInstance.spawn('pnpm', ['install']);
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
            console.log(url)
            setPreview(url);
        });
    }

    const buttonStyle = {
        fontSize: "1rem",
        marginBottom: "0",
        display: "inline",
        float: "right",
        backgroundColor: theme.palette.utilBar.default,
        height: "calc(100% - 4px)",
        padding: "2px",
        color: theme.palette.utilBar.icons,
        width: "auto",
        aspectRatio: "1/1",
        textAlign: "center",
        userSelect: "none",
        cursor: "pointer",
    }

    return (<>
        <style>
            {`
            @keyframes rotate {
                from {
                transform: rotate(0deg);
                }
                to {
                transform: rotate(360deg);
                }
            }
            `}
        </style>
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
                    backgroundColor: theme.palette.utilBar.default,
                    borderTopLeftRadius: theme.shape.borderRadius,
                    borderTopRightRadius: theme.shape.borderRadius,
                    zIndex: 2,
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    gap: '50px',
                    alignItems: 'center',
                }}>
                    <RefreshIcon style={buttonStyle} onClick={(e) => {
                        let target = e.target;

                        // If the target is a path element, get the parent svg element
                        if (target.tagName === 'path') {
                            target = target.parentElement;
                        }

                        target.style.animation = 'rotate 0.6s ease-out';
                        console.log(target)
                        setTimeout(() => {
                            target.style.animation = '';
                        }, 600);

                        setPreview((prevPrev) => {
                            if (prevPrev === null) {
                                return null;
                            }
                            return prevPrev + '?reload=true';
                        })
                    }} />

                    <Input disableUnderline value={preview} variant="standard" sx={{
                        flexGrow: 1,
                        height: 'calc(100% - 10px)',
                        backgroundColor: theme.palette.utilBar.secondary,
                        color: theme.palette.text.primary,
                        borderRadius: theme.shape.borderRadius,
                        padding: '0 5px',
                    }} />

                    <OpenInNewIcon style={buttonStyle} onClick={() => {
                        window.open(preview, '_blank');
                    }} />
                </div>
            </>)}
            <iframe style={{
                width: '100%',
                height: 'calc(100% - 30px)',
                position: 'relative',
                borderBottomLeftRadius: theme.shape.borderRadius,
                borderBottomRightRadius: theme.shape.borderRadius,
                zIndex: 2,
            }} src={preview} onLoad={() => setIsLoading(false)} />
        </Box>
    </>);
}
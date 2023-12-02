import React, { useEffect } from 'react';

import { Box, Input, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import LoadingDisplay from './LoadingDisplay';
import { useFiles, useWebContainer } from '@/contexts/editor-context';
import { useWebContainerContext } from '@/contexts/webContainerContext';

export const WebContainerFrame = ({ }) => {
    const theme = useTheme();
    const { files, setFiles, fileOperations } = useFiles();
    const { webContainer, setWebContainer, webContainerURL, setWebContainerURL, webContainerStatus, setWebContainerStatus } = useWebContainerContext();
    const { hideWebContainerFrame, setHideWebContainerFrame } = useWebContainer();
    const [frameLoaded, setFrameLoaded] = React.useState(false);

    useEffect(() => {
        return () => {
            if (webContainer)
                webContainer.teardown();
        }
    }, [webContainer])

    if (hideWebContainerFrame) {
        return (<>
            <Typography variant='h3' sx={{
                color: theme.palette.text.primary,
                fontFamily: "Teko",
                paddingTop: "1rem",
                paddingLeft: "1rem"
            }}>
                Web Container Live Preview is hidden
            </Typography>
            <Typography variant='body1' sx={{
                color: theme.palette.text.primary,
                padding: "1rem"
            }}>
                This is because the web container does not have a start server command add one in the project settings and refresh the page, or if this project has no need to see a live preview, you can hide this message by dragging the divider between this window and the terminal below all the way up.
            </Typography>
        </>)
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

    const outerBoxStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        width: '100%',
        height: '100%',
    }

    const loadingWrapperStyle = {
        position: 'absolute',
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: 1,
    }

    const topBarStyle = {
        height: '30px',
        width: '100%',
        backgroundColor: theme.palette.utilBar.default,
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        zIndex: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: '15px',
        alignItems: 'center',
    }

    const urlDisplayStyle = {
        flexGrow: 1,
        height: 'calc(100% - 10px)',
        backgroundColor: theme.palette.utilBar.secondary,
        color: theme.palette.text.primary,
        borderRadius: "5px",
        padding: '0 5px',
    }

    const iFrameStyle = {
        width: '100%',
        height: 'calc(100% - 30px)',
        position: 'relative',
        borderBottomLeftRadius: "0px",
        borderBottomRightRadius: "0px",
        zIndex: 2,
        backgroundColor: frameLoaded ? "white" : "transparent"
    }

    const handleRefreshClick = (e) => {
        let target = e.target;

        // If the target is a path element, get the parent svg element
        if (target.tagName === 'path') {
            target = target.parentElement;
        }

        target.style.animation = 'rotate 0.6s ease-out';
        setTimeout(() => {
            target.style.animation = '';
        }, 600);

        setWebContainerURL((prevPrev) => {
            if (prevPrev === null) {
                return null;
            }
            return prevPrev + '?reload=true';
        })
    }

    const handleIFrameLoad = () => {
        setWebContainerStatus(3);
        const asyncFunc = async () => {
            // console.log(webContainer)
            const fileTree = await fileOperations.getFileTree(webContainer)
            setFiles(fileTree);
        }
        asyncFunc();
        setFrameLoaded(true);
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
        <Box sx={outerBoxStyle}>
            <div style={loadingWrapperStyle}>
                <LoadingDisplay webContainerStatus={webContainerStatus} />
            </div>
            {webContainerStatus != 3 ? null : (<>
                <div style={topBarStyle}>
                    <RefreshIcon style={buttonStyle} onClick={handleRefreshClick} />

                    <Input disableUnderline value={webContainerURL} variant="standard" sx={urlDisplayStyle} />

                    <OpenInNewIcon style={buttonStyle} onClick={() => {
                        window.open(webContainerURL, '_blank');
                    }} />
                </div>
            </>)}
            <iframe style={iFrameStyle} src={webContainerURL} onLoad={handleIFrameLoad} />
        </Box>
    </>);
}
import React, { useEffect } from 'react'

import dynamic from 'next/dynamic'

import { useTheme } from '@mui/material/styles';

import { ResizableViewsHorizontal, ResizableViewsVertical } from '@/components/ResizableViews'
import { EditorContextProvider, useContextMenu, useEditorContext } from '@/contexts/editor-context'
import { WebContainerTerminal } from '@/components/WebContainerTerminal'
import { WebContainerFrame } from '@/components/WebContainerFrame'
import { CodeEditor } from '@/components/CodeEditor'
import { SideBar } from '@/components/SideBar'
import { useRouter } from 'next/router';
import { Collapse, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { WebContainerContextProvider } from '@/contexts/webContainerContext';
import LoadingDisplay from '@/components/LoadingDisplay';
import TopBar from '@/components/TopBar';
import TopBarButton from '@/components/TopBarButton';
import SaveIcon from '@mui/icons-material/Save';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import ShareIcon from '@mui/icons-material/Share';
import { toast } from 'react-toastify';
import { Download } from '@mui/icons-material';



export default function Editor() {
    const theme = useTheme();
    const { projectData, saveProject, isProjectSaved, setIsProjectSaved, hasEditAccess, handleDownloadProject, hideWebContainerFrame } = useEditorContext();
    const { contextOpen, setContextOpen, contextCoords, setContextCoords, contextMenuItems, setContextMenuItems, contextMenuHelperOpen, setContextMenuHelperOpen, contextMenuHelper, setContextMenuHelper } = useContextMenu();
    const session = useSession();
    const [sidebarWidth, setSidebarWidth] = React.useState(330);

    const pageWrapperStyles = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        minWidth: '100vw',
        minHeight: '100vh',
        backgroundColor: theme.palette.background.default,
        overflow: 'hidden',
        position: 'relative',
    }

    const contextMenuStyle = {
        width: '200px',
        backgroundColor: theme.palette.background.paper,
        border: `3px solid ${theme.palette.utilBar.default}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        boxShadow: '0px 2px 5px rgba(0,0,0,0.6)',
    }

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            // Most browsers require setting a return value
            event.returnValue = '';
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    const forkProject = async () => {

        const body = {
            "project_name": `${projectData.project_name} (forked)`,
            "project_description": projectData.project_description,
            "is_private": projectData.is_private,
            "is_template": projectData.is_template,
            "start_command": projectData.start_command,
        }

        let response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL}/fork/${projectData.project_id}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Authorization": `Bearer ${session.data.token}`,
                "content-type": "application/json",
            }
        }).then((data) => {
            if (data.status === 200) {
                return data.json()
            } else {
                toast.error("Error forking project. Refresh the page to try again.")
            }
        }).catch(err => {
            toast.error("Error forking project. Refresh the page to try again.")
        })
        window.location.href = `/editor/${response.project_id}`
    }

    const shareProject = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Copied link to clipboard")
    }

    const handleContextMenuClick = (event, method) => {
        event.preventDefault();
        event.stopPropagation();
        method();
    }

    useEffect(() => {
        console.log(session)
    }, [session])

    return (
        <div
            className='pageWrapper'
            style={pageWrapperStyles}>
            <TopBar
                titleText={projectData.project_name}
                backLocation={"/dashboard"}
                showSignIn={session.status == "unauthenticated"}
            >
                {hasEditAccess &&
                    <TopBarButton
                        Icon={SaveIcon}
                        text={"Save"}
                        onClick={saveProject}
                        buttonIndex={1}
                        alwaysOpen={!isProjectSaved}
                    />
                }
                {session.status == "authenticated" && !projectData.is_private &&
                    <TopBarButton
                        Icon={AltRouteIcon}
                        text={"Fork"}
                        onClick={forkProject}
                        buttonIndex={2}
                    />
                }
                <TopBarButton
                    Icon={ShareIcon}
                    text={"Share"}
                    onClick={shareProject}
                    buttonIndex={3}
                />
                <TopBarButton
                    Icon={Download}
                    text={"Download"}
                    onClick={handleDownloadProject}
                    buttonIndex={4}
                    openWidth={90}
                />
            </TopBar>
            <div
                style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    width: "100%",
                    height: "calc(100vh - 50px)",
                }}>
                <SideBar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
                <div style={{
                    width: `calc(100% - ${sidebarWidth}px)`,
                    height: '100%',
                }}>
                    <ResizableViewsHorizontal>
                        <CodeEditor />
                        {projectData && (
                            <WebContainerContextProvider>
                                <ResizableViewsVertical fullBottom={hideWebContainerFrame}>
                                    <WebContainerFrame />
                                    <WebContainerTerminal />
                                </ResizableViewsVertical>
                            </WebContainerContextProvider>
                        )}
                    </ResizableViewsHorizontal>
                </div>
            </div>
            {contextOpen && (<div style={{
                position: 'absolute',
                top: contextCoords.y,
                left: contextCoords.x,
            }}>
                <div style={contextMenuStyle}>
                    {contextMenuItems.map((item, index) => {
                        //console.log(contextMenuHelperOpen)
                        return (<>
                            <Typography
                                variant='body1'
                                onClick={(event) => handleContextMenuClick(event, item.method)}
                                color={theme.palette.text.primary}
                                sx={{
                                    cursor: 'pointer',
                                    width: 'calc(100% - 10px)',
                                    '&:hover': {
                                        backgroundColor: theme.palette.background.default,
                                    },
                                    padding: '5px',
                                }}
                            >
                                {item.text}
                            </Typography>
                        </>)
                    })}
                </div>
                {(contextMenuHelper && contextMenuHelperOpen) ? contextMenuHelper : <></>}
            </div>)}
        </div >
    )
}

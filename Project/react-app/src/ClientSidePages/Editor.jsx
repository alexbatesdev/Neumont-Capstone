import React, { useEffect } from 'react'

import dynamic from 'next/dynamic'

import { useTheme } from '@mui/material/styles';

import { ResizableViewsHorizontal, ResizableViewsVertical } from '@/components/ResizableViews'
import { EditorContextProvider } from '@/contexts/editor-context'
import { WebContainerTerminal } from '@/components/WebContainerTerminal'
import { WebContainerFrame } from '@/components/WebContainerFrame'
import { CodeEditor } from '@/components/CodeEditor'
import { SideBar } from '@/components/SideBar'
import { useRouter } from 'next/router';
import { Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { WebContainerContextProvider } from '@/contexts/webContainerContext';
import LoadingDisplay from '@/components/PreviewLoading';


// //Might be unnecessary
// const WebContainerContextProvider = dynamic(
//     () => import('@/contexts/webContainerContext').then((mod) => mod.WebContainerContextProvider),
//     { ssr: false }
// )

export default function Editor({ files_in }) {
    const theme = useTheme();

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

    const topBarStyles = {
        width: '100%',
        maxWidth: '100vw',
        height: '50px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
    }

    return (
        <EditorContextProvider files_in={files_in}>
            <div
                className='pageWrapper'
                style={pageWrapperStyles}>
                <div
                    className='topBar'
                    style={topBarStyles}
                >
                </div>
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
                            {files_in && (
                                <WebContainerContextProvider>
                                    <ResizableViewsVertical>
                                        <WebContainerFrame />
                                        <WebContainerTerminal />
                                    </ResizableViewsVertical>
                                </WebContainerContextProvider>
                            )}
                        </ResizableViewsHorizontal>
                    </div>
                </div>
            </div>
        </EditorContextProvider>
    )
}

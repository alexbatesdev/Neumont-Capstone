import React, { useEffect, useState } from 'react'
import { PreviewComponent } from '@/components/reactPreview'
import { CodeEditor } from '@/components/codeEditor'
import { ResizableViewsHorizontal, ResizableViewsVertical } from '@/components/resizableViews'
import { SideBar } from '@/components/sideBar'
import { useTheme } from '@mui/material/styles';
import { EditorContextProvider } from '@/contexts/editor-context'
import Terminal from '@/components/terminal'
import dynamic from 'next/dynamic'

//Might be unnecessary
const WebContainerTerminalContextProvider = dynamic(
    () => import('@/contexts/webContainerTerminalContext').then((mod) => mod.WebContainerTerminalContextProvider),
    { ssr: false }
)

export default function Home() {
    const theme = useTheme();

    const [sidebarWidth, setSidebarWidth] = React.useState("300px");


    return (
        <EditorContextProvider>
            <div
                className='pageWrapper' // I might reuse this
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    minWidth: '100vw',
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                <div
                    className='topBar'
                    style={{
                        width: '100%',
                        maxWidth: '100vw',
                        height: '50px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        backgroundColor: theme.palette.background.default,
                    }}
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
                        width: `calc(100% - ${sidebarWidth})`,
                        height: '100%',
                    }}>
                        <ResizableViewsHorizontal>
                            <CodeEditor />
                            <WebContainerTerminalContextProvider>
                                <ResizableViewsVertical>
                                    <PreviewComponent />
                                    <Terminal />
                                </ResizableViewsVertical>
                            </WebContainerTerminalContextProvider>
                        </ResizableViewsHorizontal>
                    </div>
                </div>
            </div>
        </EditorContextProvider>
    )
}

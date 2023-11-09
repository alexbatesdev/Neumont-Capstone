import React from "react";

import "xterm/css/xterm.css";

import { useTerminal } from "@/contexts/webContainerContext";
import { useFiles } from "@/contexts/editor-context";
import { Scrollbar } from "react-scrollbars-custom";
import { useTheme } from "@mui/material";

export const WebContainerTerminal = () => {
    const { terminal_instance, setTerminal_instance, fitAddon } = useTerminal();
    const { files, setFiles, fileOperations } = useFiles();
    const terminalRef = React.useRef(null);
    const theme = useTheme();

    React.useEffect(() => {
        let resizeObserver;
        if (terminal_instance) {
            terminal_instance.open(terminalRef.current);
            fitAddon.fit();
            resizeObserver = new ResizeObserver((entries) => {
                fitAddon.fit();
            });
            resizeObserver.observe(terminalRef.current);
        }


        return () => {
            if (terminal_instance) {
                terminal_instance.dispose();
            }
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
        };
    }, [terminal_instance]);

    const terminalStyle = {
        backgroundColor: terminal_instance ? terminal_instance.options.theme.background : "black",
        padding: "5px",
        paddingBottom: "0px",
        height: "calc(100% - 5px)",
        width: "calc(100% - 10px)"
    }

    return (<>
        <style>
            {/* .xterm .xterm-viewport {
                overflow-y: hidden !important;
            } */}
            {`
            .xterm .xterm-viewport {
                /* On OS X this is required in order for the scroll bar to appear fully opaque */
                background-color: transparent;
                overflow-y: scroll;
                cursor: default;
                position: absolute;
                right: -5px;
                left: 0;
                top: -5px;
                bottom: -15px;
                scrollbar-color: #1C0C3B #300F62;
              }
              
              .xterm-viewport::-webkit-scrollbar {
                background-color: #300F62;
                width: 10px;
              }
              
              .xterm-viewport::-webkit-scrollbar-thumb {
                background: #1C0C3B;
              }
            `}
        </style>
        {/* <Scrollbar noScrollX
            style={{
                flexGrow: 1,
                border: "1px solid " + theme.palette.dragBar.default,
                borderRadius: "5px",
            }}> */}

        < div ref={terminalRef} style={terminalStyle} />
        {/* </Scrollbar> */}
    </>);
}
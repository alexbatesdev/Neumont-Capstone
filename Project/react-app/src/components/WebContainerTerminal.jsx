import React from "react";

import "xterm/css/xterm.css";

import { useTerminal } from "@/contexts/webContainerContext";

export const WebContainerTerminal = () => {
    const { terminal_instance, setTerminal_instance, fitAddon } = useTerminal();
    const terminalRef = React.useRef(null);

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
        height: "calc(100% - 10px)",
        width: "calc(100% - 10px)",
    }

    return (<>
        <style>
            {`
            .xterm .xterm-viewport {
                overflow-y: auto !important;
            }
            `}
        </style>
        <div ref={terminalRef} style={terminalStyle} />
    </>);
}
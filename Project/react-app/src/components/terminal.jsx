import { useTerminal } from "@/contexts/webContainerTerminalContext";
import React, { useContext } from "react";
import "xterm/css/xterm.css";

//Possibly stretch addons
//https://github.com/xtermjs/xterm.js/tree/master/addons/xterm-addon-image
//https://github.com/xtermjs/xterm.js/tree/master/addons/xterm-addon-web-links

const Terminal = () => {
    const { terminal_instance, setTerminal_instance, terminal_extras } = useTerminal();
    const terminalRef = React.useRef(null);

    React.useEffect(() => {
        let resizeObserver;
        if (terminal_instance) {
            terminal_instance.open(terminalRef.current);
            terminal_extras.fitAddon.fit();
            resizeObserver = new ResizeObserver((entries) => {
                terminal_extras.fitAddon.fit();
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

    return (<>
        <style>
            {`
            .xterm .xterm-viewport {
                overflow-y: auto !important;
            }
            `}
        </style>
        <div ref={terminalRef} style={{
            backgroundColor: terminal_extras.terminalBackground,
            padding: "5px",
            height: "calc(100% - 10px)",
            width: "calc(100% - 10px)",
        }} />
    </>);
}

export default Terminal;
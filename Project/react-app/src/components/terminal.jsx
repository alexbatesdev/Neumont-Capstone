import { EditorContext } from "@/contexts/editor-context";
import { Button } from "@mui/material";
import React, { useContext } from "react";

//Possibly stretch addons
//https://github.com/xtermjs/xterm.js/tree/master/addons/xterm-addon-image
//https://github.com/xtermjs/xterm.js/tree/master/addons/xterm-addon-web-links

const Terminal = ({ terminal_instance, fitAddon, background }) => {
    const { webContainer } = useContext(EditorContext);
    const terminalRef = React.useRef(null);

    React.useEffect(() => {
        terminal_instance.open(terminalRef.current);
        fitAddon.fit();


        return () => {
            terminal_instance.dispose();
        };
    }, []);


    React.useEffect(() => {
        const resizeObserver = new ResizeObserver((entries) => {
            fitAddon.fit();
        });
        resizeObserver.observe(terminalRef.current);
        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    return (<>
        <style>
            {`
            .xterm .xterm-viewport {
                overflow-y: auto !important;
            }
            `}
        </style>
        <div ref={terminalRef} style={{
            backgroundColor: background,
            padding: "5px",
            height: "calc(100% - 10px)",
            width: "calc(100% - 10px)",
        }} />
    </>);
}

export default Terminal;
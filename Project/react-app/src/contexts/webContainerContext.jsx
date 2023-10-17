import React, { createContext, useState, useContext, useEffect } from "react";

import { useTheme } from "@mui/material";

import { WebContainer } from '@webcontainer/api';

import { useFiles, useWebContainer } from "./editor-context";

const WebContainerContext = createContext({
    fitAddon: null,
    terminal_instance: null,
    setTerminal_instance: () => { },
    webContainer: null,
    setWebContainer: () => { },
    webContainerStatus: null,
    setWebContainerStatus: () => { },
    webContainerURL: null,
    setWebContainerURL: () => { },
});

export const WebContainerContextProvider = ({ children }) => {
    const theme = useTheme();

    const { webContainer, setWebContainer } = useWebContainer();
    const { files } = useFiles();
    const [webContainerStatus, setWebContainerStatus] = useState(0);
    const [webContainerURL, setWebContainerURL] = useState(null);

    const [terminal_instance, setTerminal_instance] = useState();
    const [fitAddon, setFitAddon] = useState();
    const terminalBackground = theme.palette.utilBar.default;
    const terminalForeground = theme.palette.secondary.main;

    useEffect(() => {
        const importDynamic = async () => {
            const { Terminal } = await import("xterm");
            const { FitAddon } = await import("xterm-addon-fit");
            const terminal_instance = new Terminal({
                cursorBlink: true,
                fontSize: 14,
                fontFamily: "monospace",
                theme: {
                    background: terminalBackground,
                    foreground: terminalForeground,
                },
                convertEol: true,
                cursorStyle: "bar", //("block" | "underline" | "bar")
                cursorInactiveStyle: "underline", //("block" | "underline" | "bar" | "outline" | "none")
            });
            const fitAddon = new FitAddon();
            terminal_instance.loadAddon(fitAddon);

            setupWebContainer(
                files,
                terminal_instance,
                setWebContainer,
                setWebContainerStatus,
                setWebContainerURL,
            );

            setFitAddon(fitAddon);
            setTerminal_instance(terminal_instance);
        }
        importDynamic();
    }, []);

    return (
        <WebContainerContext.Provider
            value={{
                fitAddon,
                terminal_instance,
                setTerminal_instance,
                webContainer,
                setWebContainer,
                webContainerStatus,
                setWebContainerStatus,
                webContainerURL,
                setWebContainerURL,
            }}
        >
            {children}
        </WebContainerContext.Provider>
    );
}

export const useTerminal = () => {
    const { fitAddon, terminal_instance, setTerminal_instance } = useContext(WebContainerContext);
    return { fitAddon, terminal_instance, setTerminal_instance };
}

export const useWebContainerContext = () => {
    const context = useContext(WebContainerContext);
    if (context === undefined) {
        throw new Error(
            "useWebContainerTerminalContext must be used within a WebContainerTerminalContextProvider"
        );
    }

    return context;
}

const setupWebContainer = async (
    files,
    terminal_instance,
    setWebContainer,
    setWebContainerStatus,
    setWebContainerURL,
) => {
    const webContainerInstance = await WebContainer.boot({
        workdirName: 'react-app'
    });
    webContainerInstance.mount(files)
    setWebContainer(webContainerInstance);

    setWebContainerStatus(1)
    const exitCode = await installDependencies(webContainerInstance, terminal_instance);
    if (exitCode !== 0) {
        throw new Error('Installation failed');
    }


    setWebContainerStatus(2);
    await runServer(webContainerInstance, setWebContainerURL);

    await startShell(webContainerInstance, terminal_instance);
}

const installDependencies = async (webContainerInstance, terminal_instance) => {
    const installProcess = await webContainerInstance.spawn('pnpm', ['install']);
    installProcess.output.pipeTo(
        new WritableStream({
            write(data) {
                console.log(data);
                terminal_instance.write(data);
            },
        })
    )
    return installProcess.exit;
}

const runServer = async (webContainerInstance, setWebContainerURL) => {
    const startProcess = await webContainerInstance.spawn('npm', ['start']);
    webContainerInstance.on('server-ready', (port, url) => {
        setWebContainerURL(url);
        console.log(url)
    });
}

const startShell = async (webContainerInstance, terminal_instance) => {
    const shellProcess = await webContainerInstance.spawn('jsh')
    shellProcess.output.pipeTo(
        new WritableStream({
            write(data) {
                terminal_instance.write(data);
            },
        })
    )

    const shellInput = shellProcess.input.getWriter();
    terminal_instance.onData((data) => {
        shellInput.write(data);
    });

    return shellProcess;
}
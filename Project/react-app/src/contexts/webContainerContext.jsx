import React, { createContext, useState, useContext, useEffect } from "react";

import { useTheme } from "@mui/material";

import { WebContainer } from '@webcontainer/api';

import { useEditorContext, useFiles, useProjectData, useWebContainer } from "./editor-context";
import { toast } from "react-toastify";

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
    hideWebContainerFrame: false
});

export const WebContainerContextProvider = ({ children }) => {
    const theme = useTheme();

    const { webContainer, setWebContainer, hideWebContainerFrame, setHideWebContainerFrame } = useWebContainer();
    const { files } = useFiles();
    const { projectData } = useProjectData();
    const [webContainerStatus, setWebContainerStatus] = useState(0);
    const [webContainerURL, setWebContainerURL] = useState(null);

    const [terminal_instance, setTerminal_instance] = useState();
    const [fitAddon, setFitAddon] = useState();
    const terminalBackground = theme.palette.utilBar.default;
    const terminalForeground = theme.palette.primary.main;
    const [dynamicImportDone, setDynamicImportDone] = useState(false);

    useEffect(() => {
        if (!files || files == {}) {
            return;
        }
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
            setFitAddon(fitAddon);
            setTerminal_instance(terminal_instance);
            setupWebContainer(
                files,
                terminal_instance,
                setWebContainer,
                setWebContainerStatus,
                setWebContainerURL,
                projectData["start_command"],
                setHideWebContainerFrame
            );
        }
        if (!dynamicImportDone) {
            console.log("Pre WebContainer Setup")
            importDynamic();
            setDynamicImportDone(true);
        }
    }, [files]);

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
                setHideWebContainerFrame,
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
    start_command_string,
    setHideWebContainerFrame
) => {
    console.log("Setting up web container")
    const webContainerInstance = await WebContainer.boot({
        workdirName: 'react-app'
    });
    console.log("Post create");
    try {
        webContainerInstance.mount(files)
    } catch (error) {
        toast.error("Failed to mount files");
        return;
    }
    console.log("Post mount");
    setWebContainer(webContainerInstance);

    if (files["package.json"] != undefined) {
        setWebContainerStatus(1)
        const exitCode = await installDependencies(webContainerInstance, terminal_instance);
        if (exitCode !== 0) {
            toast.error("Failed to install dependencies");
            setHideWebContainerFrame(true);
            return;
        }
    } else {
        toast.info("No package.json found");
        setHideWebContainerFrame(true);
    }

    if (start_command_string !== "") {
        setWebContainerStatus(2);
        await runServer(webContainerInstance, setWebContainerURL, start_command_string);
    } else {
        toast.info("No server start command specified");
        setHideWebContainerFrame(true);
    }

    await startShell(webContainerInstance, terminal_instance);
}

const installDependencies = async (webContainerInstance, terminal_instance) => {
    console.log("Installing dependencies");
    let installProcess;
    try {

        installProcess = await webContainerInstance.spawn('pnpm', ['install']);
    } catch (error) {
        toast.error("Failed to install dependencies");
        return;
    }
    installProcess.output.pipeTo(
        new WritableStream({
            write(data) {
                //console.log(data);
                terminal_instance.write(data);
            },
        })
    )
    return installProcess.exit;
}

const runServer = async (webContainerInstance, setWebContainerURL, start_command_string) => {
    console.log("Running server");
    if (start_command_string) {
        // Variable named start_command_string because it gets split at this step
        const command = start_command_string.split(" ")[0];
        const args = start_command_string.split(" ").slice(1);

        const startProcess = await webContainerInstance.spawn(command, args);
        startProcess.output.pipeTo(
            new WritableStream({
                write(data) {
                    console.log(data);
                    //console.log("Writing data");
                    // terminal_instance.write(data);
                },
            })
        )
        webContainerInstance.on('server-ready', (port, url) => {
            setWebContainerURL(url);
            console.log(url)
        });
    }
}

const startShell = async (webContainerInstance, terminal_instance) => {
    console.log("Starting shell");
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
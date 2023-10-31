import React, { createContext, useState, useContext, useEffect } from "react";

import { useTheme } from "@mui/material";

import { WebContainer, FileSystemTree } from '@webcontainer/api';

import { useFiles, useWebContainer } from "./editor-context";

import { Dir } from "fs";

const WebContainerContext = createContext({
    fitAddon: null as any, //These are any because the imports have to be dynamic, so I don't have the types
    terminal_instance: null as any, //These are any because the imports have to be dynamic, so I don't have the types
    setTerminal_instance: (value: any) => { }, //These are any because the imports have to be dynamic, so I don't have the types
    webContainer: null as null | WebContainer,
    setWebContainer: (value: WebContainer) => { },
    webContainerStatus: null as null | number,
    setWebContainerStatus: (value: number) => { },
    webContainerURL: null as null | string,
    setWebContainerURL: (value: string) => { },
});

type WebContainerContextProviderProps = {
    children: React.ReactNode;
}

export const WebContainerContextProvider = ({ children }: WebContainerContextProviderProps) => {
    const theme = useTheme();

    const { webContainer, setWebContainer } = useWebContainer();
    const { files } = useFiles();
    const [webContainerStatus, setWebContainerStatus] = useState(0);
    const [webContainerURL, setWebContainerURL] = useState<null | string>(null);

    const [terminal_instance, setTerminal_instance] = useState<any>(); //These are any because the imports have to be dynamic, so I don't have the types
    const [fitAddon, setFitAddon] = useState<any>(); //These are any because the imports have to be dynamic, so I don't have the types
    // @ts-ignore //This is my own addition added to the theme object
    const terminalBackground = theme.palette.utilBar.default;
    const terminalForeground = theme.palette.primary.main;
    const [dynamicImportDone, setDynamicImportDone] = useState(false);

    useEffect(() => {
        ////console.log(files)
        if (!files || Object.keys(files).length === 0) {
            //console.log("NONONONO")
            return;
        }
        const importDynamic = async () => {
            //console.log("OOOOOOOOOOOOOOOOOOOOOOOOOO{PHHHHH")
            //console.log(files);
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
            //console.log("AYAYAYAYA")
            //console.log(files)
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
        if (!dynamicImportDone) {
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
    files: FileSystemTree,
    terminal_instance: any, //These are any because the imports have to be dynamic, so I don't have the types
    setWebContainer: React.Dispatch<WebContainer>,
    setWebContainerStatus: React.Dispatch<number>,
    setWebContainerURL: React.Dispatch<string>,
) => {
    //console.log("AYAYAYAYA")
    const webContainerInstance = await WebContainer.boot({
        workdirName: 'react-app'
    });
    //console.log("Post create");
    webContainerInstance.mount(files)
    //console.log("Post mount");
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

const installDependencies = async (webContainerInstance: WebContainer, terminal_instance: any) => {
    //console.log("Installing dependencies");
    const installProcess = await webContainerInstance.spawn('pnpm', ['install']);
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

const runServer = async (webContainerInstance: WebContainer, setWebContainerURL: React.Dispatch<string>) => {
    //console.log("Running server");
    const startProcess = await webContainerInstance.spawn('npm', ['start']);
    webContainerInstance.on('server-ready', (port, url) => {
        setWebContainerURL(url);
        //console.log(url)
    });
}

const startShell = async (webContainerInstance: WebContainer, terminal_instance: any) => {
    //console.log("Starting shell");
    const shellProcess = await webContainerInstance.spawn('jsh')
    shellProcess.output.pipeTo(
        new WritableStream({
            write(data) {
                terminal_instance.write(data);
            },
        })
    )

    const shellInput = shellProcess.input.getWriter();
    terminal_instance.onData((data: string) => {
        shellInput.write(data);
    });

    return shellProcess;
}
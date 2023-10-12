import React, { createContext } from "react";

export const EditorContext = createContext({
    //GPT Messages
    messageHistory: [],
    setMessageHistory: () => { },
    //Project Files
    files: {},
    setFiles: () => { },
    //Code Editor Files
    openFiles: [],
    setOpenFiles: () => { },
    //The web container duh
    webContainer: null,
    setWebContainer: () => { },
    //Project Wide settings
    projectSettings: {},
    setProjectSettings: () => { },
    //Save might be something a lot of components want to do
    saveProject: () => { },
    //Might want to add the offsets for the view panels here
});

export const EditorContextProvider = ({
    children,
    messageHistory,
    setMessageHistory,
    files,
    setFiles,
    openFiles,
    setOpenFiles,
    webContainer,
    setWebContainer,
    projectSettings,
    setProjectSettings,
    saveProject,
}) => {
    return (
        <EditorContext.Provider
            value={{
                messageHistory,
                setMessageHistory,
                files,
                setFiles,
                openFiles,
                setOpenFiles,
                webContainer,
                setWebContainer,
                projectSettings,
                setProjectSettings,
                saveProject,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
}
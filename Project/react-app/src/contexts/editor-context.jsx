import React, { createContext } from "react";

export const EditorContext = createContext({
    //GPT Messages
    messageHistory: [],
    setMessageHistory: () => { },
    //Project Files
    files: {},
    setFiles: () => { },
    //Code Editor Files
    openFilePaths: [],
    setOpenFilePaths: () => { },
    openFilePathIndex: 0,
    setOpenFilePathIndex: () => { },
    lastClicked: null,
    setLastClicked: () => { },
    //File Operations
    fileOperations: {},
    //The web container duh
    webContainer: null,
    setWebContainer: () => { },
    //Project Wide settings
    // projectSettings: {},
    // setProjectSettings: () => { },
    //Save might be something a lot of components want to do
});

export const EditorContextProvider = ({
    children,
    messageHistory,
    setMessageHistory,
    files,
    setFiles,
    openFilePaths,
    setOpenFilePaths,
    openFilePathIndex,
    setOpenFilePathIndex,
    lastClicked,
    setLastClicked,
    fileOperations,
    webContainer,
    setWebContainer,
    // projectSettings,
    // setProjectSettings,

}) => {
    return (
        <EditorContext.Provider
            value={{
                messageHistory,
                setMessageHistory,
                files,
                setFiles,
                openFilePaths,
                setOpenFilePaths,
                openFilePathIndex,
                setOpenFilePathIndex,
                lastClicked,
                setLastClicked,
                fileOperations,
                webContainer,
                setWebContainer,
                // projectSettings,
                // setProjectSettings,

            }}
        >
            {children}
        </EditorContext.Provider>
    );
}

export const useEditorContext = () => {
    const context = React.useContext(EditorContext);
    if (context === undefined) {
        throw new Error(
            "useEditorContext must be used within a EditorContextProvider"
        );
    }
    return context;
};
import React, { createContext, useState, useContext, useEffect, FC } from "react";

import reactFileTemplate from '@/thatOneStuffFolderUsuallyCalledUtils/reactFileTemplate'

import fileOperations, { fileOperationsType } from "@/thatOneStuffFolderUsuallyCalledUtils/fileOperations";
import { useSession } from "next-auth/react";
import { FileSystemTree, WebContainer } from "@webcontainer/api";

type MessageType = {
    role: string,
    content: string,
    model?: string,
}

export const EditorContext = createContext({
    //GPT Messages
    messageHistory: [] as MessageType[],
    setMessageHistory: (value: MessageType[]) => { },
    //Project Files
    files: {} as FileSystemTree,
    setFiles: (value: FileSystemTree) => { },
    //Code Editor Files
    openFilePaths: [] as string[],
    setOpenFilePaths: (value: string[]) => { },
    openFilePathIndex: 0 as null | number,
    setOpenFilePathIndex: (value: null | number) => { },
    highlightedPath: null as null | string,
    setHighlightedPath: (value: null | string) => { },
    expandedPaths: [] as string[],
    setExpandedPaths: (value: string[]) => { },
    //File Operations
    fileOperations: {} as fileOperationsType,
    //The web container duh
    webContainer: null as null | WebContainer,
    setWebContainer: (value: WebContainer) => { },
    //Project Wide settings
    projectData: {} as any, // This needs to be the project model 🐢
    setProjectData: (value: any) => { }, // This needs to be the project model 🐢
    saveProject: () => { },
    //Save might be something a lot of components want to do
});

interface EditorContextProviderProps {
    children: React.ReactNode;
    project_in: any;
}

export const EditorContextProvider: FC<EditorContextProviderProps> = ({
    children,
    project_in
}) => {
    //console.log(project_in)
    const session = useSession();
    // Don't forget to remove sample message 💭
    const [messageHistory, setMessageHistory] = useState<MessageType[]>([{
        role: 'assistant',
        content: "```\n" + "import React from 'react'; \
        \nimport { Box, Typography } from '@mui/material'; \
        \n \
        \nexport const SampleComponent = () => { \
        \n    return ( \
        \n        <Box sx={{ \
        \n            display: 'flex', \
        \n            flexDirection: 'column', \
        \n            justifyContent: 'flex-start', \
        \n            alignItems: 'flex-start', \
        \n            width: '100%', \
        \n            height: '100%', \
        \n        }}> \
        \n            <Typography variant='h1'> \
        \n                Hello World! \
        \n            </Typography> \
        \n        </Box> \
        \n    ); \
        \n} \
        " + "\n```",
        model: 'gpt-4-0613'
    }]);


    const [files, setFiles] = useState<FileSystemTree>(project_in.file_structure);

    const [webContainer, setWebContainer] = useState<null | WebContainer>(null);

    const [openFilePaths, setOpenFilePaths] = useState<string[]>([]);

    const [openFilePathIndex, setOpenFilePathIndex] = useState<null | number>(0);

    const [highlightedPath, setHighlightedPath] = useState<null | string>(null);

    let projectMetaData = { ...project_in };
    // remove the file_structure from the projectMetaData
    delete projectMetaData.file_structure;

    const [projectData, setProjectData] = useState<null | any>(projectMetaData); //Need to make a type for metadata 🐢

    const [expandedPaths, setExpandedPaths] = useState<string[]>([]);

    const saveProject = async () => {
        const body = {
            ...projectData,
            file_structure: files,
        }
        //console.log(body)


        const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL}/by_id/${projectMetaData.project_id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                // @ts-ignore // I modified session to have a token attached, I need to make a model for it
                "Authorization": `Bearer ${session.data.token}`,
            },
            body: JSON.stringify(body)
        })
    }


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
                highlightedPath,
                setHighlightedPath,
                expandedPaths,
                setExpandedPaths,
                fileOperations,
                webContainer,
                setWebContainer,
                projectData,
                setProjectData,
                saveProject,
            }}
        >
            {children}
        </EditorContext.Provider>
    );
}

// Everything custom hook ------------------------------------------------------

export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error(
            "useEditorContext must be used within a EditorContextProvider"
        );
    }
    return context;
};

// Specific Custom hooks --------------------------------------------------------

export const useMessageHistory = () => {
    const { messageHistory, setMessageHistory } = useEditorContext();
    return { messageHistory, setMessageHistory };
}

export const useFiles = () => {
    const { files, setFiles, fileOperations } = useEditorContext();
    return { files, setFiles, fileOperations };
}

export const useFilePaths = () => {
    const { openFilePaths, setOpenFilePaths, openFilePathIndex, setOpenFilePathIndex, highlightedPath, setHighlightedPath, expandedPaths, setExpandedPaths } = useEditorContext();
    return { openFilePaths, setOpenFilePaths, openFilePathIndex, setOpenFilePathIndex, highlightedPath, setHighlightedPath, expandedPaths, setExpandedPaths };
}

export const useWebContainer = () => {
    const { webContainer, setWebContainer } = useEditorContext();
    return { webContainer, setWebContainer };
}

export const useProjectData = () => {
    const { projectData, setProjectData } = useEditorContext();
    return { projectData, setProjectData };
}
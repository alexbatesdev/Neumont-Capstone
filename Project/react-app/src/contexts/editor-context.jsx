import React, { createContext, useState, useContext, useEffect } from "react";

import reactFileTemplate from '@/thatOneStuffFolderUsuallyCalledUtils/reactFileTemplate'

import fileOperations from "@/thatOneStuffFolderUsuallyCalledUtils/fileOperations";
import { useSession } from "next-auth/react";

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
    highlightedPath: null,
    setHighlightedPath: () => { },
    expandedPaths: [],
    setExpandedPaths: () => { },
    //File Operations
    fileOperations: {},
    //The web container duh
    webContainer: null,
    setWebContainer: () => { },
    //Project Wide settings
    projectData: {},
    setProjectData: () => { },
    saveProject: () => { },
    //Save might be something a lot of components want to do
    isProjectSaved: true,
    setIsProjectSaved: () => { },
    hasEditAccess: false,
    contextOpen: false,
    setContextOpen: () => { },
    contextCoords: { x: 0, y: 0 },
    setContextCoords: () => { },
    contextMenuItems: [],
    setContextMenuItems: () => { },
    contextMenuHelperOpen: false,
    setContextMenuHelperOpen: () => { },
    contextMenuHelper: null,
    setContextMenuHelper: () => { },
});

export const EditorContextProvider = ({
    children,
    project_in,
    hasEditAccess,
}) => {
    //console.log(project_in)
    const session = useSession();
    // Don't forget to remove sample message 💭
    const [messageHistory, setMessageHistory] = useState([{
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


    const [files, setFiles] = useState(project_in.file_structure);

    const [webContainer, setWebContainer] = useState(null);

    const [openFilePaths, setOpenFilePaths] = useState([]);

    const [openFilePathIndex, setOpenFilePathIndex] = useState(0);

    const [highlightedPath, setHighlightedPath] = React.useState(null);

    let projectMetaData = { ...project_in };
    // remove the file_structure from the projectMetaData
    delete projectMetaData.file_structure;

    const [projectData, setProjectData] = useState(projectMetaData);

    const [expandedPaths, setExpandedPaths] = useState([]);

    const [isProjectSaved, setIsProjectSaved] = useState(true);

    const [contextOpen, setContextOpen] = useState(false);

    const [contextCoords, setContextCoords] = useState({ x: 0, y: 0 });

    const [contextMenuItems, setContextMenuItems] = useState([]);

    const [contextMenuHelperOpen, setContextMenuHelperOpen] = useState(false);

    const [contextMenuHelper, setContextMenuHelper] = useState(null);

    const saveProject = async () => {
        if (!hasEditAccess) {
            return;
        }

        const body = {
            ...projectData,
            file_structure: files,
        }
        //console.log(body)


        const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL}/by_id/${projectMetaData.project_id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.data.token}`,
            },
            body: JSON.stringify(body)
        })
        setIsProjectSaved(true);
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
                isProjectSaved,
                setIsProjectSaved,
                hasEditAccess,
                contextOpen,
                setContextOpen,
                contextCoords,
                setContextCoords,
                contextMenuItems,
                setContextMenuItems,
                contextMenuHelperOpen,
                setContextMenuHelperOpen,
                contextMenuHelper,
                setContextMenuHelper,
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

export const useContextMenu = () => {
    const { contextOpen, setContextOpen, contextCoords, setContextCoords, contextMenuItems, setContextMenuItems, contextMenuHelperOpen, setContextMenuHelperOpen, contextMenuHelper, setContextMenuHelper } = useEditorContext();
    return { contextOpen, setContextOpen, contextCoords, setContextCoords, contextMenuItems, setContextMenuItems, contextMenuHelperOpen, setContextMenuHelperOpen, contextMenuHelper, setContextMenuHelper };
}
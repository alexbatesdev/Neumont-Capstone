import React, { createContext, useState, useContext, useEffect } from "react";

import reactFileTemplate from '@/thatOneStuffFolderUsuallyCalledUtils/reactFileTemplate'

import fileOperations from "@/thatOneStuffFolderUsuallyCalledUtils/fileOperations";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";
import JSZip from "jszip";

export const EditorContext = createContext({
    //GPT Messages
    messageHistory: [],
    setMessageHistory: () => { },
    conversationThreadID: null,
    setConversationThreadID: () => { },
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
    codeEditorDiffMode: false,
    setCodeEditorDiffMode: () => { },
    codeEditorDiffValue: "",
    setCodeEditorDiffValue: () => { },
    //File Operations
    fileOperations: {},
    //The web container duh
    webContainer: null,
    setWebContainer: () => { },
    hideWebContainerFrame: false,
    setHideWebContainerFrame: () => { },
    //Project Wide settings
    projectData: {},
    setProjectData: () => { },
    saveProject: () => { },
    //Save might be something a lot of components want to do
    handleDownloadProject: () => { },
    //This^ logic is better off here instead of in the sidebar
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
    const [messageHistory, setMessageHistory] = useState([]);
    const [conversationThreadID, setConversationThreadID] = useState(null);

    //🐢 - If the project or file structure is null, set it to an empty object
    const [files, setFiles] = useState(project_in ? (project_in.file_structure == null ? {} : project_in.file_structure) : {});

    const [webContainer, setWebContainer] = useState(null);

    const [openFilePaths, setOpenFilePaths] = useState([]);

    const [openFilePathIndex, setOpenFilePathIndex] = useState(0);

    const [highlightedPath, setHighlightedPath] = React.useState(null);

    let projectMetaData = { ...project_in };
    // remove the file_structure from the projectMetaData
    delete projectMetaData.file_structure;

    const [projectData, setProjectData] = useState(projectMetaData);

    const [expandedPaths, setExpandedPaths] = useState([]);

    const [codeEditorDiffMode, setCodeEditorDiffMode] = useState(false);

    const [codeEditorDiffValue, setCodeEditorDiffValue] = useState("");

    const [isProjectSaved, setIsProjectSaved] = useState(true);

    const [contextOpen, setContextOpen] = useState(false);

    const [contextCoords, setContextCoords] = useState({ x: 0, y: 0 });

    const [contextMenuItems, setContextMenuItems] = useState([]);

    const [contextMenuHelperOpen, setContextMenuHelperOpen] = useState(false);

    const [contextMenuHelper, setContextMenuHelper] = useState(null);

    const [hideWebContainerFrame, setHideWebContainerFrame] = useState(false);

    const saveProject = async () => {
        if (!hasEditAccess) {
            return;
        }

        const body = {
            ...projectData,
            file_structure: files,
        }
        console.log(body)

        let success = true;
        const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL}/by_id/${projectMetaData.project_id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${session.data.token}`,
            },
            body: JSON.stringify(body)
        }).catch(err => {
            toast.error("Error saving project. Download your project to save preserve your work and try again later.")
            success = false;
            return
        })
        if (success) {
            setIsProjectSaved(true);
            toast.success("Project saved")
        }
    }

    useEffect(() => {
        const api_key = session.data == "authenticated" ? (session.data.user.openai_api_key != null ? session.data.user.openai_api_key : "None") : "None";
        const url = `${process.env.NEXT_PUBLIC_GPT_INTERFACE_API_URL}/new/thread/${api_key}`
        const response = fetch(url, {
            method: 'POST',
        }).then(res => {
            console.log(res)
            return res.json()
        }).then(data => {
            console.log(data)
            setConversationThreadID(data)
        }).catch(err => {
            console.log(err)
            toast.error("Error creating conversation thread. Refresh the page to try again.")
            setConversationThreadID(null)
        })
    }, [])

    const handleDownloadProject = async () => {
        const zipper = new JSZip();
        const promises = [];

        for (const file of Object.keys(files)) {
            console.log(file)
            if (files[file].hasOwnProperty("directory")) {
                console.log("Directory")
                promises.push(recursiveZipper(zipper, files[file].directory, file))
            } else {
                console.log("File")
                console.log(files[file])
                zipper.file(file, files[file].file.contents);
            }
        }
        //Thing happen here, but only after all of the recursiveZipper calls are done
        await Promise.all(promises);

        // Now generate the ZIP file and trigger the download
        zipper.generateAsync({ type: "blob" })
            .then(function (content) {
                // Create a temporary link to trigger the download
                const tempLink = document.createElement("a");
                tempLink.href = URL.createObjectURL(content);
                tempLink.download = "project.zip"; // Suggest a filename for the download

                // Append link to body, click it, and then remove it
                document.body.appendChild(tempLink);
                tempLink.click();
                document.body.removeChild(tempLink);

                // Clean up by revoking the Blob URL
                URL.revokeObjectURL(tempLink.href);
            });
    }

    const recursiveZipper = async (zipper, fileTree, path) => {
        const promises = [];

        for (const file of Object.keys(fileTree)) {
            console.log(file)
            console.log(path + "/" + file)
            if (fileTree[file].hasOwnProperty("directory")) {
                console.log("Directory")
                promises.push(recursiveZipper(zipper, fileTree[file].directory, path + "/" + file))
            } else {
                console.log("File")
                console.log(fileTree[file])
                zipper.file(path + "/" + file, fileTree[file].file.contents);
            }
        }

        await Promise.all(promises);
    }

    return (
        <EditorContext.Provider
            value={{
                messageHistory,
                setMessageHistory,
                conversationThreadID,
                setConversationThreadID,
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
                codeEditorDiffMode,
                setCodeEditorDiffMode,
                codeEditorDiffValue,
                setCodeEditorDiffValue,
                fileOperations,
                webContainer,
                setWebContainer,
                hideWebContainerFrame,
                setHideWebContainerFrame,
                projectData,
                setProjectData,
                saveProject,
                handleDownloadProject,
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
    const { messageHistory, setMessageHistory, conversationThreadID, setConversationThreadID } = useEditorContext();
    return { messageHistory, setMessageHistory, conversationThreadID, setConversationThreadID };
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
    const { webContainer, setWebContainer, hideWebContainerFrame, setHideWebContainerFrame } = useEditorContext();
    return { webContainer, setWebContainer, hideWebContainerFrame, setHideWebContainerFrame };
}

export const useProjectData = () => {
    const { projectData, setProjectData, isProjectSaved, setIsProjectSaved } = useEditorContext();
    return { projectData, setProjectData };
}

export const useContextMenu = () => {
    const { contextOpen, setContextOpen, contextCoords, setContextCoords, contextMenuItems, setContextMenuItems, contextMenuHelperOpen, setContextMenuHelperOpen, contextMenuHelper, setContextMenuHelper } = useEditorContext();
    return { contextOpen, setContextOpen, contextCoords, setContextCoords, contextMenuItems, setContextMenuItems, contextMenuHelperOpen, setContextMenuHelperOpen, contextMenuHelper, setContextMenuHelper };
}
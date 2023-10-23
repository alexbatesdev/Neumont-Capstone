import React, { createContext, useState, useContext } from "react";

import reactFileTemplate from '@/thatOneStuffFolderUsuallyCalledUtils/reactFileTemplate'

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
    // projectSettings: {},
    // setProjectSettings: () => { },
    //Save might be something a lot of components want to do
});

export const EditorContextProvider = ({
    children,
    files_in
}) => {
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

    // Used code from work for reference, my boss said to feel free to use our company code as a learning resource 
    // (Sounds odd and very generous until you learn that he was my highschool teacher before he was my boss, then it's just very generous)
    // I am making sure the code is my own, there are ways of doing things in here that I know aren't my style, and I almost never think of recursion as a solution (I need to get better at this)
    // The main way I made this my own is by making swappable actionMethods. I don't know how this will go, but hopefully it's DRY B)
    const fileTraverse = (directory, splitPath, actionMethod, parameters = []) => {
        // For some reason fileTraverse is being called with a null directory and I don't know why
        // This patches that issue up, but I wish I knew why it was happening
        if (directory == null) {
            console.log("Directory is null")
            return;
        }

        // console.log("Entering fileTraverse")
        // console.log("directory: ", directory)
        // console.log("splitpath: ", splitpath)
        // console.log("actionMethod: ", actionMethod)
        let splitPathClone = [...splitPath];
        //Get the next chunk of the path
        let path = splitPathClone.shift();
        // console.log("path: ", path);

        if (path == '.') {
            // console.log("Path is a dot");
            //If it's a dot, thats the same as being at the end
            path = splitPathClone.shift();
            // console.log("newPath: ", path)
        }

        //If it's the last chunk,
        if (splitPathClone.length == 0) {
            // console.log("Triggering actionMethod");
            // console.log("directory: ", directory)
            return actionMethod(directory, path, ...parameters);
        }
        // console.log("---------")
        //If it's not the last chunk, and the path doesn't exist yet,
        let currentDirectory;
        //If the path doesn't exist yet,
        if (!directory[path]) {
            // create it
            directory[path] = {
                directory: {}
            }
        }
        //Then set the currentDirectory to the next directory
        currentDirectory = directory[path].directory;
        // console.log("newDirectory: ", currentDirectory)
        // console.log("Exiting fileTraverse")
        //Then recurse
        return fileTraverse(currentDirectory, splitPathClone, actionMethod, parameters);
    }

    //Creates or overrides a file at the given path
    const setFile = (directory, path, contents) => {
        // console.log("Setting file")
        directory[path] = {
            file: {
                contents: contents,
            }
        }
        return;
    }

    const addDirectory = (directory, path) => {
        directory[path] = {
            directory: {}
        }
        return;
    }

    const deleteFile = (directory, path) => {
        delete directory[path];
        return;
    }

    const deleteDirectory = (directory, path) => {
        delete directory[path];
        return;
    }

    const getFile = (directory, path) => {
        console.log("Getting file")
        console.log(directory)
        console.log(path)
        console.log(directory[path])
        return directory[path].file.contents;
    }

    const getDirectoryContents = async (tree = {}, path = "") => {
        const contents = await webContainer.fs.readdir(path, { withFileTypes: true });
        // console.log(tree);
        // console.log(contents);

        for (const node of contents) {
            // console.log(path + "/" + node.name);

            if (node.isFile()) {
                tree[node.name] = {
                    file: {
                        contents: {}
                    }
                };
                tree[node.name].file.contents = await webContainer.fs.readFile(path + "/" + node.name, 'utf-8');
            } else if (node.isDirectory()) {
                if (node.name === 'node_modules') {
                    tree[node.name] = {
                        directory: {}
                    };
                    continue;
                }
                const newPath = (path + "/" + node.name);
                tree[node.name] = {
                    directory: {}
                };
                await getDirectoryContents(tree[node.name].directory, newPath);
            }
        }

        // console.log(tree);
        return tree;
    };

    //Wrapper functions for easier use
    const fileOperations = {
        writeFile: (fileTree, path, contents) => {
            fileTraverse(fileTree, path.split("/"), setFile, [contents]);
        },
        addDirectory: (fileTree, path) => {
            fileTraverse(fileTree, path.split("/"), addDirectory);
        },
        deleteFile: (fileTree, path) => {
            fileTraverse(fileTree, path.split("/"), deleteFile);
        },
        deleteDirectory: (fileTree, path) => {
            fileTraverse(fileTree, path.split("/"), deleteDirectory);
        },
        getFileContents: (path) => {
            const filepath = path; //Renaming the variable due to how ... operator works
            return fileTraverse(files, path.split("/"), getFile, [filepath]);
        },
        getFileTree: async () => {
            return await getDirectoryContents();
        }
    }

    const [files, setFiles] = useState(files_in);

    const [webContainer, setWebContainer] = useState(null);

    const [openFilePaths, setOpenFilePaths] = useState([]);

    const [openFilePathIndex, setOpenFilePathIndex] = useState(0);

    const [highlightedPath, setHighlightedPath] = React.useState(null);

    const [projectSettings, setProjectSettings] = useState({});

    const [expandedPaths, setExpandedPaths] = useState([]);


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
                // projectSettings,
                // setProjectSettings,

            }}
        >
            {children}
        </EditorContext.Provider>
    );
}

export const useEditorContext = () => {
    const context = useContext(EditorContext);
    if (context === undefined) {
        throw new Error(
            "useEditorContext must be used within a EditorContextProvider"
        );
    }
    return context;
};

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
import React, { useEffect, useState } from 'react'
import { PreviewComponent } from '@/components/reactPreview'
import { CodeEditor } from '@/components/codeEditor'
import { ResizableViewsHorizontal, ResizableViewsVertical } from '@/components/resizableViews'
import { SideBar } from '@/components/sideBar'
import { useTheme } from '@mui/material/styles';
import { EditorContextProvider } from '@/contexts/editor-context'
import reactFileTemplate from '@/thatOneStuffFolderUsuallyCalledUtils/reactFileTemplate'
import dynamic from 'next/dynamic'

const PreviewAndTerminal = dynamic(
    () => import('@/components/previewTerminalParent'),
    { ssr: false }
)



//https://www.npmjs.com/package/@monaco-editor/react
// I don't think this applies to me, but it might vvv
//NOTE: you should be aware that this may require additional webpack plugins, like monaco-editor-webpack-plugin or it may be impossible to use in apps generated by CRA without ejecting them.

export default function Home() {
    const theme = useTheme();
    const [terminal, setTerminal] = useState(null);

    let sample_snippet_2 = "import React from 'react'; \
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
    "
    //Should be gotten from backend
    const initialFiles = reactFileTemplate;

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
        // console.log("Getting file")
        // console.log(directory)
        // console.log(path)
        // console.log(directory[path])
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
        addDirectory: (path) => {
            fileTraverse(fileTree, path.split("/"), addDirectory);
        },
        deleteFile: (path) => {
            fileTraverse(fileTree, path.split("/"), deleteFile);
        },
        deleteDirectory: (path) => {
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

    const [files, setFiles] = useState(initialFiles);

    const [openFilePaths, setOpenFilePaths] = useState(["./src/App.js"]);

    const [openFilePathIndex, setOpenFilePathIndex] = useState(0);

    const [lastClicked, setLastClicked] = React.useState(null);

    const [webContainer, setWebContainer] = useState(null);


    const [messageHistory, setMessageHistory] = useState([{
        role: 'assistant',
        content: "```\n" + sample_snippet_2 + "\n```",
        model: 'gpt-4-0613'
    }]);
    const [sidebarWidth, setSidebarWidth] = React.useState("300px");

    const [projectSettings, setProjectSettings] = useState({});

    const terminalRef = React.useRef(null);

    useEffect(() => {
        console.log("Files changed")
        console.log(files)
    }, [files])

    // const components_2 = [
    //     {
    //         slot: 0,
    //         component: <PreviewComponent />
    //     },
    //     {
    //         slot: 1,
    //         component: <Terminal />
    //     }
    // ]

    const components = [
        {
            slot: 0,
            component: <CodeEditor />
        },
        {
            slot: 1,
            component: <PreviewAndTerminal />
        }
    ]

    return (
        <EditorContextProvider
            messageHistory={messageHistory}
            setMessageHistory={setMessageHistory}
            files={files}
            setFiles={setFiles}
            openFilePaths={openFilePaths}
            setOpenFilePaths={setOpenFilePaths}
            openFilePathIndex={openFilePathIndex}
            setOpenFilePathIndex={setOpenFilePathIndex}
            fileOperations={fileOperations}
            lastClicked={lastClicked}
            setLastClicked={setLastClicked}
            webContainer={webContainer}
            setWebContainer={setWebContainer}
            projectSettings={projectSettings}
            setProjectSettings={setProjectSettings}
            saveProject={() => { }}
            terminal_instance={terminal}
        >
            <div
                className='pageWrapper' // I might reuse this
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    minWidth: '100vw',
                    minHeight: '100vh',
                    backgroundColor: theme.palette.background.default,
                    overflow: 'hidden',
                    position: 'relative',
                }}>
                <div
                    className='topBar'
                    style={{
                        width: '100%',
                        maxWidth: '100vw',
                        height: '50px',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        backgroundColor: theme.palette.background.default,
                    }}
                >

                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        width: "100%",
                        height: "calc(100vh - 50px)",
                    }}>
                    <SideBar sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
                    <div style={{
                        width: `calc(100% - ${sidebarWidth})`,
                        height: '100%',
                    }}>
                        <ResizableViewsHorizontal items={components} />
                    </div>
                </div>
            </div>
        </EditorContextProvider>
    )
}

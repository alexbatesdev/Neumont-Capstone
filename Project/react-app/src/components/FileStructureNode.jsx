import React, { useEffect, useState } from 'react';

import { useTheme } from '@mui/material/styles'; // Import useTheme from Material-UI
import { Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';

import { useEditorContext, useFilePaths, useWebContainer } from '@/contexts/editor-context';
import { FileNodeIcon } from './FileNodeIcon';
import { useWebContainerContext } from '@/contexts/webContainerContext';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import AddButton from './AddButton';
import AddNodePrompt from './AddNodePrompt';
import RenameNodePrompt from './RenameNodePrompt';
// This is an assistant-generated boilerplate for a React functional component.
// You can customize this component by adding your own props, state, and logic.

const getOpenFilePathIndex = (openFilePaths, filePath) => {
    for (let index = 0; index < openFilePaths.length; index++) {
        if (openFilePaths[index].path == filePath) {
            return index
        }
    }
    return -1
}

function FileStructureNode({ currentNodeTree, path, depth = 0 }) {
    const theme = useTheme(); // Use the Material-UI useTheme hook
    const [isHovered, setIsHovered] = useState(false);
    // I've made specific hooks to use just some parts of the editor context, but some components like this one need a lot of the context so they just use the hook that has everything
    const {
        //Filepath hook
        setOpenFilePaths, openFilePaths, setOpenFilePathIndex, openFilePathIndex, highlightedPath, setHighlightedPath, expandedPaths, setExpandedPaths,
        //Web Container Hook
        webContainer,
        //Files hook
        fileOperations, files, setFiles,
        // Context Menu hook
        contextOpen, setContextOpen, contextCoords, setContextCoords, contextMenuItems, setContextMenuItems, contextMenuHelperOpen, setContextMenuHelperOpen, contextMenuHelper, setContextMenuHelper,
        // Diff Editor Stuff
        codeEditorDiffMode, setCodeEditorDiffMode, codeEditorDiffValue, setCodeEditorDiffValue,
        // Project Data hook
        isProjectSaved, setIsProjectSaved
    } = useEditorContext();

    useEffect(() => {
        if (currentNodeTree == undefined) {
            return;
        }
        const handleDirectoryUpdate = async (path) => {
            // console.log("Updating directory: " + pathNotModules)
            setIsProjectSaved(false)
            let directoryContents = await fileOperations.getDirectory(webContainer, path)
            if (directoryContents == null) directoryContents = {}
            // console.log(directoryContents);
            // console.log("Call set Directory from FileStructureNode")
            fileOperations.setDirectory(files, path, directoryContents).then((value) => {
                const newValue = { ...value }
                setFiles(newValue)
            })
        }
        let watcher = null;
        if (currentNodeTree.hasOwnProperty('directory')) {
            // This omits the directory and it's children from the watcher
            // I should probably make this more robust 💭
            let splitPath = path.split("/")
            if (splitPath.includes("node_modules")) return;
            if (splitPath.includes(".next")) return;

            if (webContainer) {

                watcher = webContainer.fs.watch(path, (event, filename) => {
                    //if the filename starts with _tmp, ignore it

                    // console.log("File Changed")
                    // console.log(event, filename)
                    if (filename.substring(0, 4) == "_tmp") {
                        //console.log("Ignoring _tmp file")
                        return;
                    }

                    console.log("HandleDirectoryUpdate PATH: ", path)
                    handleDirectoryUpdate(path)
                })
            }
        }
        return () => {
            if (watcher) {
                watcher.close()
            }
        }
    }, [webContainer, currentNodeTree, path])

    if (currentNodeTree == undefined) {
        //console.log("Current Node Tree is undefined")
        return;
    }
    const displayName = Object.keys(currentNodeTree)[0]
    currentNodeTree = currentNodeTree[Object.keys(currentNodeTree)[0]]

    const typographyStyle = {
        userSelect: 'none',
    }

    const rowStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: (isHovered || path == highlightedPath) ? theme.palette.background.default : 'transparent',
        paddingLeft: `${(depth * 10) + 10}px`,
        width: `calc(100% - ${(depth * 10) + 10}px)`,
        paddingTop: '3px',
        paddingBottom: '3px',
        position: 'relative',
    }

    const handleClick = () => {
        if (expandedPaths.includes(path)) {
            setExpandedPaths((prevExpandedPaths) => {
                const newExpandedPaths = [...prevExpandedPaths]
                newExpandedPaths.splice(newExpandedPaths.indexOf(path), 1)
                return newExpandedPaths
            })
        } else {
            setExpandedPaths((prevExpandedPaths) => {
                return [...prevExpandedPaths, path]
            })
        }
        setHighlightedPath(path)
    }

    const handleDirectoryContextMenu = (event) => {
        event.preventDefault();
        setHighlightedPath(path)
        // console.log("Context Menu: " + path);
        setContextOpen(true)
        setContextCoords({ x: event.pageX, y: event.pageY })
        setContextMenuItems([
            {
                text: "New File/Folder",
                // icon: <AddCircleOutlineIcon />,
                method: () => {
                    setContextMenuHelperOpen(true)
                    setContextMenuHelper(<AddNodePrompt path={path} isOpen={true} setIsOpen={(bool) => {
                        setContextMenuHelperOpen(bool)
                        setContextMenuHelper(null)
                        setContextOpen(bool)
                        setIsProjectSaved(false)
                    }} />)
                }
            },
            {
                text: "Rename Folder",
                // icon: <AddCircleOutlineIcon />,
                method: () => {
                    setContextMenuHelperOpen(true)
                    setContextMenuHelper(<RenameNodePrompt path={path} isDirectory={true} setIsOpen={(bool) => {
                        setContextMenuHelperOpen(bool)
                        setContextMenuHelper(null)
                        setContextOpen(bool)
                        setIsProjectSaved(false)
                    }} />)
                }
            },
            {
                text: "Delete Folder",
                method: () => {
                    webContainer.fs.rm(path, { recursive: true })
                    setContextOpen(false)
                    setIsProjectSaved(false)
                }
            }
        ])
        document.addEventListener('click', () => {
            setContextOpen(false)
            setContextMenuItems([])
            setContextCoords({ x: 0, y: 0 })
            // setContextMenuHelperOpen(false)
            // setContextMenuHelper(null)
        });
    }

    const handleFileContextMenu = (event) => {
        event.preventDefault();
        setHighlightedPath(path)
        // console.log("Context Menu: " + path);
        setContextOpen(true)
        setContextCoords({ x: event.pageX, y: event.pageY })
        setContextMenuItems([
            {
                text: "Rename File",
                // icon: <AddCircleOutlineIcon />,
                method: () => {
                    setContextMenuHelperOpen(true)
                    setContextMenuHelper(<RenameNodePrompt path={path} isDirectory={false} setIsOpen={(bool) => {
                        setContextMenuHelperOpen(bool)
                        setContextMenuHelper(null)
                        setContextOpen(bool)
                    }} />)
                    setIsProjectSaved(false)
                }
            },
            {
                text: "Delete File",
                method: () => {
                    if (openFilePaths[openFilePathIndex] && path == openFilePaths[openFilePathIndex].path) {
                        setOpenFilePaths((prevOpenFilePaths) => {
                            const newOpenFilePaths = [...prevOpenFilePaths]
                            newOpenFilePaths.splice(openFilePathIndex, 1)
                            return newOpenFilePaths
                        })
                        setOpenFilePathIndex(0)
                    }
                    webContainer.fs.rm(path)
                    setContextOpen(false)
                    setIsProjectSaved(false)
                }
            },
            {
                text: "Open In Diff Editor",
                method: () => {
                    if (codeEditorDiffMode) {
                        setCodeEditorDiffMode(false);
                        setCodeEditorDiffValue("");
                    } else {
                        setCodeEditorDiffMode(true);
                        setCodeEditorDiffValue(fileOperations.getFileContents(files, path));
                    }
                    setContextOpen(false)
                    setIsProjectSaved(false)
                }
            }
        ])
        document.addEventListener('click', () => {
            setContextOpen(false)
            setContextMenuItems([])
            setContextCoords({ x: 0, y: 0 })
            setContextMenuHelper(null)
            // setContextMenuHelperOpen(false)
            setIsProjectSaved(false)
        });
    }

    // console.log(currentNodeTree.)
    // Spelling counts!
    if (currentNodeTree.hasOwnProperty('directory')) {

        let fileKeys = Object.keys(currentNodeTree.directory)
        let fileKeys_folders = []
        let fileKeys_files = []

        fileKeys.forEach((key, index) => {
            const node = currentNodeTree.directory[key];
            if (node.hasOwnProperty('directory')) {
                fileKeys_folders.push(key)
            } else {
                fileKeys_files.push(key)
            }
        })

        // sort the keys alphabetically
        fileKeys_folders = fileKeys_folders.sort((a, b) => {
            return a.localeCompare(b)
        })

        fileKeys_files = fileKeys_files.sort((a, b) => {
            return a.localeCompare(b)
        })

        fileKeys = fileKeys_folders.concat(fileKeys_files)
        // If the current node is a directory
        // Render a directory
        // if (path == "./node_modules") {
        //     return null;
        // }


        return (
            <>
                <style>
                    {`
                        @keyframes rotatePLUS {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                            transform: rotate(180deg);
                        }
                    }
                    `}
                </style>
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleClick}
                    onContextMenu={handleDirectoryContextMenu}
                    style={rowStyle}>
                    <FileNodeIcon filename={displayName} isFolder={true} isOpen={expandedPaths.includes(path)} />
                    <Typography variant='body1' style={typographyStyle}>
                        {displayName}
                    </Typography>

                    <span style={{
                        zIndex: "3",
                        marginLeft: 'auto',
                        marginRight: '5px',
                    }}>
                        <AddButton isHovered={isHovered} path={path} />
                    </span>

                </div>
                <Collapse
                    in={expandedPaths.includes(path)}
                    timeout={200}
                    sx={{
                        width: '100%',
                    }}>
                    {
                        fileKeys.map((key, index) => {
                            const node = {
                                [key]: currentNodeTree.directory[key]
                            }
                            return (
                                <FileStructureNode key={key + "-" + index} currentNodeTree={node} depth={depth + 1} path={path + "/" + key} />
                            );
                        })

                    }

                </Collapse>
            </>
        );
    }
    else if (currentNodeTree.hasOwnProperty('file')) {
        // If the current node is a file
        // Render a file
        return (
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleClick}
                onContextMenu={handleFileContextMenu}
                onDoubleClick={() => {

                    if (openFilePaths.length > 0) {
                        setFiles((prevFiles) => {
                            const newFiles = { ...prevFiles }
                            fileOperations.writeFile(newFiles, openFilePaths[openFilePathIndex].path, openFilePaths[openFilePathIndex].contents)
                            const doAsyncTask = async () => {
                                if (webContainer && webContainer.fs) await webContainer.fs.writeFile(openFilePaths[openFilePathIndex].path, openFilePaths[openFilePathIndex].contents)
                            }
                            doAsyncTask();
                            return newFiles

                        })

                        setOpenFilePaths((prevOpenFilePaths) => {
                            const newOpenFilePaths = [...prevOpenFilePaths]
                            newOpenFilePaths[openFilePathIndex].isSaved = true
                            return newOpenFilePaths
                        })
                    }
                    const tempOpenFilePathIndex = getOpenFilePathIndex(openFilePaths, path)
                    if (tempOpenFilePathIndex != -1) {
                        setOpenFilePathIndex(tempOpenFilePathIndex)
                        return;
                    }

                    setOpenFilePaths((prevOpenFilePaths) => {
                        const pathObject = {
                            path: path,
                            contents: fileOperations.getFileContents(files, path),
                            isSaved: true,
                        }
                        return [...prevOpenFilePaths, pathObject]
                    })
                    setOpenFilePathIndex(openFilePaths.length)
                }}
                style={rowStyle}>
                <FileNodeIcon filename={displayName} />
                <Typography variant='body1' style={typographyStyle}>
                    {displayName}
                </Typography>
            </div>
        );
    }
}

export default FileStructureNode;

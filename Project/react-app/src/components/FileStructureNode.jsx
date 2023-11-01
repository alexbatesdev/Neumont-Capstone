import React, { useEffect, useState } from 'react';

import { useTheme } from '@mui/material/styles'; // Import useTheme from Material-UI
import { Typography } from '@mui/material';
import Collapse from '@mui/material/Collapse';

import { useEditorContext, useFilePaths, useWebContainer } from '@/contexts/editor-context';
import { FileNodeIcon } from './FileNodeIcon';
import { useWebContainerContext } from '@/contexts/webContainerContext';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// This is an assistant-generated boilerplate for a React functional component.
// You can customize this component by adding your own props, state, and logic.

function FileStructureNode({ currentNodeTree, path, depth = 0 }) {
    const theme = useTheme(); // Use the Material-UI useTheme hook
    const [isHovered, setIsHovered] = useState(false);
    const {
        //Filepath hook
        setOpenFilePaths, openFilePaths, setOpenFilePathIndex, openFilePathIndex, highlightedPath, setHighlightedPath, expandedPaths, setExpandedPaths,
        //Web Container Hook
        webContainer,
        //Files hook
        fileOperations, files, setFiles,
    } = useEditorContext();

    if (currentNodeTree == undefined) {
        console.log("Current Node Tree is undefined")
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

    const handleDirectoryUpdate = async (pathNotModules) => {
        let directoryContents = await fileOperations.getDirectory(webContainer, pathNotModules)
        fileOperations.setDirectory(files, pathNotModules, directoryContents).then((newFiles) => {
            setFiles(() => {
                const newFiles = { ...files }
                return newFiles
            })
        })
        // Update the file tree for this directory
    }

    // console.log(currentNodeTree.)
    // Spelling counts!
    if (currentNodeTree.hasOwnProperty('directory')) {
        useEffect(() => {
            // ------------------------------------ If the path is node modules watch the root directory instead
            // This works because I don't want to watch the node modules directory, but I do want to watch the root directory (which doesn't get a FileStructureNode)
            // This personally feels like a very creative and good solution to the problem, but something unscaleable and would cause technical debt in the long term
            let pathNotModules = ((path == "./node_modules") ? "./" : path)
            let watcher = null;
            if (webContainer) {
                console.log("Watching " + path)
                watcher = webContainer.fs.watch(pathNotModules, (event, filename) => {
                    //if the filename starts with _tmp, ignore it

                    console.log("File Changed")
                    console.log(event, filename)
                    if (filename.substring(0, 4) == "_tmp") {
                        console.log("Ignoring _tmp file")
                        return;
                    }

                    console.log("PATH: ", pathNotModules)
                    handleDirectoryUpdate(pathNotModules)
                })
            }
            return () => {
                if (watcher) {
                    watcher.close()
                }
            }
        }, [])

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
                    style={rowStyle}>
                    <FileNodeIcon filename={displayName} isFolder={true} isOpen={expandedPaths.includes(path)} />
                    <Typography variant='body1' style={typographyStyle}>
                        {displayName}
                    </Typography>
                    {path == "./node_modules" ? null : (
                        <AddIcon
                            onMouseEnter={(event) => {
                                let target = event.target;

                                target.style.animation = 'rotatePLUS 0.3s ease-out';
                                setTimeout(() => {
                                    target.style.animation = '';
                                }, 300);
                            }}
                            onClick={(event) => alert("Add File or Folder")}
                            sx={{
                                marginLeft: 'auto',
                                marginRight: '5px',
                                // fontSize: '1.5rem',
                                color: isHovered ? theme.palette.utilBar.icons : 'transparent',
                                cursor: 'pointer',

                            }} />
                    )}
                </div>
                <Collapse
                    in={expandedPaths.includes(path)}
                    timeout={200}
                    sx={{
                        width: '100%',
                    }}>

                    {fileKeys.map((key, index) => {
                        const node = {
                            [key]: currentNodeTree.directory[key]
                        }
                        return (
                            <>
                                <FileStructureNode key={key + "-" + index} currentNodeTree={node} depth={depth + 1} path={path + "/" + key} />
                            </>
                        );
                    })}

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

                    if (openFilePaths.includes(path)) {
                        setOpenFilePathIndex(openFilePaths.indexOf(path))
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
    } else {
        return (
            <div>
                <h1>Hello, World!</h1>
                {/* You can access the theme object from Material-UI here */}
                {/* You can also use your context here */}

                {/* Alex Here: This bit of JSX should never be returned */}
            </div>
        );
    }
}

export default FileStructureNode;

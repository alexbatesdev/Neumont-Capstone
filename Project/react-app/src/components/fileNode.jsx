import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles'; // Import useTheme from Material-UI
import { EditorContext } from '@/contexts/editor-context';
import { Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CodeIcon from '@mui/icons-material/Code';
import Collapse from '@mui/material/Collapse';
import Fade from '@mui/material/Fade';
import { FileNodeIcon } from './FileNodeIcon';

// This is an assistant-generated boilerplate for a React functional component.
// You can customize this component by adding your own props, state, and logic.

function FileStructureNode({ currentNodeTree, path, setLastClicked, lastClicked, depth = 0 }) {
    const theme = useTheme(); // Use the Material-UI useTheme hook
    const { files } = React.useContext(EditorContext);
    const [isHovered, setIsHovered] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { setOpenFilePaths, openFilePaths, setOpenFilePathIndex, openFilePathIndex } = React.useContext(EditorContext);
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
        width: '100%',
        backgroundColor: (isHovered || path == lastClicked) ? theme.palette.background.default : 'transparent',
        paddingLeft: `${(depth * 10) + 10}px`,
        paddingTop: '3px',
        paddingBottom: '3px',
    }

    const handleClick = () => {
        setIsExpanded(!isExpanded)
        setLastClicked(path)
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
        return (
            <>
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleClick}
                    style={rowStyle}>
                    <FileNodeIcon filename={displayName} isFolder={true} isOpen={isExpanded} />
                    <Typography variant='body1' style={typographyStyle}>
                        {displayName}
                    </Typography>
                </div >
                <Collapse
                    in={isExpanded}
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
                                <FileStructureNode currentNodeTree={node} depth={depth + 1} path={path + "/" + key} setLastClicked={setLastClicked} lastClicked={lastClicked} />
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
                    setOpenFilePaths((prevOpenFilePaths) => {
                        return [...prevOpenFilePaths, path]
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
            </div>
        );
    }
}

export default FileStructureNode;

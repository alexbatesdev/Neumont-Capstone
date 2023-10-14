import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles'; // Import useTheme from Material-UI
import { EditorContext } from '@/contexts/editor-context';
import { Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import CodeIcon from '@mui/icons-material/Code';
// This is an assistant-generated boilerplate for a React functional component.
// You can customize this component by adding your own props, state, and logic.

const files = {
    'src': {
        directory: {
            'newFolder': {
                directory: {
                    'newFile.js': {
                        file: {
                            contents: "blah blah blah"
                        }
                    },
                    'newFile2.js': {
                        file: {
                            contents: "blah blah blah"
                        }
                    },
                }
            },
            'index.js': {
                file: {
                    contents: "blah blah blah"
                }
            },
            'App.js': {
                file: {
                    contents: "blah blah blah"
                }
            },
        }
    }
}


function FileStructureNode({ currentNodeTree, path, depth = 0 }) {
    const theme = useTheme(); // Use the Material-UI useTheme hook
    const [isHovered, setIsHovered] = useState(false);
    if (currentNodeTree == undefined) {
        console.log("Current Node Tree is undefined")
        return;
    }
    const displayName = Object.keys(currentNodeTree)[0]
    currentNodeTree = currentNodeTree[Object.keys(currentNodeTree)[0]]

    const typographyStyle = {

    }

    const rowStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '5px',
        width: '100%',
        backgroundColor: isHovered ? theme.palette.background.default : 'transparent',
        paddingLeft: `${(depth * 10) + 10}px`,
        paddingTop: '3px',
        paddingBottom: '3px',
    }

    const handleClick = () => {
        console.log("Clicked! " + path)
    }

    // console.log(currentNodeTree.)
    // Spelling counts!
    if (currentNodeTree.hasOwnProperty('directory')) {
        // If the current node is a directory
        // Render a directory
        return (
            <>
                <div
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    onClick={handleClick}
                    style={rowStyle}>
                    <FolderIcon />
                    <Typography variant='body1' style={typographyStyle}>
                        {displayName}
                    </Typography>
                </div >
                <div
                    className='folder'
                    style={{
                        width: '100%',
                    }}>
                    {Object.keys(currentNodeTree.directory).map((key, index) => {
                        const node = {
                            [key]: currentNodeTree.directory[key]
                        }
                        return (
                            <>
                                <FileStructureNode currentNodeTree={node} depth={depth + 1} path={path + "/" + key} />
                            </>
                        );
                    })}
                </div>
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
                style={rowStyle}>
                <CodeIcon />
                <Typography variant='body1' style={typographyStyle}>
                    {displayName}
                </Typography>
            </div>
        );
    } else {
        console.log(currentNodeTree)
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

import React from 'react';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Import useTheme from Material-UI
import RefreshIcon from '@mui/icons-material/Refresh';

import { useFiles, useWebContainer } from '@/contexts/editor-context';
import FileStructureNode from './FileStructureNode';
import LoadingDisplay from './LoadingDisplay';
import AddButton from './AddButton';


const FileTreeDisplay = () => {
    const theme = useTheme();
    const { files, setFiles, fileOperations } = useFiles();
    const { webContainer } = useWebContainer();

    if (!files) {
        return (
            <LoadingDisplay />
        )
    }


    let fileKeys = Object.keys(files)
    let fileKeys_folders = []
    let fileKeys_files = []

    fileKeys.forEach((key, index) => {
        const node = files[key];

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

    const outerWrapperStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        // overflow: "hidden",
    }

    const topBannerStyle = {
        width: 'calc(100% - 10px)',
        height: '20px',
        marginBottom: '10px',
        paddingLeft: '10px',
        paddingTop: '10px',
        paddingBottom: '10px',
        backgroundColor: theme.palette.background.default,
        filter: "brightness(1.3)",
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '5px',
        textWrap: "nowrap",
        zIndex: "2",
    }

    const refreshIconStyle = {
        display: "inline",
        height: "20px",
        padding: "2px",
        color: theme.palette.utilBar.icons,
        width: "auto",
        aspectRatio: "1/1",
        textAlign: "center",
        userSelect: "none",
        cursor: "pointer",
        marginRight: "10px",
    }

    const handleRefresh = (e) => {
        let target = e.target;

        // If the target is a path element, get the parent svg element
        if (target.tagName === 'path') {
            target = target.parentElement;
        }

        target.style.animation = 'rotate 0.6s ease-out';
        setTimeout(() => {
            target.style.animation = '';
        }, 600);
        const asyncFunc = async () => {
            // console.log(webContainer)
            if (!webContainer) {
                return;
            }
            const fileTree = await fileOperations.getFileTree(webContainer)
            setFiles(fileTree);
        }
        asyncFunc();
    }

    return (
        <div style={outerWrapperStyle}>
            <Typography sx={topBannerStyle}>
                File Explorer
                <style>
                    {`
                        @keyframes rotate {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                            transform: rotate(360deg);
                        }
                    }
                    `}
                </style>
                <span style={{
                    zIndex: "3",
                    marginLeft: 'auto',
                    marginRight: '5px',
                    display: "flex",
                    alignItems: "center",
                }}>
                    <AddButton path={"."} isHovered />
                </span>
                <RefreshIcon
                    sx={refreshIconStyle}
                    onClick={handleRefresh}
                />
            </Typography>
            {fileKeys.length === 0 && <Typography sx={{ pl: "10px" }}>No Files to show</Typography>}
            {fileKeys.map((key, index) => {
                const node = {
                    [key]: files[key]
                }
                return (
                    <>
                        <FileStructureNode key={key + "-" + index} currentNodeTree={node} path={"./" + key} />
                    </>
                );
            })}
        </div>
    );
}

export default FileTreeDisplay;
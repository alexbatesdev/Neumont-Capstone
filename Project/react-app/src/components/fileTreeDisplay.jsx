import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles'; // Import useTheme from Material-UI
import { EditorContext } from '@/contexts/editor-context';
import FileStructureNode from './fileNode';
import { Typography } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';


const FileTreeDisplay = () => {
    const theme = useTheme();
    const { files, setFiles, lastClicked, setLastClicked, fileOperations } = React.useContext(EditorContext);


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


    return (
        <div style={{
            width: '100%',
            height: '100%',
            // backgroundColor: "red",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            // filter: "opacity(0.5)"
        }}>
            <Typography sx={{
                width: 'calc(100% - 10px)',
                height: '20px',
                marginBottom: '10px',
                paddingLeft: '10px',
                paddingTop: '5px',
                paddingBottom: '10px',
                backgroundColor: theme.palette.background.default,
                filter: "brightness(1.3)",
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: '5px',
            }}>
                File Explorer - {"Project Name"}
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
                <RefreshIcon
                    sx={{
                        display: "inline",
                        height: "20px",
                        padding: "2px",
                        color: theme.palette.utilBar.icons,
                        width: "auto",
                        aspectRatio: "1/1",
                        textAlign: "center",
                        userSelect: "none",
                        cursor: "pointer",
                    }}
                    onClick={(e) => {
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
                            const fileTree = await fileOperations.getFileTree()
                            setFiles(fileTree);
                        }
                        asyncFunc();
                    }}
                />
            </Typography>

            {fileKeys.map((key, index) => {
                const node = {
                    [key]: files[key]
                }
                return (
                    <>
                        <FileStructureNode currentNodeTree={node} path={"./" + key} setLastClicked={setLastClicked} lastClicked={lastClicked} />
                    </>
                );
            })}
        </div>
    );
}

export default FileTreeDisplay;

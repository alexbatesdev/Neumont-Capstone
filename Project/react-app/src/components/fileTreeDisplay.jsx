import React, { useEffect } from 'react';
import { useTheme } from '@mui/material/styles'; // Import useTheme from Material-UI
import { EditorContext } from '@/contexts/editor-context';
import FileStructureNode from './fileNode';
import { Typography } from '@mui/material';



const FileTreeDisplay = () => {
    const theme = useTheme();
    const { files, setFiles, lastClicked, setLastClicked } = React.useContext(EditorContext);


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
                width: '100%',
                height: '20px',
                marginBottom: '10px',
                paddingLeft: '10px',
                paddingTop: '5px',
                paddingBottom: '10px',
                backgroundColor: theme.palette.background.default,
                filter: "brightness(1.3)"
            }}>
                File Explorer - {"Project Name"}
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

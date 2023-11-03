import React, { useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@emotion/react';
import { Stack, TextField } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import fileOperations from '@/thatOneStuffFolderUsuallyCalledUtils/fileOperations';
import { useFilePaths, useFiles, useWebContainer } from '@/contexts/editor-context';

// Regex codes were taken from stack overflow and regex101, and modified to be slightly less picky
export default function RenameNodePrompt({ path, isDirectory, setIsOpen }) {
    const theme = useTheme();
    const [fileName, setFileName] = React.useState();
    const { files, setFiles } = useFiles();
    const { webContainer } = useWebContainer();
    const { openFilePaths, setOpenFilePaths, openFilePathIndex, setOpenFilePathIndex } = useFilePaths();

    const renameFile = async (fileName_in) => {
        //console.log("RENAME FILE FILENAME IN: ", fileName_in)
        //console.log("RENAME FILE, PATH")
        //console.log(path)
        if (openFilePaths[openFilePathIndex] && path === openFilePaths[openFilePathIndex].path) {
            setOpenFilePaths(openFilePaths.map((path_in) => {
                if (path_in.path === path) {
                    return ({
                        path: path.substring(0, path.lastIndexOf("/")) + "/" + fileName_in,
                        isSaved: path_in.isSaved,
                        contents: path_in.contents,
                    })
                } else {
                    return path_in
                }
            }))
            // setOpenFilePathIndex(openFilePathIndex)
        }
        const data = await webContainer.fs.readFile(path)
        const newPath = path.substring(0, path.lastIndexOf("/")) + "/" + fileName_in
        //console.log("RENAME FILE NEW PATH")
        //console.log(newPath)
        await webContainer.fs.writeFile(newPath, data)
        await webContainer.fs.rm(path)
    }

    const recursiveDir = async (data, newPath) => {
        //console.log("RECURSIVE DIR")
        //console.log(data)
        for (var item in data) {
            //console.log(item)
            //console.log(data[item])
            if (data[item].hasOwnProperty('directory')) {
                await webContainer.fs.mkdir(newPath + "/" + item)
                await recursiveDir(data[item].directory, newPath + "/" + item)
            } else {
                await webContainer.fs.writeFile(newPath + "/" + item, data[item].file.contents)
            }
        }
    }

    const renameDirectory = async (fileName_in) => {
        //console.log("RENAME DIRECTORY")
        //console.log(path)
        const data = await fileOperations.getDirectory(webContainer, path)
        const newPath = path.substring(0, path.lastIndexOf("/")) + "/" + fileName_in
        //console.log(newPath)
        //console.log(data)
        await webContainer.fs.mkdir(newPath).then(async () => {
            await recursiveDir(data, newPath)
        }).then(async () => {
            await webContainer.fs.rm(path, { recursive: true })
        })
        // fileOperations.addDirectory(files, newPath)
        // await fileOperations.setDirectory(files, newPath, data).then((newFiles) => {
        //     //console.log("NEW FILES")
        //     //console.log(newFiles)
        //     //console.log(files)
        //     setFiles(() => {
        //         const newFiles = { ...files }
        //         return newFiles
        //     })
        // }).then(async () => {
        // })

    }

    return (<>
        <div
            onClick={(event) => event.stopPropagation()}
            style={{
                position: "absolute",
                top: "100%",
                left: "-5px",
                width: "100%",
                padding: "5px",
                borderRadius: "5px",
                height: "50px",
                backgroundColor: theme.palette.background.paper,
                border: `3px solid ${theme.palette.utilBar.default}`,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-evenly",
                alignItems: "center",
                gap: "5px",
                boxShadow: "0px 2px 5px rgba(0,0,0,0.6)",
            }}>
            <TextField
                sx={{
                    position: "relative",
                    zIndex: "100",
                    height: "100%",
                    flexGrow: "1",
                }}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        let pattern;
                        let fileNameNoTrailingSlash = fileName;
                        // Auto detect if file or folder, a trailing / means folder
                        // This is only if the user presses enter, not if they click a button which specifies
                        if (isDirectory) {
                            // Is a directory
                            // Remove the trailing slash
                            if (fileName.substring(fileName.length - 1) === "/") fileNameNoTrailingSlash = fileName.substring(0, fileName.length - 1)
                            // Valid directory name regex taken and modified from stack overflow
                            pattern = /^[^\s^\x00-\x1f\\?*:"";<>|\/][^\x00-\x1f\\?*:"";<>|\/]*[^\s^\x00-\x1f\\?*:"";<>|\/.]+$/
                            if (pattern.test(fileNameNoTrailingSlash)) {
                                renameDirectory(fileNameNoTrailingSlash)
                                setIsOpen(false);
                                setFileName("");
                            }
                        } else {
                            // Is a file
                            // Valid file name regex taken and modified from stack overflow or regex101, I do not remember
                            pattern = /^[a-zA-Z0-9.](?:[a-zA-Z0-9 ._-]*[a-zA-Z0-9])?\.?[a-zA-Z0-9_-]+$/
                            if (pattern.test(fileNameNoTrailingSlash)) {
                                renameFile(fileNameNoTrailingSlash)
                                setIsOpen(false);
                                setFileName("");
                            }
                        }
                    }

                }}
                label="File/Folder Name"
                variant="standard"
                value={fileName}
                onChange={(event) => setFileName(event.target.value)}
            />
        </div>
    </>)
}
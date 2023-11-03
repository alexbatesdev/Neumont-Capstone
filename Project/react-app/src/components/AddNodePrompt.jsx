import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@emotion/react';
import { Stack, TextField } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import fileOperations from '@/thatOneStuffFolderUsuallyCalledUtils/fileOperations';
import { useFiles, useWebContainer } from '@/contexts/editor-context';

// Regex codes were taken from stack overflow and regex101, and modified to be slightly less picky
export default function AddNodePrompt({ path, isOpen, setIsOpen }) {
    const theme = useTheme();
    const [fileName, setFileName] = React.useState();
    const { files } = useFiles();
    const { webContainer } = useWebContainer();

    const createFile = async (fileName_in) => {
        await webContainer.fs.writeFile(path + "/" + fileName_in, "")
    }

    const createDirectory = async (fileName_in) => {
        await webContainer.fs.mkdir(path + "/" + fileName_in)
    }


    return (<>
        {isOpen &&
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
                            if (fileName.substring(fileName.length - 1) === "/") {
                                // Is a directory
                                // Remove the trailing slash
                                fileNameNoTrailingSlash = fileName.substring(0, fileName.length - 1)
                                // Valid directory name regex taken and modified from stack overflow
                                pattern = /^[^\s^\x00-\x1f\\?*:"";<>|\/][^\x00-\x1f\\?*:"";<>|\/]*[^\s^\x00-\x1f\\?*:"";<>|\/.]+$/
                                if (pattern.test(fileNameNoTrailingSlash)) {
                                    fileOperations.addDirectory(files, path + "/" + fileNameNoTrailingSlash)
                                    createDirectory(fileNameNoTrailingSlash)
                                    setIsOpen(false);
                                    setFileName("");
                                }
                            } else {
                                // Is a file
                                // Valid file name regex taken and modified from stack overflow or regex101, I do not remember
                                pattern = /^[a-zA-Z0-9.](?:[a-zA-Z0-9 ._-]*[a-zA-Z0-9])?\.?[a-zA-Z0-9_-]+$/
                                if (pattern.test(fileNameNoTrailingSlash)) {
                                    fileOperations.writeFile(files, path + "/" + fileNameNoTrailingSlash, "")
                                    createFile(fileNameNoTrailingSlash)
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
                <Stack direction={"column"} gap={1}>
                    <NoteAddIcon
                        onClick={() => {
                            console.log(path)
                            console.log(path + "/" + fileName);
                            const pattern = /^[a-zA-Z0-9.](?:[a-zA-Z0-9 ._-]*[a-zA-Z0-9])?\.?[a-zA-Z0-9_-]+$/
                            if (pattern.test(fileName)) {
                                fileOperations.writeFile(files, path + "/" + fileName, "")
                                setIsOpen(false);
                                setFileName("");
                                createFile(fileName)
                            }

                        }}
                        sx={{
                            cursor: 'pointer',
                        }} />
                    <CreateNewFolderIcon
                        onClick={() => {
                            console.log(path)
                            console.log(path + "/" + fileName);
                            let fileNameNoTrailingSlash = fileName;
                            if (fileName.substring(fileName.length - 1) === "/") {
                                // Is a directory
                                // Remove the trailing slash
                                fileNameNoTrailingSlash = fileName.substring(0, fileName.length - 1)
                            }

                            const pattern = /^[^\s^\x00-\x1f\\?*:"";<>|\/][^\x00-\x1f\\?*:"";<>|\/]*[^\s^\x00-\x1f\\?*:"";<>|\/.]+$/
                            if (pattern.test(fileNameNoTrailingSlash)) {
                                fileOperations.addDirectory(files, path + "/" + fileNameNoTrailingSlash)
                                createDirectory(fileNameNoTrailingSlash)
                                setIsOpen(false);
                                setFileName("");
                            }
                        }}
                        sx={{
                            cursor: 'pointer',
                        }} />
                </Stack>
            </div>
        }
    </>)
}
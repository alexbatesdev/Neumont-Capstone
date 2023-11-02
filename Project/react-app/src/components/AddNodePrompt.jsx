import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@emotion/react';
import { Stack, TextField } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

// Regex codes were taken from stack overflow and regex101, and modified to be slightly less picky
export default function AddNodePrompt({ path, isOpen, setIsOpen }) {
    const theme = useTheme();
    const [fileName, setFileName] = React.useState();

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
                            let fileNameToTest = fileName;
                            if (fileName.substring(fileName.length - 1) === "/") {
                                fileNameToTest = fileName.substring(0, fileName.length - 1)
                                console.log("Folder")
                                pattern = /^[^\s^\x00-\x1f\\?*:"";<>|\/][^\x00-\x1f\\?*:"";<>|\/]*[^\s^\x00-\x1f\\?*:"";<>|\/.]+$/
                            } else {
                                console.log("File")
                                pattern = /^[a-zA-Z0-9.](?:[a-zA-Z0-9 ._-]*[a-zA-Z0-9])?\.?[a-zA-Z0-9_-]+$/
                            }
                            console.log(path)
                            console.log(path + "/" + fileNameToTest);
                            if (pattern.test(fileNameToTest)) {
                                console.log("Valid")
                            }
                            else {
                                console.log("Invalid")
                            }
                            setIsOpen(false);
                            setFileName("");
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
                                console.log("Valid")
                            }
                            else {
                                console.log("Invalid")
                            }


                            // fileOperations.createFile(path, "New File")
                            setIsOpen(false);
                            setFileName("");
                        }}
                        sx={{
                            cursor: 'pointer',
                        }} />
                    <CreateNewFolderIcon
                        onClick={() => {
                            console.log(path)
                            console.log(path + "/" + fileName);

                            const pattern = /^[^\s^\x00-\x1f\\?*:"";<>|\/][^\x00-\x1f\\?*:"";<>|\/]*[^\s^\x00-\x1f\\?*:"";<>|\/.]+$/
                            if (pattern.test(fileName)) {
                                console.log("Valid")
                            } else {
                                console.log("Invalid")
                            }

                            // fileOperations.createFolder(path, "New Folder")
                            setIsOpen(false);
                            setFileName("");
                        }}
                        sx={{
                            cursor: 'pointer',
                        }} />
                </Stack>
            </div>
        }
    </>)
}
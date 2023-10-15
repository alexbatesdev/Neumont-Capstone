import React, { useContext, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { monaco_spooky, monaco_night_owl } from '@/thatOneStuffFolderUsuallyCalledUtils/themes'
import { EditorContext } from '@/contexts/editor-context';
import CloseIcon from '@mui/icons-material/Close';

export const CodeEditor = () => {
    const theme = useTheme();
    const { openFilePaths, setOpenFilePaths, openFilePathIndex, setOpenFilePathIndex, files, setFiles, fileOperations, webContainer, setLastClicked } = useContext(EditorContext)
    const handleMonacoWillMount = (monaco) => {
        monaco.editor.defineTheme('spooky', monaco_spooky)
        monaco.editor.defineTheme('night-owl', monaco_night_owl)
    }

    const [hoverIndex, setHoverIndex] = React.useState(null);
    const tabBarRef = React.useRef(null);

    const handleEditorChange = (value, event) => {
        // Can get the value like this
        console.log(value)

        setFiles((prevFiles) => {
            const newFiles = { ...prevFiles }
            console.log(openFilePaths[0].filepath)
            fileOperations.writeFile(newFiles, openFilePaths[openFilePathIndex], value)
            const doAsyncTask = async () => {
                await webContainer.fs.writeFile(openFilePaths[openFilePathIndex], value)
            }
            doAsyncTask();
            return newFiles

        })

        //Or I can make a ref
        // assign that ref to the editor in a function on mount
        // then us the ref to get the value like this
        // console.log(editorRef.current.getValue())
    }

    const resolveExtensionToLanguage = (extension) => {
        switch (extension) {
            case "js":
                return "javascript"
            case "ts":
                return "typescript"
            case "jsx":
                return "javascript"
            case "tsx":
                return "typescript"
            case "html":
                return "html"
            case "css":
                return "css"
            case "scss":
                return "scss"
            case "json":
                return "json"
            case "md":
                return "markdown"
            case "yaml":
                return "yaml"
            case "yml":
                return "yaml"
            default:
                return "plaintext"
        }
    }

    const editorTabBarStyle = {
        width: "100%",
        backgroundColor: theme.palette.utilBar.default,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        // overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: "30px",
    }

    return (<>
        <div ref={tabBarRef} style={editorTabBarStyle}>
            <Typography variant="body1" sx={{
                fontSize: "1rem",
                float: "left",
                color: theme.palette.text.primary,
                display: "inline-block",
                height: "calc(100% - 10px)",
                padding: "5px",
                marginLeft: "5px",
                filter: "opacity(0.75)",
                width: "90px"
            }}>
                {openFilePaths && openFilePaths[openFilePathIndex] && resolveExtensionToLanguage(openFilePaths[openFilePathIndex].split('.')[2])}
            </Typography>
            <div style={{
                float: "right",
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "stretch",
                // height: "100%",
                flexWrap: "wrap",
                // flexGrow: 1,
                width: "calc(100% - 60px)",
            }}>
                {openFilePaths && openFilePaths.map((file, index) => {
                    return (<div
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                        onClick={() => {
                            setOpenFilePathIndex(index)
                            setLastClicked(openFilePaths[index])
                            console.log(index)
                            console.log(fileOperations.getFileContents(openFilePaths[index]))
                        }}
                        style={{
                            color: theme.palette.text.primary,
                            backgroundColor: (hoverIndex == index || openFilePathIndex == index) ? theme.palette.utilBar.secondary : theme.palette.utilBar.default,
                            padding: "0px 5px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "2px",
                            // height: "100%",
                            borderLeft: `2px solid ${theme.palette.utilBar.secondary}`,
                            userSelect: "none",
                        }}>
                        <Typography variant="body2" style={{
                            display: "inline",
                            fontSize: "0.8rem",
                        }}>
                            {file.split('/')[file.split('/').length - 1]}
                        </Typography>
                        <CloseIcon
                            onClick={(event) => {
                                event.stopPropagation()
                                setOpenFilePaths((prevOpenFilePaths) => {
                                    const newOpenFilePaths = [...prevOpenFilePaths]
                                    newOpenFilePaths.splice(index, 1)
                                    return newOpenFilePaths
                                })
                                setOpenFilePathIndex((prevOpenFilePathIndex) => {
                                    if (prevOpenFilePathIndex == index) {
                                        return 0
                                    } else if (prevOpenFilePathIndex > index) {
                                        return prevOpenFilePathIndex - 1
                                    } else {
                                        return prevOpenFilePathIndex
                                    }
                                })
                            }}
                            sx={{
                                fontSize: "15px"
                            }} />
                    </div>)
                })}
            </div>
        </div>
        <div style={{
            position: "relative",
            height: `calc(100% - ${tabBarRef.current ? tabBarRef.current.clientHeight : 30}px)`, //This updates weirdly, specifically when the tab bar renders 💭
        }}>
            {openFilePaths && openFilePaths[openFilePathIndex] && (
                <Editor
                    language={resolveExtensionToLanguage(openFilePaths[openFilePathIndex].split('.')[2])}
                    value={fileOperations.getFileContents(openFilePaths[openFilePathIndex])}
                    theme={'spooky'}
                    beforeMount={handleMonacoWillMount}
                    onMount={handleMonacoDidMount}
                    onChange={handleEditorChange}
                    wrapperProps={{
                        style: {
                            display: "flex",
                            position: "relative",
                            textAlign: "initial",
                            width: "100%",
                            height: "100%",
                            borderBottomRightRadius: "10px",
                            borderBottomLeftRadius: "10px",
                            overflow: "hidden",
                        }
                    }}
                />)}
        </div>
    </>)
}
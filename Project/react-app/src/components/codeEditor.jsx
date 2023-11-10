import React, { useEffect } from 'react';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

import { monaco_spooky, monaco_night_owl } from '@/thatOneStuffFolderUsuallyCalledUtils/themes'
import { useEditorContext } from '@/contexts/editor-context';
import { Add } from '@mui/icons-material';

export const CodeEditor = () => {
    const theme = useTheme();
    const {
        openFilePaths, setOpenFilePaths, openFilePathIndex, setOpenFilePathIndex,
        setFiles, fileOperations,
        webContainer,
        setHighlightedPath, expandedPaths, setExpandedPaths,
        isProjectSaved, setIsProjectSaved,
        codeEditorDiffMode, setCodeEditorDiffMode, codeEditorDiffValue, setCodeEditorDiffValue
    } = useEditorContext();
    const editorRef = React.useRef(null);

    const handleEditorMount = (editor, monaco) => {
        editorRef.current = editor;
    }


    const handleMonacoWillMount = (monaco) => {
        monaco.editor.defineTheme('spooky', monaco_spooky)
        monaco.editor.defineTheme('night-owl', monaco_night_owl)
    }

    const [hoverIndex, setHoverIndex] = React.useState(null);
    const tabBarRef = React.useRef(null);
    const [tabBarHeight, setTabBarHeight] = React.useState(30);
    // ------------------------------------------------- Create an array of booleans of the length of the openFilePaths array


    const handleEditorChange = (value, event) => {
        openFilePaths[openFilePathIndex].contents = value
        if (openFilePaths[openFilePathIndex].isSaved) {
            // console.log("NOT SAVED")
            setOpenFilePaths((prevOpenFilePaths) => {
                const newOpenFilePaths = [...prevOpenFilePaths]
                newOpenFilePaths[openFilePathIndex].isSaved = false
                return newOpenFilePaths
            })
        }
        if (isProjectSaved) {
            setIsProjectSaved(false)
        }
    }

    const handleEditorKeyDown = (event) => {
        // console.log(event)
        if (event.ctrlKey && event.key == "s") {
            event.preventDefault()
            if (codeEditorDiffMode) {
                handleDiffEditorSave()
            } else {
                handleEditorSave()
            }
            // console.log("SAVED")
        }
    }

    const handleEditorSave = () => {
        if (codeEditorDiffMode) {
            return;
        }
        // console.log("SAVING")
        setFiles((prevFiles) => {
            const newFiles = { ...prevFiles }
            fileOperations.writeFile(newFiles, openFilePaths[openFilePathIndex].path, editorRef.current.getValue())
            const doAsyncTask = async () => {
                if (webContainer && webContainer.fs) await webContainer.fs.writeFile(openFilePaths[openFilePathIndex].path, editorRef.current.getValue())
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

    const handleDiffEditorSave = () => {
        // console.log("SAVING")
        setFiles((prevFiles) => {
            const newFiles = { ...prevFiles }
            fileOperations.writeFile(newFiles, openFilePaths[openFilePathIndex].path, editorRef.current.getModifiedEditor().getValue())
            openFilePaths[openFilePathIndex].contents = editorRef.current.getModifiedEditor().getValue()
            const doAsyncTask = async () => {
                if (webContainer && webContainer.fs) await webContainer.fs.writeFile(openFilePaths[openFilePathIndex].path, editorRef.current.getModifiedEditor().getValue())
            }
            doAsyncTask();
            return newFiles
        })

        setOpenFilePaths((prevOpenFilePaths) => {
            const newOpenFilePaths = [...prevOpenFilePaths]
            newOpenFilePaths[openFilePathIndex].isSaved = true
            return newOpenFilePaths
        })

        setCodeEditorDiffMode(false);
        setCodeEditorDiffValue("");
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

    useEffect(() => {
        const targetElement = tabBarRef.current
        const handleResize = () => {
            if (targetElement) {
                setTabBarHeight(targetElement.clientHeight)
            }
        }

        const resizeObserver = new ResizeObserver(handleResize)

        if (targetElement) {
            resizeObserver.observe(targetElement)
        }

        return () => {
            resizeObserver.unobserve(targetElement)
        }

    }, [])

    useEffect(() => {
        if (openFilePaths.length == 0) {
            setHighlightedPath(null)
            setCodeEditorDiffMode(false)
            setCodeEditorDiffValue("")
        }
    }, [openFilePaths])

    const editorTabBarStyle = {
        width: "100%",
        backgroundColor: theme.palette.utilBar.default,
        borderTopLeftRadius: "0px",
        borderTopRightRadius: "0px",
        // overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        minHeight: "30px",
    }

    const languageDisplayStyle = {
        fontSize: "1rem",
        float: "left",
        color: theme.palette.text.primary,
        display: "inline-block",
        height: "calc(100% - 10px)",
        padding: "5px",
        marginLeft: "5px",
        filter: "opacity(0.75)",
        width: "90px"
    }

    const tabFlexboxStyle = {
        float: "right",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "stretch",
        flexWrap: "wrap",
        width: "calc(100% - 60px)",
    }

    const handleTabClick = (index) => {
        // Make toggling autosave a setting
        // handleEditorSave()

        setOpenFilePathIndex(index)
        // Iterates through the path and opens any closed directories on the way
        const fullPathArrayMinusFileName = openFilePaths[index].path.split('/').slice(0, -1).join('/')
        fullPathArrayMinusFileName.split('/').forEach((path, index) => {
            if (path == ".") return;
            //console.log(path)
            let output = "."
            for (let i = 1; i <= index; i++) {
                output += "/" + fullPathArrayMinusFileName.split('/')[i]
            }
            //console.log(!expandedPaths.includes(output))
            //console.log(expandedPaths)
            if (!expandedPaths.includes(output)) {
                setExpandedPaths((prevExpandedPaths) => {
                    return [...prevExpandedPaths, output]
                })
            }
        })
        setHighlightedPath(openFilePaths[index].path)
    }

    const tabStyle = (index) => {
        return {
            color: theme.palette.text.primary,
            backgroundColor: (hoverIndex == index || openFilePathIndex == index) ? theme.palette.utilBar.secondary : theme.palette.utilBar.default,
            padding: "0px 5px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: "2px",
            borderLeft: `2px solid ${theme.palette.utilBar.secondary}`,
            userSelect: "none",
        }
    }

    const handleCloseClick = (index) => {
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
    }

    const handleChangeHighlight = () => {
        if (openFilePaths.length == 0) return;
        // Iterates through the path and opens any closed directories on the way
        const fullPathArrayMinusFileName = openFilePaths[openFilePathIndex].path.split('/').slice(0, -1).join('/')
        fullPathArrayMinusFileName.split('/').forEach((path, index) => {
            if (path == ".") return;
            //console.log(path)
            let output = "."
            for (let i = 1; i <= index; i++) {
                output += "/" + fullPathArrayMinusFileName.split('/')[i]
            }
            //console.log(!expandedPaths.includes(output))
            //console.log(expandedPaths)
            if (!expandedPaths.includes(output)) {
                setExpandedPaths((prevExpandedPaths) => {
                    return [...prevExpandedPaths, output]
                })
            }
        })
        setHighlightedPath(openFilePaths[openFilePathIndex].path)
    }

    const editorStyle = {
        display: "flex",
        position: "relative",
        textAlign: "initial",
        width: "100%",
        height: "100%",
        borderBottomRightRadius: "0px",
        borderBottomLeftRadius: "0px",
        overflow: "hidden",
    }

    return (<>
        <div ref={tabBarRef} style={editorTabBarStyle}>
            <Typography variant="body1" sx={languageDisplayStyle}>
                {openFilePaths && openFilePaths[openFilePathIndex] && openFilePaths[openFilePathIndex].path && resolveExtensionToLanguage(openFilePaths[openFilePathIndex].path.split('.')[2])}
            </Typography>
            <div style={tabFlexboxStyle}>
                {codeEditorDiffMode &&
                    <>
                        <div
                            onMouseEnter={() => setHoverIndex(-2)}
                            onMouseLeave={() => setHoverIndex(null)}
                            onClick={() => {
                                handleDiffEditorSave();
                                setCodeEditorDiffMode(false);
                                setCodeEditorDiffValue("");
                            }}
                            style={tabStyle(-2)}>
                            <Typography variant="body2" style={{
                                display: "inline",
                                fontSize: "0.8rem",
                            }}>
                                Accept Changes (Right Side)
                            </Typography>
                            <Add
                                sx={{
                                    fontSize: "15px"
                                }} />
                        </div>
                        <div
                            onMouseEnter={() => setHoverIndex(-1)}
                            onMouseLeave={() => setHoverIndex(null)}
                            onClick={() => {
                                setCodeEditorDiffMode(false);
                                setCodeEditorDiffValue("");
                            }}
                            style={tabStyle(-1)}>
                            <Typography variant="body2" style={{
                                display: "inline",
                                fontSize: "0.8rem",
                            }}>
                                Close Diff Editor
                            </Typography>
                            <CloseIcon
                                sx={{
                                    fontSize: "15px"
                                }} />
                        </div>
                    </>
                }
                {openFilePaths && openFilePaths.map((file, index) => {
                    return (<div
                        key={openFilePaths[index].path + "-tab"}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                        onClick={() => handleTabClick(index)}
                        style={tabStyle(index)}>
                        <Typography variant="body2" style={{
                            display: "inline",
                            fontSize: "0.8rem",
                        }}>
                            {file.path && file.path.split('/')[file.path.split('/').length - 1]} {!openFilePaths[index].isSaved && "*"}
                        </Typography>
                        <CloseIcon
                            onClick={(event) => {
                                event.stopPropagation()
                                handleCloseClick(index)
                            }}
                            sx={{
                                fontSize: "15px"
                            }} />
                    </div>)
                })}
            </div>
        </div>
        <div
            onClick={handleChangeHighlight}
            onKeyDown={handleEditorKeyDown}
            style={{
                position: "relative",
                height: `calc(100% - ${tabBarHeight}px)`,
                backgroundColor: theme.palette.background.default,
            }}>
            {/* If openFilePaths exists, and the file we think is open exists */}
            {(openFilePaths && openFilePaths[openFilePathIndex]) ? (
                codeEditorDiffMode ? (
                    <DiffEditor
                        language={resolveExtensionToLanguage(openFilePaths[openFilePathIndex].path.split('.')[2])}
                        original={openFilePaths[openFilePathIndex].contents}
                        modified={codeEditorDiffValue}
                        theme={'spooky'}
                        beforeMount={handleMonacoWillMount}
                        onMount={handleEditorMount}
                        wrapperProps={{
                            style: editorStyle
                        }}
                    />
                ) : (
                    <Editor
                        language={resolveExtensionToLanguage(openFilePaths[openFilePathIndex].path.split('.')[2])}
                        value={openFilePaths[openFilePathIndex].contents}
                        theme={'spooky'}
                        beforeMount={handleMonacoWillMount}
                        onMount={handleEditorMount}
                        onChange={handleEditorChange}
                        wrapperProps={{
                            style: editorStyle
                        }}
                    />
                )) : (
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%,-50%)",
                    textAlign: "center",
                }}>
                    <Typography variant="h4" color="text.primary">
                        No File Opened
                    </Typography>
                </div>
            )}
        </div>
    </>)
}
import React, { useEffect } from 'react';

import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';

import { monaco_spooky, monaco_night_owl } from '@/thatOneStuffFolderUsuallyCalledUtils/themes'
import { useEditorContext } from '@/contexts/editor-context';

export const CodeEditor = () => {
    const theme = useTheme();
    const { openFilePaths, setOpenFilePaths, openFilePathIndex, setOpenFilePathIndex, files, setFiles, fileOperations, webContainer, setHighlightedPath, expandedPaths, setExpandedPaths } = useEditorContext();
    const handleMonacoWillMount = (monaco) => {
        monaco.editor.defineTheme('spooky', monaco_spooky)
        monaco.editor.defineTheme('night-owl', monaco_night_owl)
    }

    const [hoverIndex, setHoverIndex] = React.useState(null);
    const tabBarRef = React.useRef(null);
    const [tabBarHeight, setTabBarHeight] = React.useState(30);

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
        setOpenFilePathIndex(index)
        // Iterates through the path and opens any closed directories on the way
        const fullPathArrayMinusFileName = openFilePaths[index].split('/').slice(0, -1).join('/')
        fullPathArrayMinusFileName.split('/').forEach((path, index) => {
            if (path == ".") return;
            console.log(path)
            let output = "."
            for (let i = 1; i <= index; i++) {
                output += "/" + fullPathArrayMinusFileName.split('/')[i]
            }
            console.log(!expandedPaths.includes(output))
            console.log(expandedPaths)
            if (!expandedPaths.includes(output)) {
                setExpandedPaths((prevExpandedPaths) => {
                    return [...prevExpandedPaths, output]
                })
            }
        })
        setHighlightedPath(openFilePaths[index])
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
        // Iterates through the path and opens any closed directories on the way
        const fullPathArrayMinusFileName = openFilePaths[openFilePathIndex].split('/').slice(0, -1).join('/')
        fullPathArrayMinusFileName.split('/').forEach((path, index) => {
            if (path == ".") return;
            console.log(path)
            let output = "."
            for (let i = 1; i <= index; i++) {
                output += "/" + fullPathArrayMinusFileName.split('/')[i]
            }
            console.log(!expandedPaths.includes(output))
            console.log(expandedPaths)
            if (!expandedPaths.includes(output)) {
                setExpandedPaths((prevExpandedPaths) => {
                    return [...prevExpandedPaths, output]
                })
            }
        })
        setHighlightedPath(openFilePaths[openFilePathIndex])
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
                {openFilePaths && openFilePaths[openFilePathIndex] && resolveExtensionToLanguage(openFilePaths[openFilePathIndex].split('.')[2])}
            </Typography>
            <div style={tabFlexboxStyle}>
                {openFilePaths && openFilePaths.map((file, index) => {
                    return (<div
                        key={openFilePaths[index] + "-tab"}
                        onMouseEnter={() => setHoverIndex(index)}
                        onMouseLeave={() => setHoverIndex(null)}
                        onClick={() => handleTabClick(index)}
                        style={tabStyle(index)}>
                        <Typography variant="body2" style={{
                            display: "inline",
                            fontSize: "0.8rem",
                        }}>
                            {file.split('/')[file.split('/').length - 1]}
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
        <div onClick={handleChangeHighlight}
            style={{
                position: "relative",
                height: `calc(100% - ${tabBarHeight}px)`,
            }}>
            {openFilePaths && openFilePaths[openFilePathIndex] && (
                <Editor
                    language={resolveExtensionToLanguage(openFilePaths[openFilePathIndex].split('.')[2])}
                    value={fileOperations.getFileContents(openFilePaths[openFilePathIndex])}
                    theme={'spooky'}
                    beforeMount={handleMonacoWillMount}
                    onChange={handleEditorChange}
                    wrapperProps={{
                        style: editorStyle
                    }}
                />)}
        </div>
    </>)
}
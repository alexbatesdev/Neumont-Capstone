import React, { useContext } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { monaco_spooky, monaco_night_owl } from '@/components/themes'
import { EditorContext } from '@/contexts/editor-context';

export const CodeEditor = () => {
    const theme = useTheme();
    const { openFiles, setOpenFiles, files, setFiles, fileOperations, webContainer } = useContext(EditorContext)
    const handleMonacoWillMount = (monaco) => {
        monaco.editor.defineTheme('spooky', monaco_spooky)
        monaco.editor.defineTheme('night-owl', monaco_night_owl)
    }

    const handleEditorChange = (value, event) => {
        // Can get the value like this
        console.log(value)

        setFiles((prevFiles) => {
            const newFiles = { ...prevFiles }
            console.log(openFiles[0].filepath)
            fileOperations.writeFile(newFiles, openFiles[0].filepath, value)
            const doAsyncTask = async () => {
                await webContainer.fs.writeFile(openFiles[0].filepath, value)
            }
            doAsyncTask();
            return newFiles

        })

        //Or I can make a ref
        // assign that ref to the editor in a function on mount
        // then us the ref to get the value like this
        // console.log(editorRef.current.getValue())
    }



    const editorTabBarStyle = {
        width: "100%",
        height: "30px",
        backgroundColor: theme.palette.utilBar.default,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        overflow: "hidden",
    }



    const buttonStyle = {
        fontSize: "1rem",
        marginBottom: "0",
        display: "inline",
        float: "right",
        backgroundColor: theme.palette.utilBar.default,
        height: "calc(100% - 10px)",
        padding: "5px",
        color: theme.palette.text.primary,
        width: "60px",
        textAlign: "center",
        userSelect: "none",
        cursor: "pointer",
    }
    console.log(openFiles)
    console.log(openFiles[0].filename)
    console.log(openFiles[0].contents)

    return (<>
        <div style={editorTabBarStyle}>
            <Typography variant="body1" sx={{
                fontSize: "1rem",
                float: "left",
                color: theme.palette.text.primary,
                display: "inline",
                height: "calc(100% - 10px)",
                padding: "5px",
                marginLeft: "5px",
                filter: "opacity(0.75)"
            }}>
                {openFiles[0].filename.split('.')[1]}
            </Typography>
        </div>
        <Editor
            defaultLanguage="javascript"
            language='javascript' // Make the language dynamic from the file 💭
            defaultValue={openFiles[0].contents}
            theme={'spooky'}
            beforeMount={handleMonacoWillMount}
            onChange={handleEditorChange}
            wrapperProps={{
                style: {
                    display: "flex",
                    position: "relative",
                    textAlign: "initial",
                    width: "100%",
                    height: `calc(100% - ${editorTabBarStyle.height})`,
                    borderBottomRightRadius: "10px",
                    borderBottomLeftRadius: "10px",
                    overflow: "hidden"
                }
            }}
        />
    </>)
}
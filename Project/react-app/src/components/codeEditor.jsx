import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { monaco_spooky, monaco_night_owl } from '@/components/themes'

export const CodeEditor = ({ files }) => {
    const theme = useTheme();
    const handleMonacoWillMount = (monaco) => {
        monaco.editor.defineTheme('spooky', monaco_spooky)
        monaco.editor.defineTheme('night-owl', monaco_night_owl)
    }

    const handleEditorChange = (value, event) => {
        // Can get the value like this
        console.log(value)

        //Or I can make a ref
        // assign that ref to the editor in a function on mount
        // then us the ref to get the value like this
        // console.log(editorRef.current.getValue())
    }

    const buttonBarBackground = "#020103"

    const editorTabBarStyle = {
        width: "100%",
        height: "30px",
        backgroundColor: buttonBarBackground,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        overflow: "hidden",
    }



    const buttonStyle = {
        fontSize: "1rem",
        marginBottom: "0",
        display: "inline",
        float: "right",
        backgroundColor: buttonBarBackground,
        height: "calc(100% - 10px)",
        padding: "5px",
        color: theme.palette.text.primary,
        width: "60px",
        textAlign: "center",
        userSelect: "none",
        cursor: "pointer",
    }
    console.log(files)
    console.log(files[0].filename)
    console.log(files[0].contents)

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
                {files[0].filename.split('.')[1]}
            </Typography>
        </div>
        <Editor
            defaultLanguage="javascript"
            language='javascript' // Make the language dynamic from the file 💭
            defaultValue={files[0].contents}
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
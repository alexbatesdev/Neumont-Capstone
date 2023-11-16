import React from "react";

import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useEditorContext } from "@/contexts/editor-context";
import { toast } from "react-toastify";

export const CodeSnippetButtonBar = ({ segment }) => {
    const { codeEditorDiffMode, setCodeEditorDiffMode, codeEditorDiffValue, setCodeEditorDiffValue } = useEditorContext();
    const theme = useTheme();

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

    const buttonBarStyle = {
        width: "100%",
        height: "30px",
        backgroundColor: theme.palette.utilBar.default,
        borderTopLeftRadius: "10px",
        borderTopRightRadius: "10px",
        overflow: "hidden",
    }

    const languageDisplayStyle = {
        fontSize: "1rem",
        float: "left",
        color: theme.palette.text.primary,
        display: "inline",
        height: "calc(100% - 10px)",
        padding: "5px",
        marginLeft: "5px",
        filter: "opacity(0.75)"
    }

    const handleDiffClick = () => {
        console.log("Diff Clicked");
        if (codeEditorDiffMode) {
            setCodeEditorDiffMode(false);
            setCodeEditorDiffValue("");
        } else {
            setCodeEditorDiffMode(true);
            setCodeEditorDiffValue(segment.content);
        }
    }

    return (<div style={buttonBarStyle}>
        <Typography
            variant="body1"
            sx={languageDisplayStyle}
        >
            {segment.language}
        </Typography>
        <Typography
            variant="body1"
            sx={buttonStyle}
            onMouseOver={(event) => {
                event.target.style.backgroundColor = theme.palette.utilBar.icons;
            }}
            onMouseOut={(event) => {
                event.target.style.backgroundColor = theme.palette.utilBar.default;
            }}
            onClick={() => handleDiffClick()}
        >
            Diff
        </Typography>
        <Typography
            variant="body1"
            onClick={() => {
                navigator.clipboard.writeText(segment.content);
                toast.success("Copied code to clipboard");
            }}
            onMouseOver={(event) => {
                event.target.style.backgroundColor = theme.palette.utilBar.icons;
            }}
            onMouseOut={(event) => {
                event.target.style.backgroundColor = theme.palette.utilBar.default;
            }}
            sx={buttonStyle}>
            Copy
        </Typography>
    </div>)
}
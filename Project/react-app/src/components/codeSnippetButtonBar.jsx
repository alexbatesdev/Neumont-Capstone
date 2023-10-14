import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export const CodeSnippetButtonBar = ({ segment }) => {
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

    return (<div style={{
        width: "100%",
        height: "30px",
        backgroundColor: theme.palette.utilBar.default,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        overflow: "hidden",
    }}>
        <Typography
            variant="body1"
            sx={{
                fontSize: "1rem",
                float: "left",
                color: theme.palette.text.primary,
                display: "inline",
                height: "calc(100% - 10px)",
                padding: "5px",
                marginLeft: "5px",
                filter: "opacity(0.75)"
            }}
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
        >
            Diff
        </Typography>
        {/* Add React-Toasts to notify about saving and copying and more 💭 */}
        <Typography
            variant="body1"
            onClick={() => {
                navigator.clipboard.writeText(segment.content);
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
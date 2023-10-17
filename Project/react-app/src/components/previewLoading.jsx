import React from "react";
import { Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AnimatedDots from "./AnimatedDotsByGPT";

export const PreviewLoading = ({ webContainerStatus }) => {
    const theme = useTheme();
    return (<>
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: theme.palette.background.paper,
        }}>
            <CircularProgress color="secondary" />
            <Typography variant='h6' color="text.primary" style={{ marginTop: '10px' }}>
                {webContainerStatus != 1 && webContainerStatus != 2 ? (<>
                    Loading<AnimatedDots />
                </>) : null}
                {webContainerStatus == 1 ? (<>
                    Installing dependencies<AnimatedDots />
                </>) : null}
                {webContainerStatus == 2 ? (<>
                    Starting server<AnimatedDots />
                </>) : null}
            </Typography>
        </div>
    </>)
}
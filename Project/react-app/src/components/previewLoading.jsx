import React from "react";
import { Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AnimatedDots from "./AnimatedDotsByGPT";

export const PreviewLoading = ({ isInstallingDependencies, isStartingServer }) => {
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
                {!isInstallingDependencies && !isStartingServer ? (<>
                    Loading<AnimatedDots />
                </>) : null}
                {isInstallingDependencies ? (<>
                    Installing dependencies<AnimatedDots />
                </>) : null}
                {isStartingServer ? (<>
                    Starting server<AnimatedDots />
                </>) : null}
            </Typography>
        </div>
    </>)
}
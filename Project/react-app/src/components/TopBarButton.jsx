// Code written by an AI assistant

import React, { useState } from 'react';
import { Collapse, Typography } from '@mui/material';
import { useTheme } from '@mui/material';

function TopBarButton({ hoverIndex, setHoverIndex, Icon, text, onClick, buttonIndex, inReverse = false, alwaysOpen = false, openWidth = 50 }) {
    const theme = useTheme();

    const iconDivStyle = (isHovering = false) => {
        return {
            minWidth: "50px",
            height: "50px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isHovering ? theme.palette.background.paper : theme.palette.background.default,
            color: theme.palette.text.primary,
        }
    };

    return (
        <>
            {inReverse &&
                <Collapse
                    in={(hoverIndex == buttonIndex) || alwaysOpen}
                    orientation='horizontal'
                    style={{
                        color: theme.palette.text.primary,
                        backgroundColor: (hoverIndex == buttonIndex) ? theme.palette.background.paper : theme.palette.background.default,
                        height: '50px',
                        position: "relative"
                    }}
                >
                    <div
                        onMouseEnter={() => setHoverIndex(buttonIndex)}
                        onMouseLeave={() => setHoverIndex(null)}
                        onClick={onClick}
                        style={{ padding: (openWidth / 2) + "px" }}
                    >
                        <Typography
                            variant='body2'
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(calc(-50% + 20%), -50%)",
                            }}
                        >
                            {text}
                        </Typography>
                    </div>
                </Collapse>
            }
            <div
                onMouseEnter={() => setHoverIndex(buttonIndex)}
                onMouseLeave={() => setHoverIndex(null)}
                onClick={onClick}
                style={iconDivStyle(hoverIndex == buttonIndex)}
            >
                <Icon />
            </div>
            {!inReverse &&
                <Collapse
                    in={(hoverIndex == buttonIndex) || alwaysOpen}
                    orientation='horizontal'
                    style={{
                        color: theme.palette.text.primary,
                        backgroundColor: (hoverIndex == buttonIndex) ? theme.palette.background.paper : theme.palette.background.default,
                        height: '50px',
                        position: "relative"
                    }}
                >
                    <div
                        onMouseEnter={() => setHoverIndex(buttonIndex)}
                        onMouseLeave={() => setHoverIndex(null)}
                        onClick={onClick}
                        style={{ padding: (openWidth / 2) + "px" }}
                    >
                        <Typography
                            variant='body2'
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                transform: "translate(calc(-50% - 20%), -50%)",
                            }}
                        >
                            {text}
                        </Typography>
                    </div>
                </Collapse>
            }
        </>
    );
}

export default TopBarButton;

// Code written by an AI assistant

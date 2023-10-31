// Code written by an AI assistant

import React, { useState } from 'react';
import { Collapse, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { useTopBarContext } from '@/contexts/topbar-hover-context';

type TopBarButtonProps = {
    Icon: any;
    text: string;
    onClick: (value: any) => void;
    buttonIndex: number;
    inReverse?: boolean;
    alwaysOpen?: boolean;
    openWidth?: number;
}

function TopBarButton({ Icon, text, onClick, buttonIndex, inReverse = false, alwaysOpen = false, openWidth = 50 }: TopBarButtonProps) {
    const theme = useTheme();
    const { hoverIndex, setHoverIndex, alternate } = useTopBarContext();

    const iconDivStyle = (isHovering = false): React.CSSProperties => {
        const hoverBG = (isHovering: boolean) => isHovering ? theme.palette.background.paper : theme.palette.background.default;
        return {
            minWidth: "50px",
            height: "50px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: alternate ? hoverBG(!isHovering) : hoverBG(isHovering),
            color: theme.palette.text.primary,
        }
    };

    const collapseStyle = (isHovering = false): React.CSSProperties => {
        const hoverBG = (isHovering: boolean) => isHovering ? theme.palette.background.paper : theme.palette.background.default;
        return {
            color: theme.palette.text.primary,
            backgroundColor: alternate ? hoverBG(!isHovering) : hoverBG(isHovering),
            height: '50px',
            position: "relative"
        }
    };

    return (
        <>
            {inReverse &&
                <Collapse
                    in={(hoverIndex == buttonIndex) || alwaysOpen}
                    orientation='horizontal'
                    style={collapseStyle(hoverIndex == buttonIndex)}
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
                                userSelect: "none",
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
                    style={collapseStyle(hoverIndex == buttonIndex)}
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
                                userSelect: "none",
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

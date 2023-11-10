import React, { useCallback } from "react";

import { Typography, useTheme } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SettingsIcon from '@mui/icons-material/Settings';
import PaletteIcon from '@mui/icons-material/Palette';
import StarIcon from '@mui/icons-material/Star';

import { ConversationWindow } from "./ConversationWindow";
import FileTreeDisplay from "./FileTreeDisplay";
import ProjectConfig from "./ProjectConfig";
import { Scrollbar } from "react-scrollbars-custom";

export const SideBar = ({ sidebarWidth, setSidebarWidth }) => {
    const theme = useTheme();
    const [selectedTab, setSelectedTab] = React.useState(0);
    const [hoverIndex, setHoverIndex] = React.useState(null);

    const iconDivStyle = (isHovering = false) => {
        return {
            width: "50px",
            height: "50px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: isHovering ? theme.palette.background.paper : theme.palette.background.default,
            color: theme.palette.text.primary,
        }
    };

    const handleMouseDown = useCallback((event) => {
        event.preventDefault();
        // Get the initial mouse position
        let lastX = event.clientX;
        const handleMouseMove = (event) => {
            // Calculate deltaX as the difference between the current and last clientX
            const deltaX = event.clientX - lastX;
            // Update lastX for the next move event
            lastX = event.clientX;

            setSidebarWidth((width) => {
                const newWidth = width + deltaX;
                if (newWidth < 58) {
                    return 58;
                }
                return newWidth;
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }, [sidebarWidth]);

    const setTab = (tab) => {
        if (tab === selectedTab) {
            //console.log("Closing tab")
            setSidebarWidth(50)
            setSelectedTab(null)
            return;
        }
        let minWidth;
        let maxWidth;


        switch (tab) {
            case 0:
                minWidth = 320;
                maxWidth = 350;
                if (sidebarWidth < minWidth) {
                    setSidebarWidth(minWidth)
                }
                if (sidebarWidth > maxWidth) {
                    setSidebarWidth(maxWidth)
                }
                setSelectedTab(0);
                break;
            case 1:
                minWidth = 600;
                maxWidth = 800;
                if (sidebarWidth < minWidth) {
                    setSidebarWidth(minWidth)
                }
                if (sidebarWidth > maxWidth) {
                    setSidebarWidth(maxWidth)
                }
                setSelectedTab(1);
                break;
            case 2:
                if (sidebarWidth < 300) {
                    setSidebarWidth(300)
                }
                setSelectedTab(2);
                break;
            case 3:
                minWidth = 450;
                maxWidth = 550;
                if (sidebarWidth < minWidth) {
                    setSidebarWidth(minWidth)
                }
                if (sidebarWidth > maxWidth) {
                    setSidebarWidth(maxWidth)
                }
                setSelectedTab(3);
                break;
            default:
                break;
        }
    }

    const sideBarOuterDivStyle = {
        width: sidebarWidth + "px",
        minWidth: "fit-content",
        height: "100%",
        backgroundColor: theme.palette.background.paper,
        position: "relative",
        borderTopRightRadius: "0px",
        borderBottomRightRadius: "0px",
        // overflow: "hidden",
    }

    const sideBarButtonStripStyle = {
        position: "absolute",
        top: "0px",
        left: "0px",
        bottom: "0px",
        width: "50px",
        backgroundColor: theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
    }

    const sideBarContentStyle = {
        position: "absolute",
        top: "0px",
        right: "8px",
        bottom: "0px",
        width: "calc(100% - 58px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
    }

    const sideBarContentInnerWrapperStyle = {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        color: theme.palette.text.primary,
        // overflow: "hidden",
    }

    const resizeBarStyle = {
        width: '8px',
        height: '100%',
        zIndex: 2,
        cursor: 'col-resize',
        backgroundColor: theme.palette.dragBar.default,
        float: "right",
    }

    return (
        <div
            style={sideBarOuterDivStyle}
        >
            <div style={sideBarButtonStripStyle}>
                <div
                    onMouseEnter={(e) => setHoverIndex(0)}
                    onMouseLeave={(e) => setHoverIndex(null)}
                    onClick={() => setTab(0)}
                    style={iconDivStyle(hoverIndex == 0 || selectedTab == 0)}>
                    <FolderOpenIcon />
                </div>
                <div
                    onMouseEnter={(e) => setHoverIndex(1)}
                    onMouseLeave={(e) => setHoverIndex(null)}
                    onClick={() => setTab(1)}
                    style={iconDivStyle(hoverIndex == 1 || selectedTab == 1)}>
                    <StarIcon />
                </div>
                {/* <div
                    onMouseEnter={(e) => setHoverIndex(2)}
                    onMouseLeave={(e) => setHoverIndex(null)}
                    onClick={() => setTab(2)}
                    style={iconDivStyle(hoverIndex == 2 || selectedTab == 2)}>
                    <PaletteIcon />
                </div> */}
                <div
                    onMouseEnter={(e) => setHoverIndex(3)}
                    onMouseLeave={(e) => setHoverIndex(null)}
                    onClick={() => setTab(3)}
                    style={iconDivStyle(hoverIndex == 3 || selectedTab == 3)}>
                    <SettingsIcon />
                </div>
            </div>
            <div
                className="sideBarContent"
                style={sideBarContentStyle}
            >
                <Scrollbar
                    noScrollX
                    style={{
                        flexGrow: 1,
                        height: "100%"
                    }}>

                    <div
                        style={sideBarContentInnerWrapperStyle}
                    >
                        {selectedTab === 0 ? (<>
                            <FileTreeDisplay />
                        </>) : null}
                        {selectedTab === 1 ? (<>
                            <ConversationWindow />
                        </>) : null}
                        {selectedTab === 2 ? (<>
                            {/* Theme View Component goes here 💭 */}
                            <Typography variant="h6">Theme<br /> WIP <br /> Component goes here</Typography>
                        </>) : null}
                        {selectedTab === 3 ? (<>
                            <ProjectConfig />
                        </>) : null}
                    </div>
                </Scrollbar>
            </div>
            <div
                onMouseDown={(event) => handleMouseDown(event)}
                style={resizeBarStyle}></div>
        </div>
    );
}
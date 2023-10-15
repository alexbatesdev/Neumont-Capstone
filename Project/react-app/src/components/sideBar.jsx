import React from "react";
import { Typography, useTheme } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import SettingsIcon from '@mui/icons-material/Settings';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import PaletteIcon from '@mui/icons-material/Palette';
import { useCallback } from "react";
import { ConversationWindow } from "./conversationWindow";
import StarIcon from '@mui/icons-material/Star';
import FileTreeDisplay from "./fileTreeDisplay";
import { EditorContext } from "@/contexts/editor-context";

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

    // This will be a function passed down from the editor page
    const saveProject = () => {
        console.log("Saving project");
    }

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
                const newWidth = parseInt(width.substring(0, width.length - 2)) + deltaX;
                if (newWidth < 58) {
                    return "58px";
                }
                return newWidth + "px";
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
            console.log("Closing tab")
            setSidebarWidth("50px")
            setSelectedTab(null)
            return;
        }
        let minWidth;
        let maxWidth;


        switch (tab) {
            case 0:
                minWidth = 300;
                maxWidth = 330;
                if (parseInt(sidebarWidth.substring(0, sidebarWidth.length - 2)) < minWidth) {
                    setSidebarWidth(minWidth + "px")
                }
                if (parseInt(sidebarWidth.substring(0, sidebarWidth.length - 2)) > maxWidth) {
                    setSidebarWidth(maxWidth + "px")
                }
                setSelectedTab(0);
                break;
            case 1:
                minWidth = 600;
                maxWidth = 800;
                if (parseInt(sidebarWidth.substring(0, sidebarWidth.length - 2)) < minWidth) {
                    setSidebarWidth(minWidth + "px")
                }
                if (parseInt(sidebarWidth.substring(0, sidebarWidth.length - 2)) > maxWidth) {
                    setSidebarWidth(maxWidth + "px")
                }
                setSelectedTab(1);
                break;
            case 2:
                if (parseInt(sidebarWidth.substring(0, sidebarWidth.length - 2)) < 300) {
                    setSidebarWidth("300px")
                }
                setSelectedTab(2);
                break;
            case 3:
                if (parseInt(sidebarWidth.substring(0, sidebarWidth.length - 2)) < 300) {
                    setSidebarWidth("300px")
                }
                setSelectedTab(3);
                break;
            default:
                break;
        }
    }

    return (
        <div
            style={{
                width: sidebarWidth,
                minWidth: "fit-content",
                height: "100%",
                backgroundColor: theme.palette.background.paper,
                position: "relative",
                borderTopRightRadius: theme.shape.borderRadius,
                borderBottomRightRadius: theme.shape.borderRadius,
                overflow: "hidden",
            }}
        >
            <div style={{
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
            }}>
                <div
                    onMouseEnter={(e) => setHoverIndex(-1)}
                    onMouseLeave={(e) => setHoverIndex(null)}
                    onClick={() => saveProject()}
                    style={iconDivStyle(hoverIndex == -1)}>
                    <SaveIcon />
                </div>
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
                <div
                    onMouseEnter={(e) => setHoverIndex(2)}
                    onMouseLeave={(e) => setHoverIndex(null)}
                    onClick={() => setTab(2)}
                    style={iconDivStyle(hoverIndex == 2 || selectedTab == 2)}>
                    <PaletteIcon />
                </div>
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
                style={{
                    position: "absolute",
                    top: "0px",
                    right: "8px",
                    bottom: "0px",
                    width: "calc(100% - 58px)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    // backgroundColor: "lime",
                    // filter: "opacity(0.25)",
                }}
            >
                {selectedTab === 0 ? (<>
                    <div
                        className="FilesTab"
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            color: theme.palette.text.primary,
                            overflow: "hidden",
                            // backgroundColor: "red",
                            // filter: "opacity(0.25)",
                        }}
                    >
                        {/* Heirarchy View Component goes here 💭 */}
                        <FileTreeDisplay />
                    </div>
                </>) : null}
                {selectedTab === 1 ? (<>
                    <div
                        className="ConversationTab"
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            color: theme.palette.text.primary,
                            overflow: "hidden",
                            // backgroundColor: "blue",
                            // filter: "opacity(0.25)",
                        }}
                    >
                        {/* Conversation View Component goes here 💭 */}
                        <ConversationWindow />
                    </div>
                </>) : null}
                {selectedTab === 2 ? (<>
                    <div
                        className="ThemeTab"
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            color: theme.palette.text.primary,
                            overflow: "hidden",
                            // backgroundColor: "green",
                            // filter: "opacity(0.25)",
                        }}
                    >
                        {/* Theme View Component goes here 💭 */}
                        <Typography variant="h6">Theme<br /> WIP <br /> Component goes here</Typography>
                    </div>
                </>) : null}
                {selectedTab === 3 ? (<>
                    <div
                        className="SettingsTab"
                        style={{
                            width: "100%",
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            color: theme.palette.text.primary,
                            overflow: "hidden",
                            // backgroundColor: "yellow",
                            // filter: "opacity(0.25)",
                        }}
                    >
                        {/* Settings View Component goes here 💭 */}
                        <Typography variant="h6">Settings<br /> WIP <br /> Component goes here</Typography>
                    </div>
                </>) : null}
            </div>
            <div
                onMouseDown={(event) => handleMouseDown(event)}
                style={{
                    width: '8px',
                    height: '100%',
                    zIndex: 2,
                    cursor: 'col-resize',
                    backgroundColor: theme.palette.divider.default,
                    float: "right",
                }}></div>
        </div>
    );
}
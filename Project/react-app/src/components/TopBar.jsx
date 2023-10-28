import React from "react";
import { Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import TopBarButton from '@/components/TopBarButton';
import SaveIcon from '@mui/icons-material/Save';
import { ArrowBack, ArrowLeft } from '@mui/icons-material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { useProjectData } from "@/contexts/editor-context";
import ShareIcon from '@mui/icons-material/Share';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const TopBar = () => {
    const theme = useTheme();
    const router = useRouter();
    const [hoverIndex, setHoverIndex] = useState(null);
    const { projectData, setProjectData } = useProjectData();


    const topBarStyles = {
        width: '100%',
        maxWidth: '100vw',
        height: '50px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
    }

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

    const saveProject = () => {
        console.log("Saving project");
    }

    const handleBack = () => {
        router.back();
    }

    const forkProject = () => {
        console.log("Forking project");
    }

    const shareProject = () => {
        console.log("Sharing project");
    }

    return (<>
        <div
            className='topBar'
            style={topBarStyles}
        >
            <span style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
            }}>

                <TopBarButton
                    hoverIndex={hoverIndex}
                    setHoverIndex={setHoverIndex}
                    Icon={ArrowBack}
                    text={"Back"}
                    onClick={handleBack}
                    buttonIndex={0}
                />
                <TopBarButton
                    hoverIndex={hoverIndex}
                    setHoverIndex={setHoverIndex}
                    Icon={SaveIcon}
                    text={"Save"}
                    onClick={saveProject}
                    buttonIndex={1}
                />
                <TopBarButton
                    hoverIndex={hoverIndex}
                    setHoverIndex={setHoverIndex}
                    Icon={AltRouteIcon}
                    text={"Fork"}
                    onClick={forkProject}
                    buttonIndex={2}
                />
                <TopBarButton
                    hoverIndex={hoverIndex}
                    setHoverIndex={setHoverIndex}
                    Icon={ShareIcon}
                    text={"Share"}
                    onClick={shareProject}
                    buttonIndex={3}
                />
            </span>
            <span>
                <Typography variant="h6" color={"text.primary"} sx={{ fontWeight: "bold" }}>
                    {projectData.project_name}
                </Typography>
            </span>
            <span style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
            }}>
                <TopBarButton
                    hoverIndex={hoverIndex}
                    setHoverIndex={setHoverIndex}
                    Icon={AccountCircleIcon}
                    text={"Account"}
                    onClick={() => { alert("Account") }}
                    buttonIndex={-1}
                    openWidth={60}
                    inReverse
                    alwaysOpen
                />
            </span>
        </div>
    </>)
}

export default TopBar;
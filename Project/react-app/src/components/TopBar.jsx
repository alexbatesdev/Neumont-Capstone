import React from "react";
import { Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import TopBarButton from '@/components/TopBarButton';
import SaveIcon from '@mui/icons-material/Save';
import { ArrowBack, ArrowLeft } from '@mui/icons-material';
import AltRouteIcon from '@mui/icons-material/AltRoute';
import { useEditorContext, useProjectData } from "@/contexts/editor-context";
import ShareIcon from '@mui/icons-material/Share';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { TopBarContextProvider } from "@/contexts/topbar-hover-context";

const TopBar = ({ children, titleText, backLocation, alternate = false, showSignIn = false, hideBack = false }) => {
    const theme = useTheme();
    const router = useRouter();
    const [hoverIndex, setHoverIndex] = useState(null);
    const { saveProject } = useEditorContext();


    const topBarStyles = {
        width: '100%',
        maxWidth: '100vw',
        height: '50px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: alternate ? theme.palette.background.paper : theme.palette.background.default,
    }

    const handleBack = () => {
        router.push(backLocation);
    }

    return (<>
        <div
            className='topBar'
            style={topBarStyles}
        >
            <TopBarContextProvider alternate={alternate}>
                <span style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                }}>
                    {!hideBack &&
                        <TopBarButton
                            Icon={ArrowBack}
                            text={"Back"}
                            onClick={handleBack}
                            buttonIndex={0}
                        />}
                    {children}
                </span>
                <span style={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}>
                    <Typography variant="h6" color={"text.primary"} sx={{ fontWeight: "bold" }}>
                        {titleText}
                    </Typography>
                </span>
                <span style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                }}>
                    {showSignIn &&
                        <TopBarButton
                            hoverIndex={hoverIndex}
                            setHoverIndex={setHoverIndex}
                            Icon={AccountCircleIcon}
                            text={"Sign in/up"}
                            // Add a url parameter that will redirect to the current page after signing in 💭
                            onClick={() => { router.push('/access') }}
                            buttonIndex={-1}
                            openWidth={60}
                            inReverse
                            alwaysOpen
                        />
                    }
                </span>
            </TopBarContextProvider>
        </div>
    </>)
}

export default TopBar;
import React from "react";
import { Typography, useTheme } from "@mui/material";
import { useRouter } from "next/router";
import { useState } from "react";
import TopBarButton from '@/components/TopBarButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useEditorContext, useProjectData } from "@/contexts/editor-context";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { TopBarContextProvider } from "@/contexts/topbar-hover-context";
import { signOut, useSession } from "next-auth/react";

const TopBar = ({ children, titleText, backLocation, alternate = false, showSignIn = false, hideBack = false }) => {
    const theme = useTheme();
    const session = useSession();
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
        zIndex: 5,
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
                            Icon={ArrowBackIcon}
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
                            text={session.status == "authenticated" ? "Sign Out" : "Sign In"}
                            // Add a url parameter that will redirect to the current page after signing in 💭
                            onClick={() => {
                                if (session.status == "authenticated") {
                                    signOut();
                                } else {
                                    router.push('/access');
                                }
                            }}
                            buttonIndex={-1}
                            openWidth={75}
                            inReverse
                        />
                    }
                </span>
            </TopBarContextProvider>
        </div>
    </>)
}

export default TopBar;
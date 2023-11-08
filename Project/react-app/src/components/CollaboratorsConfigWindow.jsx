import React from 'react';
import { Button, Collapse, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccountCircle, Add } from '@mui/icons-material';
import ProfileMiniAccordion from './ProfileMiniAccordion';

const CollaboratorsConfigWindow = ({ collaborators, setCollaborators }) => {
    console.log(collaborators)
    const theme = useTheme();
    const router = useRouter();
    const [profile, setProfile] = React.useState(null);
    const [expanded, setExpanded] = React.useState(false);


    const iconStyle = {
        width: '40px',
        height: '40px',
        color: theme.palette.text.primary,
        paddingRight: '10px',
    }

    const handleExpand = () => {
        setExpanded(!expanded);
    }

    return (<>
        <div style={{
            width: 'calc(100% - 20px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: theme.palette.background.default,
        }}>
            <div style={{
                width: '100%',
                height: "50px",
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: theme.palette.background.alternate,
            }}>
                <Typography sx={{ pl: "10px" }}>
                    Collaborators
                </Typography>
                <Add sx={{ marginLeft: "auto", pr: "10px", height: "40px", width: "40px" }} />
                {expanded ? <ExpandLessIcon onClick={handleExpand} sx={iconStyle} /> : <ExpandMoreIcon onClick={handleExpand} sx={iconStyle} />}
            </div>
            <Collapse in={expanded}>
                {collaborators.length == 0 && <Typography sx={{ width: "calc(100% - 20px)", padding: "10px" }}>
                    No collaborators
                </Typography>}
                {collaborators.map((collaborator, index) => {
                    return <ProfileMiniAccordion profile_id={collaborator} isCollaborator />
                })}
            </Collapse>
        </div>
    </>);
};

export default CollaboratorsConfigWindow;

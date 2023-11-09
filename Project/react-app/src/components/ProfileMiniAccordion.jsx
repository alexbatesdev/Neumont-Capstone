import React from 'react';
import { Button, Collapse, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccountCircle } from '@mui/icons-material';
import { useProjectData } from '@/contexts/editor-context';
import { useSession } from 'next-auth/react';

function ProfileMiniAccordion({ profile_id, showRemoveCollaborator = false, showAddCollaborator = false }) {
    const theme = useTheme();
    const router = useRouter();
    const session = useSession();
    const [profile, setProfile] = React.useState(null);
    const [expanded, setExpanded] = React.useState(false);
    const { projectData, setProjectData } = useProjectData();

    // rest of component code goes here
    useEffect(() => {
        const getProfile = async () => {
            let response = await fetch(`${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/by_id/${profile_id}`, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            if (response.status !== 200) {
                console.log(response)
                return
            }
            let data = await response.json()
            console.log(data)
            setProfile(data)
        }
        getProfile()
    }, [profile_id])

    const iconStyle = {
        width: '40px',
        height: '40px',
        color: theme.palette.text.primary,
        paddingRight: '10px',
    }

    const handleExpand = () => {
        setExpanded(!expanded);
    }

    const removeCollaboratorMethod = async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL}/by_id/${projectData.project_id}/remove_collaborator/${profile_id}`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${session.data.token}`,
            },
        })
        if (response.status !== 200) {
            console.log(response)
            return
        }
        let data = await response.json()
        console.log(data)
        setProjectData((prevData) => {
            const output = {
                ...prevData,
                collaborators: data.collaborators,
            }
            return output;
        })
    }

    const addCollaboratorMethod = async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL}/by_id/${projectData.project_id}/add_collaborator/${profile_id}`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${session.data.token}`,
            },
        })
        if (response.status !== 200) {
            console.log(response)
            return
        }
        let data = await response.json()
        console.log(data)
        setProjectData((prevData) => {
            const output = {
                ...prevData,
                collaborators: data.collaborators,
            }
            return output;
        })
    }

    return (<div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }}>
        <div style={{
            width: '100%',
            height: "50px",
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            // backgroundColor: theme.palette.background.default,
        }}
            onClick={handleExpand}
        >
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'center',
                paddingLeft: '10px',
                gap: '10px',
            }}>
                <AccountCircle />
                <Typography variant="body1">
                    {profile ? profile.name : "Loading..."}
                </Typography>
            </div>
            {expanded ? <ExpandLessIcon onClick={handleExpand} sx={iconStyle} /> : <ExpandMoreIcon onClick={handleExpand} sx={iconStyle} />}
        </div>
        <Collapse in={expanded} sx={{ width: "100%" }} >
            <div style={{
                width: "calc(100% - 20px)",
                padding: "10px",
                height: 'auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                backgroundColor: theme.palette.background.default,
            }}
            >
                <Typography variant="body1" onClick={() => {
                    navigator.clipboard.writeText(profile_id)
                }}>
                    ID: <span style={{
                        fontFamily: 'monospace',
                        backgroundColor: theme.palette.background.default,
                        padding: '0.25rem',
                        borderRadius: '3px',
                        fontSize: '0.95rem',
                    }}>{profile ? profile.account_id : "Loading..."}</span>
                </Typography>
                <Typography variant="body1">
                    Email: {profile ? profile.email : "Loading..."}
                </Typography>
                <span style={{
                    width: "100%",
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: '10px',
                }}>

                    <Button variant="outlined" size='small' onClick={() => router.push(`/profile/${profile_id}`)} sx={{ mt: 1 }}>View Profile</Button>
                    {/* Remove collaborator button */}
                    {showRemoveCollaborator && <Button variant="outlined" size='small' color='error' sx={{ mt: 1 }} onClick={removeCollaboratorMethod}>Remove Collaborator</Button>}
                    {showAddCollaborator && <Button variant="outlined" size='small' color='success' sx={{ mt: 1 }} onClick={addCollaboratorMethod}>Add Collaborator</Button>}
                </span>
            </div>
        </Collapse>
    </div>);
}

export default ProfileMiniAccordion;

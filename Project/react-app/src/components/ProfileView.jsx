import { useTheme } from '@emotion/react';
import { Box, Button, Card, TextField, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const ProfileView = () => {
    const theme = useTheme();
    const session = useSession();
    const [profile, setProfile] = React.useState(null);
    const [editMode, setEditMode] = React.useState(false);

    useEffect(() => {
        const getProfile = async () => {
            let response = await fetch(`${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/me`, {
                headers: {
                    "Authorization": `Bearer ${session.data.token}`,
                    "Content-Type": "application/json"
                }
            })
            if (response.status !== 200) {
                console.log(response)
                return
            }
            let data = await response.json()
            // console.log(data)
            setProfile(data.user)
        }
        if (session.data) getProfile()
    }, [session])

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: theme.palette.background.paper,
            borderRadius: "7px",
            width: "450px"
        }}>
            <Typography variant="h4">Profile</Typography>
            {profile && <>
                <Typography onClick={() => navigator.clipboard.writeText(profile.account_id)} variant='h6'>ID: <span style={{
                    fontFamily: 'monospace',
                    backgroundColor: theme.palette.background.default,
                    padding: '0.25rem',
                    borderRadius: '3px',
                    fontSize: '0.95rem',
                }}>{profile.account_id}</span></Typography>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: '1rem',
                    }}>
                        <Typography variant='h6'>Name: </Typography>
                        <TextField variant='outlined' value={profile.name} disabled={!editMode} />
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: '1rem',
                    }}>
                        <Typography variant='h6'>Email: </Typography>
                        <TextField variant='outlined' value={profile.email} disabled={!editMode} />
                    </div>

                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    width: "100%",
                    gap: '1rem',
                }}>
                    {editMode && <Button variant='contained' color='error' sx={{
                        marginRight: "auto"
                    }}>Delete Account</Button>}
                    {editMode && <>
                        <Button variant='contained' color='secondary' onClick={() => setEditMode(!editMode)}>Cancel</Button>
                        <Button variant='contained' color='primary'>Save</Button>
                    </>}
                    {!editMode && <Button variant="contained" onClick={() => setEditMode(!editMode)}>Edit</Button>}
                </div>
            </>}

        </Box >
    );
};

export default ProfileView;

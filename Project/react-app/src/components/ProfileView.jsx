import { useTheme } from '@mui/material';
import { Box, Button, Card, Modal, TextField, Typography } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const ProfileView = () => {
    const theme = useTheme();
    const session = useSession();
    const [profile, setProfile] = React.useState(null);
    const [newName, setNewName] = React.useState('');
    const [newEmail, setNewEmail] = React.useState('');
    const [editMode, setEditMode] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);

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
            setNewName(data.user.name)
            setNewEmail(data.user.email)
        }
        if (session.data) getProfile()
    }, [session])

    const handleSave = async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/update_account`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${session.data.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newName, email: newEmail })
        })
        setEditMode(false)
    }

    const handleCancel = () => {
        setEditMode(false)
        setNewName(profile.name)
        setNewEmail(profile.email)
    }

    const handleDelete = async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/deactivate/${session.data.user.account_id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${session.data.token}`,
                "Content-Type": "application/json"
            }
        })
        signOut()
    }

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
                        <TextField variant='outlined' value={newName} disabled={!editMode} onChange={(event) => setNewName(event.target.value)} />
                    </div>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        gap: '1rem',
                    }}>
                        <Typography variant='h6'>Email: </Typography>
                        <TextField variant='outlined' value={newEmail} disabled={!editMode} onChange={(event) => setNewEmail(event.target.value)} />
                    </div>

                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    width: "100%",
                    gap: '1rem',
                }}>
                    {editMode && <Button
                        variant='contained'
                        color='error'
                        sx={{
                            marginRight: "auto"
                        }}
                        onClick={() => setModalOpen(true)}
                    >
                        Delete Account
                    </Button>}
                    {modalOpen && <>
                        {/* Copilot snippet, I might make this prettier, but for now it does the job, also I added the methods that actually do things, only the layout is copilot */}
                        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                            <div style={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                            }}>
                                <Card sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    gap: "1rem",
                                    padding: "1rem",
                                    width: "450px",
                                    height: "250px"
                                }}>
                                    <Typography variant="h5">Are you sure you want to delete your account?</Typography>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        gap: "1rem",
                                        width: "100%"
                                    }}>
                                        <Button variant="contained" color="error" sx={{
                                            width: "50%"
                                        }} onClick={handleDelete}>Delete</Button>
                                        <Button variant="contained" color="secondary" sx={{
                                            width: "50%"
                                        }} onClick={() => setModalOpen(false)}>Cancel</Button>
                                    </div>
                                </Card>
                            </div>
                        </Modal>
                        {/* Copilot snippet over, also it was my idea to use a mui Modal, I just didn't want to think about styling right now. Weird tense changes, but that's how it be with cross-time messages. Aren't all messages cross time? */}
                    </>}
                    {editMode && <>
                        <Button variant='contained' color='secondary' onClick={handleCancel}>Cancel</Button>
                        <Button variant='contained' color='primary' onClick={handleSave}>Save</Button>
                    </>}
                    {!editMode && <Button variant="contained" onClick={() => setEditMode(!editMode)}>Edit</Button>}
                </div>
            </>}

        </Box >
    );
};

export default ProfileView;

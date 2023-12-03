import { useTheme } from '@mui/material';
import { Box, Button, Card, Modal, TextField, Typography } from '@mui/material';
import { signOut, useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import EditIcon from '@mui/icons-material/Edit';
import ShareIcon from '@mui/icons-material/Share';

const ProfileView = ({ profile_in }) => {
    const theme = useTheme();
    const session = useSession()
    const [profile, setProfile] = React.useState(null);
    const [newName, setNewName] = React.useState('');
    const [newEmail, setNewEmail] = React.useState('');
    const [newAPIKey, setNewAPIKey] = React.useState('');
    const [editMode, setEditMode] = React.useState(false);
    const [modalOpen, setModalOpen] = React.useState(false);



    useEffect(() => {
        console.log(session)
        const getProfile = async () => {
            let response = await fetch(`/api/proxy?url=${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/me`, {
                headers: {
                    "Authorization": `Bearer ${session.data.token}`,
                    "Content-Type": "application/json"
                }
            })
            if (response.status !== 200) {
                console.log(response)
                toast.error("Error getting profile. Try refreshing the page.")
                return
            }
            let data = await response.json()
            // console.log(data)
            setProfile(data.user)
            setNewName(data.user.name)
            setNewEmail(data.user.email)
            setNewAPIKey(data.user.openai_api_key)
        }
        if (session.data && !profile_in) getProfile()
        else if (profile_in) {
            setProfile(profile_in)
            setNewName(profile_in.name)
            setNewEmail(profile_in.email)
            setNewAPIKey(profile_in.openai_api_key)
        }
    }, [session, profile_in])

    const handleSave = async () => {
        let response = await fetch(`/api/proxy?url=${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/update_account`, {
            method: 'PATCH',
            headers: {
                "Authorization": `Bearer ${session.data.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: newName, email: newEmail })
        }).then(res => {
            if (res.status !== 200) {
                toast.error("Error updating profile")
            } else {
                toast.success("Profile updated")
                // update()
            }
        })
        setEditMode(false)
    }

    const handleCancel = () => {
        setEditMode(false)
        setNewName(profile.name)
        setNewEmail(profile.email)
        setNewAPIKey(profile.openai_api_key)
    }

    const handleDelete = async () => {
        let response = await fetch(`/api/proxy?url=${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/deactivate/${session.data.user.account_id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${session.data.token}`,
                "Content-Type": "application/json"
            }
        }).catch(err => {
            console.log(err)
            toast.error("Error deleting account. Contact support or try again.")
        })
        signOut()
    }

    const handleFollow = async () => {
        let response = await fetch(`/api/proxy?url=${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/follow/${profile.account_id}`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${session.data.token}`,
                "Content-Type": "application/json"
            }
        }).then(async res => {
            if (res.status !== 200) {
                toast.error("Error following user")
            } else {
                toast.success("Followed user")
                session.update(await res.json())
            }
        }).catch(err => {
            console.log(err)
            toast.error("Error following user")
        })
    }

    const handleUnfollow = async () => {
        let response = await fetch(`/api/proxy?url=${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/unfollow/${profile.account_id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${session.data.token}`,
                "Content-Type": "application/json"
            }
        }).then(async res => {
            if (res.status !== 200) {
                toast.error("Error unfollowing user")
            } else {
                toast.success("Unfollowed user")
                session.update(await res.json())
            }
        }).catch(err => {
            console.log(err)
            toast.error("Error unfollowing user")
        })
    }

    // Demoted to stretch goal 💭
    // const handleInvite = async () => {
    // }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            padding: '1rem',
            backgroundColor: theme.palette.background.paper,
            // borderRadius: "7px",
            width: "calc(100% - 2rem)",
            position: "relative",
        }}>
            {profile && (<>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <Typography variant="h4">{profile.name}</Typography>
                    <ShareIcon
                        onClick={() => {
                            navigator.clipboard.writeText(`/api/proxy?url=${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/profile/${profile.account_id}`)
                            toast.success("Copied profile link to clipboard")
                        }}
                        sx={{
                            color: theme.palette.text.primary,
                            cursor: "pointer",
                            "&:hover": {
                                color: theme.palette.secondary.main,
                            },
                            transition: "color 0.2s ease-in-out",
                        }} />
                </div>
                <Typography variant="h5">{profile.email}</Typography>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <Typography variant='h6'>{profile.projects?.length} Projects</Typography>
                    <Typography variant='h6'>{profile.following?.length} Following</Typography>
                </div>
                {
                    session.data?.user.account_id !== profile.account_id &&
                    session.status === "authenticated" &&
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '1rem',
                    }}>

                        <Button
                            variant={session.data?.user.following.includes(profile.account_id) ? 'outlined' : 'contained'}
                            color='tertiary'
                            size='small'
                            onClick={() => {
                                if (session.data?.user.following.includes(profile.account_id)) handleUnfollow()
                                else handleFollow()
                            }}
                            sx={{
                                marginTop: '1rem'
                            }}>
                            {session.data?.user.following.includes(profile.account_id) ? 'Unfollow' : 'Follow'}
                        </Button>
                        {/* Demoted to stretch goal 💭*/}
                        {/* <Button
                            variant='outlined'
                            color='secondary'
                            size='small'
                            onClick={handleInvite}
                            sx={{
                                marginTop: '1rem'
                            }}>
                            Invite to project
                        </Button> */}
                    </div>
                }
            </>)}
            {editMode && <>
                <Typography onClick={() => {
                    navigator.clipboard.writeText(profile.account_id)
                    toast.success("Copied ID to clipboard")
                }} variant='h6' style={{
                    fontFamily: 'monospace',
                    backgroundColor: theme.palette.background.default,
                    padding: '0px 4px',
                    borderRadius: '3px',
                    fontSize: '0.95rem',
                }}>{profile.account_id}</Typography>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: "1rem"
                }}>
                    <TextField variant='outlined' value={newName} disabled={!editMode} onChange={(event) => setNewName(event.target.value)} label="Name" />
                    <TextField variant='outlined' value={newEmail} disabled={!editMode} onChange={(event) => setNewEmail(event.target.value)} label="Email" />
                </div>
                <TextField variant='outlined' fullWidth value={newAPIKey} disabled={!editMode} onChange={(event) => setNewAPIKey(event.target.value)} label="OpenAI api key (Needed to access GPT 4)" sx={{ mt: "1rem" }} />
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    width: "100%",
                    gap: '1rem',
                    marginTop: "1rem"
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
                </div>
            </>}
            {!editMode
                && (session.data && profile)
                && session.data.user.account_id == profile.account_id
                && <EditIcon onClick={() => setEditMode(!editMode)} sx={{
                    position: 'absolute',
                    right: "0.5rem",
                    top: "0.5rem",
                    color: theme.palette.text.primary,
                    cursor: "pointer",
                    "&:hover": {
                        color: theme.palette.secondary.main,
                    },
                    transition: "color 0.2s ease-in-out",
                }}>
                    Edit
                </EditIcon>
            }

        </Box >
    );
};

export default ProfileView;

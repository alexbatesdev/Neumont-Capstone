import React, { useEffect } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { Scrollbar } from "react-scrollbars-custom";
import { toast } from "react-toastify";
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

const FollowingView = ({ following_account_id }) => {
    const theme = useTheme();
    const [following_list, setFollowingList] = React.useState([]);

    useEffect(() => {
        const getFollowingList = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/following/${following_account_id}`, {
                method: 'GET',
            }).then((data) => {
                console.log(data)
                if (data.status === 200) {
                    return data.json()
                } else {
                    toast.error("Error loading following list. Refresh the page to try again.")
                }
            }).catch(err => {
                toast.error("Error loading following list. Refresh the page to try again.")
            })

            setFollowingList(response.following_list)
        }
        if (following_account_id) {
            getFollowingList()
        }
    }, [following_account_id])

    return (<Scrollbar noScrollX style={{
        flexGrow: 1,
        width: '100%',
        // backgroundColor: theme.palette.utilBar.default
    }}>
        <div style={{
            width: '100%',
            height: '50px',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            backgroundColor: theme.palette.background.paper,
        }}>
            <Typography variant="h6" style={{
                color: theme.palette.text.primary,
                fontWeight: 'bold',
                marginLeft: '1rem',
            }}>
                Following:
            </Typography>
        </div>
        {console.log("====================================")}
        {console.log(following_list)}
        {following_list && following_list.map((account, index) => {
            console.log(account)

            return (<div key={index} style={{
                width: 'calc(100% - 2rem)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                backgroundColor: theme.palette.background.paper,
                padding: '0.5rem 1rem',
                position: 'relative',
                marginTop: '1rem',
            }}>
                <Box
                    onClick={() => {
                        window.open(`/profile/${account.account_id}`, '_blank')
                    }}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '0.5rem',
                        "&:hover": {
                            cursor: 'pointer',
                            color: theme.palette.secondary.main,
                        },
                        transition: 'color 0.25s ease-in-out',
                    }}>

                    <Typography variant="h6" style={{
                        color: "inherit",
                        fontWeight: 'bold',
                    }}>
                        {account.name}
                    </Typography>
                    <OpenInNewIcon
                        sx={{
                            color: "inherit",
                            fontSize: '1.25rem',
                        }} />
                </Box>
                <Typography variant="body1" style={{
                    color: theme.palette.text.primary,
                }}>
                    {account.email}
                </Typography>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '1rem',
                }}>

                    <Typography variant="body1" style={{
                        color: theme.palette.text.primary,
                    }}>
                        {account.projects.length} projects
                    </Typography>
                    <Typography variant="body1" style={{
                        color: theme.palette.text.primary,
                    }}>
                        {account.following.length} following
                    </Typography>
                </div>


                {/* Demoted to stretch goal 💭 */}
                {/* <Button variant="contained" style={{
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        width: '50%',
                    }}>
                        Invite to project
                    </Button> */}

            </div>)
        })}
    </Scrollbar>)
}

export default FollowingView;
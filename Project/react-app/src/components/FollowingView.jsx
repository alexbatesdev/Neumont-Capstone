import React from "react";
import { Button, Typography, useTheme } from "@mui/material";
import { Scrollbar } from "react-scrollbars-custom";

const FollowingView = ({ following_list }) => {
    const theme = useTheme();

    return (<Scrollbar noScrollX style={{
        flexGrow: 1,
        width: '100%',
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
        {following_list && following_list.map((following, index) => {
            const getAccount = async () => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/by_id/${following}`);
                const data = await response.json();
                return data;
            }
            const account = getAccount();

            return (<div key={index} style={{
                width: '100%',
                height: '50px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'center',
                backgroundColor: theme.palette.background.paper,
            }}>
                <Typography variant="h6" style={{
                    color: theme.palette.text.primary,
                    fontWeight: 'bold',
                    marginLeft: '1rem',
                }}>
                    {account.name}
                </Typography>
                <Typography variant="body1" style={{
                    color: theme.palette.text.primary,
                    marginLeft: '1rem',
                }}>
                    {account.projects.length} projects
                </Typography>
                <div style={{
                    width: 'calc(100% - 2rem)',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 1rem 0 1rem',
                }}>
                    <Button variant="contained" style={{
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        width: '50%',
                    }}>
                        View Profile
                    </Button>
                    <Button variant="contained" style={{
                        backgroundColor: theme.palette.background.default,
                        color: theme.palette.text.primary,
                        width: '50%',
                    }}>
                        Invite to project
                    </Button>
                </div>
            </div>)
        })}
    </Scrollbar>)
}

export default FollowingView;
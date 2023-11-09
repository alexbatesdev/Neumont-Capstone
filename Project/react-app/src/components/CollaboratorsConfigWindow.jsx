import React from 'react';
import { Button, Collapse, Modal, TextField, Typography, useTheme } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AccountCircle, Add } from '@mui/icons-material';
import ProfileMiniAccordion from './ProfileMiniAccordion';
import { Scrollbar } from 'react-scrollbars-custom';
import { useEditorContext, useProjectData } from '@/contexts/editor-context';

const CollaboratorsConfigWindow = ({ collaborators }) => {
    console.log(collaborators)
    const theme = useTheme();
    const router = useRouter();
    const { projectData, setProjectData } = useProjectData();
    const [expanded, setExpanded] = React.useState(false);
    const [addCollaboratorExpanded, setAddCollaboratorExpanded] = React.useState(false);
    const [profileSearchValue, setProfileSearchValue] = React.useState("")
    const [profileSearchResults, setProfileSearchResults] = React.useState([])
    const { hasEditAccess } = useEditorContext();


    const iconStyle = {
        width: '40px',
        height: '40px',
        color: theme.palette.text.primary,
        paddingRight: '10px',
    }

    const handleExpand = () => {
        setExpanded(!expanded);
        setAddCollaboratorExpanded(false)
    }

    const handleOpenAddCollaboratorModal = () => {
        setAddCollaboratorExpanded(!addCollaboratorExpanded)
        setExpanded(false)
    }

    const handleProfileSearchChange = (event) => {
        setProfileSearchValue(event.target.value)
    }

    const handleSearchProfile = async () => {
        let response = await fetch(`${process.env.NEXT_PUBLIC_ACCOUNT_API_URL}/search/${profileSearchValue}`, {
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
        setProfileSearchResults(data.results)
    }

    const handleProfileSearchKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearchProfile()
        }
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
                justifyContent: 'flex-end',
                alignItems: 'center',
                backgroundColor: theme.palette.background.alternate,
            }}>
                <Typography sx={{ pl: "10px", mr: "auto" }}>
                    Collaborators
                </Typography>
                {hasEditAccess &&
                    addCollaboratorExpanded ? <ExpandLessIcon onClick={handleOpenAddCollaboratorModal} sx={{ pr: "10px", height: "40px", width: "40px" }} /> : <Add onClick={handleOpenAddCollaboratorModal} sx={{ pr: "10px", height: "40px", width: "40px" }} />}
                {expanded ? <ExpandLessIcon onClick={handleExpand} sx={iconStyle} /> : <ExpandMoreIcon onClick={handleExpand} sx={iconStyle} />}
            </div>
            <Collapse in={addCollaboratorExpanded} sx={{
                width: "100%",
            }}>
                <div style={{
                    backgroundColor: theme.palette.background.alternateDark,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    width: "calc(100% - 20px)",
                    padding: "10px",
                }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        height: "50px",
                        width: "100%",
                    }}>
                        <TextField sx={{ flexGrow: 1 }} label="Search for Collaborator" variant="outlined" value={profileSearchValue} onChange={handleProfileSearchChange} onKeyDown={handleProfileSearchKeyDown} />
                        <Button sx={{
                            ml: "10px",
                            mt: "10px",
                            alignSelf: "flex-end",
                            height: "100%"
                        }}
                            variant="contained"
                            onClick={handleSearchProfile}
                        >
                            Search
                        </Button>
                    </div>
                    {profileSearchResults && profileSearchResults.map((profile) => {
                        console.log(profile)
                        if (profile.account_id == projectData.project_owner) {
                            return
                        }
                        return <ProfileMiniAccordion profile_id={profile.account_id} showAddCollaborator={hasEditAccess} />
                    })}
                </div>
            </Collapse>
            <Collapse in={expanded} sx={{ width: "100%" }}>
                {collaborators.length == 0 && <Typography sx={{ width: "calc(100% - 20px)", padding: "10px" }}>
                    No collaborators
                </Typography>}
                {collaborators.map((collaborator, index) => {
                    return <ProfileMiniAccordion profile_id={collaborator} showRemoveCollaborator={hasEditAccess} />
                })}
            </Collapse>
        </div>
    </>);
};

export default CollaboratorsConfigWindow;

import React from 'react';

import { Button, Stack, Switch, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useProjectData } from '@/contexts/editor-context';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { outlinedInputClasses } from '@mui/material/OutlinedInput';
import { useSession } from 'next-auth/react';


const possiblyEmptyValue = (value, valueIfNotFound) => {
    if (value == null || value == "") {
        return valueIfNotFound;
    }
    return value;
}

const ProjectConfig = () => {
    const theme = useTheme();
    const session = useSession();
    const { projectData, setProjectData } = useProjectData();

    if (!projectData) {
        return (
            <Typography sx={{ pl: "10px" }}>
                Loading...
            </Typography>
        )
    }

    const outerWrapperStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        overflow: "hidden",
    }

    const topBannerStyle = {
        width: 'calc(100% - 10px)',
        height: '50px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: theme.palette.background.default,
        borderBottom: '1px solid ' + theme.palette.divider,
        paddingLeft: '10px',
        paddingRight: '10px',
    }

    const innerWrapperStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        overflow: "hidden",
        paddingLeft: '10px',
        paddingTop: '10px',
        gap: '15px',
    }

    const topBannerText = "Project Config"

    const projectID = projectData.project_id;
    const projectOwner = projectData.project_owner;
    const [newProjectName, setNewProjectName] = React.useState("");
    const [newProjectDescription, setNewProjectDescription] = React.useState("");

    const [newIsTemplate, setNewIsTemplate] = React.useState(projectData.is_template);
    const [newIsPrivate, setNewIsPrivate] = React.useState(projectData.is_private);
    const [newCollaborators, setNewCollaborators] = React.useState(projectData.collaborators);

    //Make API call to get project owner data and collaborators data
    //No need to get project owner data if project owner is the current user

    const formStyle = {
        width: 'calc(100% - 20px)'
    }

    const handleSaveChanges = () => {
        setProjectData((prevData) => {
            const output = {
                ...prevData,
                project_name: newProjectName,
                project_description: newProjectDescription,
                is_template: newIsTemplate,
                is_private: newIsPrivate,
                collaborators: newCollaborators,
            }
            console.log(output);
            saveData(output);
            return output;
        })
        const saveData = async (data) => {
            await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL}/by_id/${projectID}/projectData`, {
                method: 'PATCH',
                headers: {
                    "content-type": "application/json",
                    "Authorization": `Bearer ${session.data.token}`,
                },
                body: JSON.stringify(data),
            }).then((response) => {
                console.log(response);
                // if (response.ok) // Create a toast 💭🍞
                return response.json();
            }).then((data) => {
                console.log(data);
            }).catch((error) => {
                console.log(error);
                alert("oops")
            })
        }
    }




    return (<>
        <div style={outerWrapperStyle}>
            <div style={topBannerStyle}>
                <Typography>
                    {topBannerText}
                </Typography>
            </div>
            <div style={innerWrapperStyle}>
                <Typography variant='body1'>
                    Project Name:
                </Typography>

                <TextField
                    color="secondary"
                    id="outlined-basic"
                    label={possiblyEmptyValue(projectData.project_name, "Untitled Project")}
                    variant="filled"
                    size='small'
                    value={newProjectName}
                    sx={formStyle}
                    onChange={(e) => { setNewProjectName(e.target.value) }}
                />
                <Typography variant='subtitle2'>
                    Project Description:
                </Typography>
                <TextField
                    color="secondary"
                    id="outlined-basic"
                    label={possiblyEmptyValue(projectData.project_description, "No description")}
                    variant="filled"
                    size='small'
                    multiline
                    rows={3}
                    value={newProjectDescription}
                    sx={formStyle}
                    onChange={(e) => { setNewProjectDescription(e.target.value) }}
                />


                <Typography variant='subtitle2'>
                    Project Owner:
                </Typography>

                {/* Some sort of display signifying the project owner */}

                <Typography variant='subtitle2'>
                    Collaborators:
                </Typography>

                {/* Some sort of display that shows a list of the collaborators */}
                {/* Both of these components should use the same profile component, this second one is just a list */}
                {/* Maybe they are both the exact same component */}


                <Stack direction="row" spacing={1} alignItems="center" gap={"25px"}>
                    <div>

                        <Typography variant='subtitle2'>
                            Template Project:
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Switch
                                color="primary"
                                checked={newIsTemplate}
                                onChange={(e) => { setNewIsTemplate(e.target.checked) }}
                            />
                            <Typography variant="body1" sx={{}}>
                                {newIsTemplate ? "Yes" : "No"}
                            </Typography>
                        </Stack>
                    </div>

                    <div>

                        <Typography variant='subtitle2'>
                            Private Project:
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Switch
                                color="primary"
                                checked={newIsPrivate}
                                onChange={(e) => { setNewIsPrivate(e.target.checked) }}
                            />
                            <Typography variant="body1" sx={{}}>
                                {newIsPrivate ? "Yes" : "No"}
                            </Typography>
                        </Stack>
                    </div>
                </Stack>
                <Button variant="outlined" color="primary" sx={{ borderRadius: "5px" }} onClick={handleSaveChanges}>
                    Save Changes
                </Button>
            </div>
        </div>
    </>)

}

export default ProjectConfig;
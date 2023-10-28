import { Stack, Switch, ToggleButton, useTheme } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Card, Box, Typography, TextField, Button, FormControlLabel, Checkbox, Collapse, IconButton } from '@mui/material';
import { Scrollbar } from 'react-scrollbars-custom';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

const NewProjectForm = ({ setModalOpen }) => {
    const theme = useTheme();
    const session = useSession();
    const router = useRouter();

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [expandedDescription, setExpandedDescription] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [templates, setTemplates] = useState();
    const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(null);

    useEffect(() => {
        const getTemplates = async () => {
            const response = await fetch(process.env.NEXT_PUBLIC_PROJECT_API_URL + "/all/templates", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.data.token}`,
                },
            });
            const data = await response.json();
            console.log(data);
            setTemplates(data);
        }
        getTemplates();
    }, []);

    const listItemStyle = (i) => {
        return {
            width: "100%",
            fontSize: "20px",
            padding: "5px 0",
            paddingLeft: "0.5rem",
            backgroundColor: (i == hoveredIndex || i == selectedTemplateIndex) ? theme.palette.background.paper : (i % 2 == 0) ? theme.palette.background.default : "None",
            userSelect: "none",
        }
    }

    const handleCreateProject = (event) => {
        setIsSubmitting(true);
        setSubmitError(null);

        // let url = (process.env.NEXT_PUBLIC_PROJECT_API_URL + "/new") + ((selectedTemplateIndex == 0 || selectedTemplateIndex == null) ? "" : ("/template/" + templates[selectedTemplateIndex].toLowerCase()));
        // I wrote ^^this^^ line myself, then I asked GPT to make it more readable. 
        const baseUrl = process.env.NEXT_PUBLIC_PROJECT_API_URL;
        const templatePart = selectedTemplateIndex === -1 || selectedTemplateIndex == null
            ? ""
            : `/from_template/${templates[selectedTemplateIndex].project_id.toLowerCase()}`;

        let url = `${baseUrl}/new${templatePart}`;

        const response = fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.data.token}`,
            },
            body: JSON.stringify({
                project_name: projectName,
                project_description: projectDescription,
                is_private: isPrivate,
            }),
        }).then((response) => {
            return response.json();
        }).then((data) => {
            console.log(data);
            if (data.error) {
                setSubmitError(data.error);
            } else {
                router.push("/editor/" + data.project_id)
            }
        }
        ).catch((error) => {
            console.log(error);
            setSubmitError(error);
        })
    }

    return (
        <Card sx={{
            width: "500px",
            height: "600px",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
            border: "2px solid " + theme.palette.dragBar.default,
            position: "relative",
        }}>
            <Typography variant="h4" sx={{ textAlign: "center" }}>
                Create a New Project
            </Typography>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                gap: "1rem",
                marginTop: "1rem",
            }}>
                <TextField
                    color='secondary'
                    sx={{ flexGrow: 1 }}
                    id="project-name"
                    label="Project Name"
                    variant="outlined"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    required
                />
                {/* Returning the commented out bits will make the description hidden by default */}
                <Button
                    sx={{ height: "56px", width: "150px", alignSelf: "flex-end" }}
                    variant="outlined"
                    color="secondary"
                    onClick={() => setExpandedDescription(!expandedDescription)}
                >
                    {expandedDescription ? "Remove" : "Add"} Description
                </Button>
            </Box>
            <Collapse sx={{ width: "100%" }} in={expandedDescription}>
                <TextField
                    color='secondary'
                    sx={{ width: "100%", marginTop: "1rem" }}
                    id="project-description"
                    label="Project Description"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                />
            </Collapse>
            <>
                <Box sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    gap: "1rem",
                    marginTop: "1rem",
                    height: "250px",
                    flexGrow: 1,
                }}
                >   {/* I want to change all scrollbars to use this 💭 */}
                    <Scrollbar
                        noScrollX
                        style={{
                            flexGrow: 1,
                            border: "1px solid " + theme.palette.dragBar.default,
                            borderRadius: "5px",
                        }}>
                        <Stack sx={{
                            height: "calc(100% - 0.5rem)",
                            width: "100%",
                            paddingLeft: 0,
                        }}>
                            <Typography
                                key={-1}
                                variant="body2"
                                onClick={() => { setSelectedTemplateIndex(-1) }}
                                onMouseEnter={() => { setHoveredIndex(-1) }}
                                onMouseLeave={() => { setHoveredIndex(null) }}
                                sx={listItemStyle(-1)}
                            >
                                None
                            </Typography>
                            {
                                templates && templates.map((template, i) => (
                                    <Typography
                                        key={i}
                                        variant="body2"
                                        onClick={() => { setSelectedTemplateIndex(i) }}
                                        onMouseEnter={() => { setHoveredIndex(i) }}
                                        onMouseLeave={() => { setHoveredIndex(null) }}
                                        sx={listItemStyle(i)}
                                    >
                                        {template.project_name}
                                    </Typography>
                                ))
                            }
                        </Stack>
                    </Scrollbar>
                    <Box sx={{
                        width: "calc(100% - 3rem)",
                        backgroundColor: theme.palette.background.default,
                        height: "100%",
                        overflow: "auto",
                        borderRadius: "5px",
                        border: "1px solid " + theme.palette.dragBar.default,
                    }}></Box>
                </Box>
            </>
            <Box sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "calc(100%)",
                // marginBottom: "1rem",
                // position: "absolute",
                // bottom: 0,
            }} >

                <Stack direction="row" spacing={1} alignItems="center" sx={{ marginTop: "1rem" }}>
                    <Typography variant="body1" sx={{}}>
                        Public
                    </Typography>
                    <Switch
                        color="secondary"
                        checked={isPrivate}
                        onChange={(e) => setIsPrivate(e.target.checked)}
                    />
                    <Typography variant="body1" sx={{}}>
                        Private
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={"1rem"} alignItems="center" sx={{ marginTop: "1rem" }}>
                    <Button
                        sx={{ width: "80px", alignSelf: "flex-end", marginTop: "1rem" }}
                        variant="contained"
                        color="error"
                        onClick={() => { setModalOpen(false) }}
                    >
                        Cancel
                    </Button>
                    <Button
                        sx={{ width: "175px", alignSelf: "flex-end", marginTop: "1rem" }}
                        variant="contained"
                        color="secondary"
                        onClick={handleCreateProject}
                    >
                        Create Project
                    </Button>
                </Stack>
            </Box>
        </Card >
    );
};

export default NewProjectForm;
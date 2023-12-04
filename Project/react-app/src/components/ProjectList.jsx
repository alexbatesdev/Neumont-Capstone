import React, { useEffect } from "react";

import { Button, Typography, useTheme, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Box } from '@mui/material'

import moment, { utc } from "moment/moment";
import NewProjectForm from "./NewProjectForm";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import CreateProjectBar from '@/components/CreateProjectBar'
import { Scrollbar } from "react-scrollbars-custom";

import AltRouteIcon from '@mui/icons-material/AltRoute';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import AddIcon from '@mui/icons-material/Add';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';


function formatDate(datetimeString) {
    const formattedDate = moment.utc(datetimeString).local().format("MM/DD/YYYY - h:mm a");
    return formattedDate;
}

// Written by an AI assistant
// But it didn't work so I fixed it

const timeAgo = (datetimeString) => {
    const formattedDate = moment.utc(datetimeString).local().format("YYYY-MM-DD HH:mm:ss");
    const date = new Date(formattedDate);

    // Calculate the difference in milliseconds
    const now = new Date();
    const diffMs = now - date;

    // Convert the difference to various units
    const diffMins = diffMs / (1000 * 60);
    const diffHours = diffMins / 60;
    const diffDays = diffHours / 24;
    const diffWeeks = diffDays / 7;
    const diffMonths = diffDays / 30; // Approximation
    const diffYears = diffDays / 365; // Approximation

    // Determine the appropriate unit and return the string
    if (diffYears >= 1) {
        return `${Math.floor(diffYears)} year${Math.floor(diffYears) == 1 ? "" : "s"} ago`;
    } else if (diffMonths >= 1) {
        return `${Math.floor(diffMonths)} month${Math.floor(diffMonths) == 1 ? "" : "s"} ago`;
    } else if (diffWeeks >= 1) {
        return `${Math.floor(diffWeeks)} week${Math.floor(diffWeeks) == 1 ? "" : "s"} ago`;
    } else if (diffDays >= 1) {
        return `${Math.floor(diffDays)} day${Math.floor(diffDays) == 1 ? "" : "s"} ago`;
    } else if (diffHours >= 1) {
        return `${Math.floor(diffHours)} hour${Math.floor(diffHours) == 1 ? "" : "s"} ago`;
    } else if (diffMins >= 1) {
        return `${Math.floor(diffMins)} minute${Math.floor(diffMins) == 1 ? "" : "s"} ago`;
    } else {
        return `${Math.floor(diffMs / 1000)} second${Math.floor(diffMs / 1000) == 1 ? "" : "s"} ago`;
    }
}


const ProjectList = ({ projects, setProjects, viewOnly = false }) => {
    const theme = useTheme();
    const session = useSession();
    const [modalOpen, setModalOpen] = React.useState(null);
    const [deleteTarget, setDeleteTarget] = React.useState(null);
    const [hoverIndex, setHoverIndex] = React.useState(-1);
    const [newProjectFormOpen, setNewProjectFormOpen] = React.useState(false);
    const [selectedTemplateID, setSelectedTemplateID] = React.useState(0);

    const handleFork = async (project) => {
        const body = {
            "project_name": `${project.project_name} (forked)`,
            "project_description": project.project_description,
            "is_private": project.is_private,
            "is_template": project.is_template,
            "start_command": project.start_command,
        }

        const response = await fetch(`/api/proxy?url=${process.env.NEXT_PUBLIC_PROJECT_API_URL}/fork/${project.project_id}`, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Authorization": `Bearer ${session.data.token}`,
                "content-type": "application/json",
            }
        }).then((data) => {
            if (data.status === 200) {
                return data.json()
            } else {
                toast.error("Error forking project. Refresh the page to try again.")
            }
        }).catch(err => {
            toast.error("Error forking project. Refresh the page to try again.")
        })
        window.location.href = `/editor/${response.project_id}`

    }

    const handleDelete = async () => {
        await fetch(`/api/proxy?url=${process.env.NEXT_PUBLIC_PROJECT_API_URL}/by_id/${deleteTarget.project_id}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${session.data.token}`,
                "content-type": "application/json",
            }
        }).then((data) => {
            if (data.status === 200) {
                setProjects(projects.filter(project => project.project_id !== deleteTarget.project_id))
                setDeleteTarget(null);
            } else {
                toast.error("Error deleting project. Refresh the page to try again.")
            }
        }).catch(err => {
            toast.error("Error deleting project. Refresh the page to try again.")
        })
    }

    return (<>
        {!viewOnly && <CreateProjectBar setSelectedTemplate={setSelectedTemplateID} setNewProjectFormOpen={setNewProjectFormOpen} />}
        {projects && projects.map((project, index) => {
            return (
                <div
                    key={"Project-" + project.project_id + "-" + index}
                    style={{
                        width: "calc(100% - 2rem)",
                        height: "100px",
                        backgroundColor: hoverIndex == index ? (project.is_private ? theme.palette.background.alternate : theme.palette.background.paperLight) : (project.is_private ? theme.palette.background.alternateDark : theme.palette.background.paper),
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        padding: "0.5rem 1rem 0.5rem 1rem",
                        position: "relative",
                    }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        height: "50%",
                        width: "100%",
                        overflow: "hidden",
                        gap: "1rem",
                    }}>
                        <Typography variant="h5"
                            onClick={() => window.location.href = `/editor/${project.project_id}` + ((project.is_private) ? "?private=true" : "")}
                            sx={{
                                maxWidth: "64%",
                                "&:hover": {
                                    cursor: "pointer",
                                    color: theme.palette.secondary.main,
                                    textDecoration: "underline",
                                },
                                // transition: "0.2s ease-in-out",
                            }}>{project.project_name}</Typography>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}>
                            {project.is_private ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            <Typography variant="body1">{project.is_private ? "Private" : "Public"}</Typography>
                        </div>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            gap: "0.5rem",
                        }}>
                            <AltRouteIcon />
                            <Typography variant="body1">{project.forks.length}</Typography>
                        </div>
                        {project.is_template && <Typography variant="body1" sx={{
                            color: "#5893ff",
                            border: "1px solid #5893ff",
                            borderRadius: "15px",
                            padding: "1px 8px",
                        }}>Template</Typography>}
                        {project.project_owner != session.data.user.account_id && <PeopleAltIcon color="secondary" />}
                    </div>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        height: "100%",
                        width: "100%",
                        overflow: "hidden",
                        gap: "1rem",
                    }}>
                        <Scrollbar noScrollX style={{
                            width: "400px"
                        }}>
                            <Typography variant="caption" sx={{
                                flexGrow: 1,
                            }}>{project.project_description}</Typography>
                        </Scrollbar>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            width: "100%",
                            height: "50%",
                            gap: "1rem",
                        }}>
                            <div style={{
                                height: "50%",
                                display: "flex",
                                flexDirection: "column",

                            }}>
                                <Typography variant="body1">Last Updated:</Typography>
                                <Typography variant="caption">{formatDate(project.last_modified_date)}</Typography>
                                <Typography variant="caption">({timeAgo(project.last_modified_date)})</Typography>
                            </div>
                            <div style={{
                                height: "50%",
                                display: "flex",
                                flexDirection: "column",
                            }}>
                                <Typography variant="body1">Created:</Typography>
                                <Typography variant="caption">{formatDate(project.creation_date)}</Typography>
                            </div>
                        </div>
                    </div>
                    {modalOpen == project.project_id && <div style={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "2rem",
                        minWidth: "125px",
                        // border: "3px solid " + theme.palette.utilBar.icons,
                        backgroundColor: (project.is_private ? theme.palette.background.alternateDark : theme.palette.background.paper),
                        // borderRadius: "5px",
                        zIndex: 5,
                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
                    }}>
                        <Typography variant="body1" sx={{
                            padding: "0.5rem 1rem",
                            "&:hover": {
                                cursor: "pointer",
                                color: theme.palette.secondary.main,
                                filter: "brightness(1.5)",
                            },
                            transition: "color 0.2s ease-in-out",
                            backgroundColor: "inherit",
                        }} onClick={(e) => {
                            e.stopPropagation();
                            setModalOpen(null);
                            window.location.href = `/editor/${project.project_id}` + ((project.is_private) ? "?private=true" : "");
                        }}>Open</Typography>
                        <Typography variant="body1" sx={{
                            padding: "0.5rem 1rem",
                            "&:hover": {
                                cursor: "pointer",
                                color: theme.palette.secondary.main,
                                filter: "brightness(1.5)"
                            },
                            transition: "color 0.2s ease-in-out",
                            backgroundColor: "inherit"
                        }} onClick={(e) => {
                            e.stopPropagation();
                            setModalOpen(null);
                            navigator.clipboard.writeText(process.env.NEXT_PUBLIC_FRONTEND_BASE_URL + "/editor/" + project.project_id + (project.is_private ? "?private=true" : ""));
                            toast.success("Copied link to clipboard!");
                        }}>Share</Typography>
                        {session.status == "authenticated" &&
                            <Typography variant="body1" sx={{
                                padding: "0.5rem 1rem",
                                "&:hover": {
                                    cursor: "pointer",
                                    color: theme.palette.secondary.main,
                                    filter: "brightness(1.5)"
                                },
                                transition: "color 0.2s ease-in-out",
                                backgroundColor: "inherit"
                            }} onClick={(e) => {
                                e.stopPropagation();
                                setModalOpen(null);
                                handleFork(project);
                            }}>Fork</Typography>
                        }
                        {!viewOnly &&
                            <Typography variant="body1" sx={{
                                padding: "0.5rem 1rem",
                                "&:hover": {
                                    cursor: "pointer",
                                    color: theme.palette.secondary.main,
                                    filter: "brightness(1.5)"
                                },
                                color: theme.palette.error.main,
                                transition: "color 0.2s ease-in-out",
                                backgroundColor: "inherit"
                            }} onClick={(e) => {
                                e.stopPropagation();
                                setModalOpen(null);
                                setDeleteTarget(project);
                            }}>Delete</Typography>
                        }
                    </div>}
                    <MoreHorizIcon
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log(project.project_id)
                            if (modalOpen == project.project_id) {
                                setModalOpen(null);
                                document.removeEventListener("click", (event) => {
                                    setModalOpen(null);
                                }, { once: true })
                            } else {
                                setModalOpen(project.project_id);
                                document.addEventListener("click", (event) => {
                                    setModalOpen(null);
                                }, { once: true })
                            }
                        }}
                        sx={{
                            position: "absolute",
                            top: "0.5rem",
                            right: "0.5rem",
                            color: theme.palette.text.primary,
                            "&:hover": {
                                cursor: "pointer",
                                color: theme.palette.secondary.main,
                            },
                            transition: "color 0.2s ease-in-out",
                        }} />
                </div>
            )
        })}
        {deleteTarget && <>
            {/* Copilot snippet, I might make this prettier, but for now it does the job, also I added the methods that actually do things, only the layout is copilot */}
            <Modal open={deleteTarget} onClose={() => setModalOpen(false)}>
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
                        // height: "250px"
                    }}>
                        <Typography variant="body1">Are you sure you want to delete {deleteTarget.project_name}?</Typography>
                        <div style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "1rem",
                            width: "100%"
                        }}>
                            <Button variant="contained" color="error" sx={{
                                width: "25%"
                            }} onClick={handleDelete}>Delete</Button>
                            <Button variant="contained" color="tertiary" sx={{
                                width: "75%"
                            }} onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        </div>
                    </Card>
                </div>
            </Modal>
            {/* Copilot snippet over, also it was my idea to use a mui Modal, I just didn't want to think about styling right now. Weird tense changes, but that's how it be with cross-time messages. Aren't all messages cross time? */}
        </>}
        {newProjectFormOpen != false && <>
            <Modal open={newProjectFormOpen} onClose={() => setNewProjectFormOpen(false)}>
                <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}>
                    <NewProjectForm setModalOpen={setNewProjectFormOpen} initialTemplateID={selectedTemplateID} />
                </div>
            </Modal>
        </>}
        {!viewOnly &&
            <Box
                onClick={() => setNewProjectFormOpen(true)}
                sx={{
                    position: "fixed",
                    bottom: "1rem",
                    right: "1rem",
                    backgroundColor: theme.palette.secondary.main,
                    borderRadius: "50%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "80px",
                    aspectRatio: "1/1",
                    "&:hover": {
                        cursor: "pointer",
                        backgroundColor: theme.palette.secondary.dark,
                    },
                }}>
                <AddIcon sx={{
                    color: "black",
                    fontSize: "3rem",
                }} />
            </Box>
        }
    </>);
}

export default ProjectList;
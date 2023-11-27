import React, { useEffect } from "react";

import { Button, Typography, useTheme, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Box } from '@mui/material'

import moment, { utc } from "moment/moment";
import Link from "next/link";
import NewProjectForm from "./NewProjectForm";
import { useSession } from "next-auth/react";
import ShareIcon from '@mui/icons-material/Share';
import { toast } from "react-toastify";

import CreateProjectBar from '@/components/CreateProjectBar'
import { Scrollbar } from "react-scrollbars-custom";

import AltRouteIcon from '@mui/icons-material/AltRoute';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';


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
    const [modalOpen, setModalOpen] = React.useState(false);
    const [hoverIndex, setHoverIndex] = React.useState(-1);

    return (<>
        {!viewOnly && <CreateProjectBar />}
        {projects && projects.map((project, index) => {
            return (
                <div
                    key={"Project-" + project.id + "-" + index}
                    onMouseEnter={() => setHoverIndex(index)}
                    onMouseLeave={() => setHoverIndex(-1)}
                    onClick={() => window.location.href = `/editor/${project.project_id}` + ((project.is_private) ? "?private=true" : "")}
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
                        <Typography variant="h5" sx={{
                            maxWidth: "64%",
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
                        {project.is_template && <Typography variant="body1" color="secondary.main">Template</Typography>}
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
                            width: "50%"
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
                    <MoreHorizIcon sx={{
                        position: "absolute",
                        top: "0.5rem",
                        right: "0.5rem",
                        color: theme.palette.text.primary,
                        "&:hover": {
                            color: theme.palette.primary.main,
                            cursor: "pointer",
                        },
                        transition: "color 0.1s ease-in-out",
                    }} />
                </div>
            )
        })}
    </>)

    // project.is_private ? theme.palette.background.default : theme.palette.background.paper
    return (<>
        <TableContainer component={Box} sx={{
            width: "90%",
            overflow: "auto",
            backgroundColor: theme.palette.background.paper,
            // borderRadius: "7px",
            marginBottom: "1rem",
        }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell color="primary">Project Name</TableCell>
                        <TableCell color="primary" align="right">Last Updated</TableCell>
                        <TableCell color="primary" align="right">Created</TableCell>
                        <TableCell color="primary" align="center">
                            {!viewOnly && <>
                                <Button variant="contained" color="tertiary" onClick={() => setModalOpen(true)}>Create Project</Button>
                                <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                                    <div style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                    }}>
                                        <NewProjectForm setModalOpen={setModalOpen} />
                                    </div>
                                </Modal>
                            </>
                            }
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects && projects.map((project) => (
                        <TableRow
                            key={project.id}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                backgroundColor: project.is_private ? theme.palette.background.default : theme.palette.background.paper,
                            }}
                        >
                            <TableCell component="th" scope="row">
                                {project.project_name}
                            </TableCell>
                            <TableCell align="right">
                                {formatDate(project.last_modified_date)}
                            </TableCell>
                            <TableCell align="right">
                                {formatDate(project.creation_date)}
                            </TableCell>
                            <TableCell align="right" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly", alignItems: "center" }}>
                                <Button variant="contained" color="primary" sx={{ color: theme.palette.text.primary }} onClick={() => window.location.href = `/editor/${project.project_id}`}>Open</Button>
                                <ShareIcon
                                    onClick={() => {
                                        navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/editor/${project.project_id}`)
                                        toast.success("Copied link to clipboard")
                                    }}
                                    sx={{
                                        "&:hover": {
                                            color: theme.palette.primary.main,
                                            cursor: "pointer",
                                        },
                                        transition: "color 0.1s ease-in-out",
                                    }} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>)
}

export default ProjectList;
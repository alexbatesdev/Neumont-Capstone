import React, { useEffect } from "react";

import { Button, Typography, useTheme, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal, Box } from '@mui/material'

import moment from "moment/moment";
import Link from "next/link";
import NewProjectForm from "./NewProjectForm";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import ShareIcon from '@mui/icons-material/Share';



function formatDate(datetimeString) {
    const formattedDate = moment.utc(datetimeString).local().format("MMMM Do YYYY, h:mm:ss a");
    return formattedDate;
}

const ProjectList = () => {
    const theme = useTheme();
    const [modalOpen, setModalOpen] = React.useState(false);

    const session = useSession()
    const router = useRouter()

    const [projects, setProjects] = React.useState([])

    useEffect(() => {
        if (session.data) {
            const getProjects = async () => {
                const response = await fetch(`${process.env.NEXT_PUBLIC_PROJECT_API_URL}/by_owner/${session.data.user.account_id}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${session.data.token}`
                    }
                })
                const data = await response.json()
                console.log(data)
                setProjects([].concat(data, data))
            }
            getProjects()
        }
        if (session.status === 'unauthenticated') {
            router.push('/')
        }
    }, [session])

    const getBGColor = (project) => {
        // Private and template
        // Private and not template
        // Private and shared with me
        // Public and template
        // Public and not template
        // Public and shared with me

        if (project.is_private && project.is_template) {
            return theme.palette.background.alternateDark
        } else if (project.is_private && project.collaborators.includes(session.data.user.account_id)) {
            return theme.palette.background.paper
        } else if (project.is_private) {
            return theme.palette.background.default
        } else if (project.is_template) {
            return theme.palette.background.alternate
        } else if (project.collaborators.includes(session.data.user.account_id)) {
            return theme.palette.background.paperLight
        } else {
            return theme.palette.background.paper
        }

    }
    // project.is_private ? theme.palette.background.default : theme.palette.background.paper
    return (<>
        <TableContainer component={Box} sx={{
            width: "90%",
            overflow: "auto",
            backgroundColor: theme.palette.background.paper,
            borderRadius: "7px",
            marginBottom: "1rem",
        }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell color="primary">Project Name</TableCell>
                        <TableCell color="primary" align="right">Last Updated</TableCell>
                        <TableCell color="primary" align="right">Created</TableCell>
                        <TableCell color="primary" align="center">
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
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {projects && projects.map((project) => (
                        <TableRow
                            key={project.id}
                            sx={{
                                '&:last-child td, &:last-child th': { border: 0 },
                                backgroundColor: getBGColor(project),
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
                                    onClick={() => navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONTEND_BASE_URL}/editor/${project.project_id}`)}
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
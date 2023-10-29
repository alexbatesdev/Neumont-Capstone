import React from "react";

import { Button, Typography, useTheme, Card, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Modal } from '@mui/material'

import moment from "moment/moment";
import Link from "next/link";
import NewProjectForm from "./NewProjectForm";




function formatDate(datetimeString) {
    const formattedDate = moment.utc(datetimeString).local().format("MMMM Do YYYY, h:mm:ss a");
    return formattedDate;
}

const ProjectList = ({ projects }) => {
    const theme = useTheme();
    const [modalOpen, setModalOpen] = React.useState(false);

    return (<>
        <TableContainer component={Card} sx={{ width: "80%", marginTop: "1rem" }}>
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
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: project.is_private ? theme.palette.background.paper : "None" }}
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
                            <TableCell align="right" sx={{ display: "flex", flexDirection: "row", justifyContent: "space-evenly" }}>
                                {/* Edit needs a popup 💭 */}
                                <Button variant="contained" color="secondary">Share</Button>
                                <Link href={`/editor/${project.project_id}`}>
                                    <Button variant="contained" color="primary" sx={{ color: theme.palette.text.primary }}>Open</Button>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </>)
}

export default ProjectList;
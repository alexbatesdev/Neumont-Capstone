import React from "react";
import { Typography, useTheme } from "@mui/material";
import DashboardTemplateButton from "./DashboardTemplateButton";
import { Scrollbar } from "react-scrollbars-custom";

const CreateProjectBar = ({ setSelectedTemplate, setNewProjectFormOpen }) => {
    const theme = useTheme();

    return (
        <div
            style={{
                width: "calc(100% - 2rem)",
                backgroundColor: theme.palette.background.paper,
                padding: "0.5rem 1rem",
            }}
        >
            <Typography variant="h6" sx={{ mb: 1 }}>Jump into your next project</Typography>
            <Scrollbar
                noScrollY
                style={{
                    width: '100%',
                    height: "80px",
                }}
            >

                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                }}>
                    <DashboardTemplateButton
                        text="Node.js (empty)"
                        iconDivBackgroundImage='url("/nodejs-icon.png")'
                        onClick={() => {
                            setSelectedTemplate(process.env.NEXT_PUBLIC_CURRENT_TEMPLATE_ID_EMPTY);
                            setNewProjectFormOpen(true);
                        }}
                    />
                    <DashboardTemplateButton
                        text="Basic Web"
                        iconDivBackgroundImage={`url('${process.env.NEXT_PUBLIC_IMG_PROXY}https://logos-download.com/wp-content/uploads/2017/07/HTML5_badge.png')`}
                    />
                    <DashboardTemplateButton
                        text="React"
                        iconDivBackgroundImage={`url('${process.env.NEXT_PUBLIC_IMG_PROXY}https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg')`}
                        onClick={() => {
                            setSelectedTemplate(process.env.NEXT_PUBLIC_CURRENT_TEMPLATE_ID_REACT);
                            setNewProjectFormOpen(true);
                        }}
                    />
                    <DashboardTemplateButton
                        text="Next.js"
                        iconDivBackgroundImage={`url('${process.env.NEXT_PUBLIC_IMG_PROXY}https://seekicon.com/free-icon-download/next-js_1.svg')`}
                        onClick={() => {
                            setSelectedTemplate(process.env.NEXT_PUBLIC_CURRENT_TEMPLATE_ID_NEXT);
                            setNewProjectFormOpen(true);
                        }}
                        customButtonIconStyle={{
                            backgroundColor: "white",
                            borderRadius: '50%',
                            outline: "solid 3px black",
                            outlineOffset: "-2px",
                        }} />
                    <DashboardTemplateButton
                        text="Vue"
                        iconDivBackgroundImage={`url('${process.env.NEXT_PUBLIC_IMG_PROXY}https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg')`}
                    />
                    <DashboardTemplateButton
                        text="Angular"
                        iconDivBackgroundImage={`url('${process.env.NEXT_PUBLIC_IMG_PROXY}https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg')`}
                    />
                    <DashboardTemplateButton
                        text="Svelte"
                        iconDivBackgroundImage={`url('${process.env.NEXT_PUBLIC_IMG_PROXY}https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg')`}
                    />
                </div>
            </Scrollbar>
        </div>
    );
};

export default CreateProjectBar;
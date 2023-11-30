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
                            setSelectedTemplate(0);
                            setNewProjectFormOpen(true);
                        }}
                    />
                    <DashboardTemplateButton
                        text="Express"
                        iconDivBackgroundImage={`url("/transparent_express_js_icon.png")`}
                        onClick={() => {
                            setSelectedTemplate(1);
                            setNewProjectFormOpen(true);
                        }}
                    />
                    <DashboardTemplateButton
                        text="Basic Web"
                        iconDivBackgroundImage={`url('${process.env.NEXT_PUBLIC_IMG_PROXY}https://logos-download.com/wp-content/uploads/2017/07/HTML5_badge.png')`}
                        onClick={() => {
                            setSelectedTemplate(2);
                            setNewProjectFormOpen(true);
                        }}
                    />
                    <DashboardTemplateButton
                        text="React"
                        iconDivBackgroundImage={`url('${process.env.NEXT_PUBLIC_IMG_PROXY}https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg')`}
                        onClick={() => {
                            setSelectedTemplate(3);
                            setNewProjectFormOpen(true);
                        }}
                    />
                    <DashboardTemplateButton
                        text="Next.js"
                        iconDivBackgroundImage={`url('${process.env.NEXT_PUBLIC_IMG_PROXY}https://seekicon.com/free-icon-download/next-js_1.svg')`}
                        onClick={() => {
                            setSelectedTemplate(4);
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
                        onClick={() => {
                            setSelectedTemplate(5);
                            setNewProjectFormOpen(true);
                        }}
                    />
                    <DashboardTemplateButton
                        text="Angular"
                        iconDivBackgroundImage={`url('${process.env.NEXT_PUBLIC_IMG_PROXY}https://upload.wikimedia.org/wikipedia/commons/c/cf/Angular_full_color_logo.svg')`}
                        onClick={() => {
                            setSelectedTemplate(6);
                            setNewProjectFormOpen(true);
                        }}
                    />
                    <DashboardTemplateButton
                        text="Svelte"
                        iconDivBackgroundImage={`url('${process.env.NEXT_PUBLIC_IMG_PROXY}https://upload.wikimedia.org/wikipedia/commons/1/1b/Svelte_Logo.svg')`}
                        onClick={() => {
                            setSelectedTemplate(7);
                            setNewProjectFormOpen(true);
                        }}
                    />
                </div>
            </Scrollbar>
        </div>
    );
};

export default CreateProjectBar;
// Written by AI assistant
import React from 'react';
import LoadingDisplay from './PreviewLoading';
import { ThemeProvider } from '@mui/material/styles';
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { theme } from "../thatOneStuffFolderUsuallyCalledUtils/themes";
import "../reset.css"

export default {
    title: 'Components/LoadingDisplay',
    component: LoadingDisplay,
    decorators: [
        withThemeFromJSXProvider({
            themes: {
                dark: theme,
            },
            defaultTheme: "dark",
            Provider: ThemeProvider,
        }),
    ]
};

const LoadingTemplate = (args) => {
    return (
        <ThemeProvider theme={theme}>
            <LoadingDisplay {...args} />
        </ThemeProvider>
    );
};

export const Default = LoadingTemplate.bind({});
Default.args = {
    webContainerStatus: 0,
    fun: false,
};

export const InstallingDependencies = LoadingTemplate.bind({});
InstallingDependencies.args = {
    webContainerStatus: 1,
    fun: false,
};

export const StartingServer = LoadingTemplate.bind({});
StartingServer.args = {
    webContainerStatus: 2,
    fun: false,
};

export const FunMode = LoadingTemplate.bind({});
FunMode.args = {
    webContainerStatus: 0,
    fun: true,
};
// End of code written by AI assistant

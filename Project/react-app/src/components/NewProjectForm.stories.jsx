import React from 'react';
import { theme } from '../thatOneStuffFolderUsuallyCalledUtils/themes';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { ThemeProvider } from '@mui/material';
import NewProjectForm from './NewProjectForm';
import '../reset.css';

export default {
    title: 'Components/NewProjectForm',
    component: NewProjectForm,
    decorators: [
        withThemeFromJSXProvider({
            themes: {
                dark: theme,
            },
            defaultTheme: 'dark',
            Provider: ThemeProvider,
        }),
    ],
};

const Template = (args) => {
    return (<>
        <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
        }}>

            <NewProjectForm {...args} />
        </div>
    </>)
};
export const Default = Template.bind({});
Default.args = {
    title: 'Default Title',
};


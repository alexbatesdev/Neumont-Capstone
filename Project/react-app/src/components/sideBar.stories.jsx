// SideBar.stories.js

import React from 'react';
import { ThemeProvider, useTheme } from '@mui/material';
import { withThemeFromJSXProvider } from '@storybook/addon-themes';
import { theme } from '../thatOneStuffFolderUsuallyCalledUtils/themes'; // import your theme from where it is defined
import { SideBar } from './SideBar';
import { EditorContextProvider } from '@/contexts/editor-context';
import "../reset.css"

// Assistant-generated code starts
// This is your Storybook metadata for the component
export default {
    title: 'Components/SideBar',
    component: SideBar,
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

// Define a template for your stories
const Template = (args) => {
    const [sidebarWidth, setSidebarWidth] = React.useState(330);
    return (
        <div style={{ height: '650px' }}>
            <EditorContextProvider>
                <SideBar {...args} sidebarWidth={sidebarWidth} setSidebarWidth={setSidebarWidth} />
            </EditorContextProvider>
        </div>
    );
};

// Create a Basic story
export const Basic = Template.bind({});
Basic.args = {
    // Add initial props here, for example:
};
// Assistant-generated code ends

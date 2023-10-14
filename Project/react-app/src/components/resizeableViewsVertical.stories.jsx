// ResizableViews.stories.js

import React from 'react';
import { ResizableViewsVertical } from './resizableViews';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { theme } from "../thatOneStuffFolderUsuallyCalledUtils/themes";
import { ConversationWindow } from './conversationWindow';

// This is your Storybook metadata for the component
export default {
    title: 'Components/ResizableViewsVertical',
    component: ResizableViewsVertical,
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
    // The ThemeProvider is added here to provide MUI theme context to the component
    const [messages, setMessages] = React.useState([]);
    const items = [
        {
            slot: 0,
            element: <ConversationWindow setMessages={setMessages} messages={messages} />
        },
        {
            slot: 1,
            element: <div>Slot 1</div>
        },
        {
            slot: 2,
            element: <div>Slot 2</div>
        }
    ]

    return (<div style={{
        height: "500px"
    }}>
        <ResizableViewsVertical {...args} items={items} />
    </div>);
};

// Create a Basic story
export const Basic = Template.bind({});
Basic.args = {
    // Add initial props here, for example:

};
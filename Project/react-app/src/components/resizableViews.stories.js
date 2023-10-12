// ResizableViews.stories.js

import React from 'react';
import { ResizableViews } from './resizableViews';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { theme } from "./themes";
import { ConversationWindow } from './conversationWindow';
import { ResizableViewsVertical } from './resizableViewsVertical';

// This is your Storybook metadata for the component
export default {
    title: 'Components/ResizableViews',
    component: ResizableViews,
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

    return (
        <ResizableViews {...args} items={items} />
    );
};

// Create a Basic story
export const Basic = Template.bind({});
Basic.args = {
    // Add initial props here, for example:

};

const Template2 = (args) => {
    // The ThemeProvider is added here to provide MUI theme context to the component
    const [messages, setMessages] = React.useState([]);
    const items2 = [
        {
            slot: 0,
            element: <ConversationWindow setMessages={setMessages} messages={messages} />
        },
        {
            slot: 1,
            element: <div>Slot 1</div>
        },
    ]
    const items = [
        {
            slot: 0,
            element: <ConversationWindow setMessages={setMessages} messages={messages} />
        },
        {
            slot: 1,
            element: <ResizableViewsVertical items={items2} />
        }
    ]


    return (
        <ResizableViews {...args} items={items} />
    );
};

// Create a Basic story
export const Basic2 = Template2.bind({});
Basic2.args = {
    // Add initial props here, for example:

};
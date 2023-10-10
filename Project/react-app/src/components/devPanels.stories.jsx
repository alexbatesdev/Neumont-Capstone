import React from 'react';
import { theme } from "./themes";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { ThemeProvider } from "@mui/material";
import ResizableGrid from './devPanels';
import { ConversationWindow } from './conversationWindow';

export default {
    title: 'Components/ResizablePanels',
    component: ResizableGrid,
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

const Template = (args) => <ResizableGrid {...args} />;
export const Default = Template.bind({});
Default.args = {
};

// Story with ConversationWindow as a child
const Template2 = (args) => {
    const [messageHistory, setMessageHistory] = React.useState([]);

    return (
        <ResizableGrid {...args}>
            <ConversationWindow messages={messageHistory} setMessages={setMessageHistory} />
        </ResizableGrid>
    )
}

export const WithConversationWindow = Template2.bind({});

// const Template3 = (args) => <ResizableGrid {...args}><ConversationWindow /><ConversationWindow /></ResizableGrid>;
const Template3 = (args) => {
    const [messageHistory, setMessageHistory] = React.useState([]);
    const [messageHistory2, setMessageHistory2] = React.useState([]);

    return (
        <ResizableGrid {...args}>
            <ConversationWindow messages={messageHistory} setMessages={setMessageHistory} />
            <ConversationWindow messages={messageHistory2} setMessages={setMessageHistory2} />
        </ResizableGrid>
    )
}

export const With2ConversationWindows = Template3.bind({});
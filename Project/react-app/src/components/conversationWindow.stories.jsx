import React from "react";
import { ConversationWindow } from "@/components/conversationWindow";
import { theme } from "./themes";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { ThemeProvider } from "@mui/material";
import { useState } from "react";

export default {
    title: "Components/ConversationWindow",
    component: ConversationWindow,
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

const Template = (args) => {
    const [messageHistory, setMessageHistory] = useState([]);
    return <ConversationWindow {...args} messages={messageHistory} setMessages={setMessageHistory} />;
}
export const Default = Template.bind({});
Default.args = {

};
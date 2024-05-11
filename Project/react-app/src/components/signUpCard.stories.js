import React from 'react';
import { theme } from "../thatOneStuffFolderUsuallyCalledUtils/themes";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { ThemeProvider } from "@mui/material";
import { SignUpCard } from './SignUpCard';
import "../reset.css"

export default {
    title: 'Components/SignUpCard',
    component: SignUpCard,
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

const Template = (args) => <SignUpCard {...args} />;
export const Default = Template.bind({});
Default.args = {
};
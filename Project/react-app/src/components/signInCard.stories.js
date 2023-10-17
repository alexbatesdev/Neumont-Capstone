import React from 'react';
import { theme } from "../thatOneStuffFolderUsuallyCalledUtils/themes";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { ThemeProvider } from "@mui/material";
import { SignInCard } from './SignInCard';
import "../reset.css"

export default {
    title: 'Components/SignInCard',
    component: SignInCard,
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

const Template = (args) => <SignInCard {...args} />;
export const Default = Template.bind({});
Default.args = {
};
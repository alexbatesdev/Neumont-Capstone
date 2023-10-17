import React from "react";

import { withThemeFromJSXProvider } from "@storybook/addon-themes";

import { ThemeProvider } from "@mui/material";

import "../reset.css"

import { EditorContextProvider } from "@/contexts/editor-context";
import { CodeEditor } from "@/components/CodeEditor";
import { theme } from "../thatOneStuffFolderUsuallyCalledUtils/themes";

export default {
    title: "Components/CodeEditor",
    component: CodeEditor,
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
    return (
        <EditorContextProvider>
            <div style={{ height: "650px" }}>
                <CodeEditor {...args} />
            </div>
        </EditorContextProvider>
    )
}

export const Default = Template.bind({});

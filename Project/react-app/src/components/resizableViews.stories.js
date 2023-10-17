// ResizableViews.stories.js

import React from 'react';
import { ResizableViewsHorizontal, ResizableViewsVertical } from './ResizableViews';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { theme } from "../thatOneStuffFolderUsuallyCalledUtils/themes";
import { ConversationWindow } from './ConversationWindow';
import { EditorContextProvider } from '@/contexts/editor-context';
import BMOComponent from './BMO';
import "../reset.css"

// // This is your Storybook metadata for the component
export default {
    title: 'Components/ResizableViews',
    component: ResizableViewsHorizontal,
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

// // Define a template for your stories
const DefaultTemplate = (args) => {

    return (
        <EditorContextProvider>
            <div style={{
                position: "relative",
                height: "650px",
                overflow: "hidden",
            }}>
                <ResizableViewsHorizontal {...args}>
                    <ConversationWindow />
                    <ResizableViewsVertical>
                        <div>
                            <p style={{ color: "white", fontSize: "large" }}>For these to work they have to be a child of something with a fixed height<br />You also want it to have overflow: hidden because of the secret shield that covers the mouse when dragging an element</p>
                        </div>
                        <BMOComponent />
                    </ResizableViewsVertical>
                </ResizableViewsHorizontal>
            </div>
        </EditorContextProvider>
    );
};

// // Create a Basic story
export const Default = DefaultTemplate.bind({});
Default.args = {
    // Add initial props here, for example:
};

// // Define a template for your stories
const BasicHorizontalTemplate = (args) => {

    return (
        <EditorContextProvider>
            <div style={{
                position: "relative",
                height: "650px",
                overflow: "hidden",
            }}>
                <ResizableViewsHorizontal {...args}>
                    <ConversationWindow />
                    <div>
                        <p style={{ color: "white", fontSize: "large" }}>For these to work they have to be a child of something with a fixed height<br />You also want it to have overflow: hidden because of the secret shield that covers the mouse when dragging an element</p>
                    </div>
                </ResizableViewsHorizontal>
            </div>
        </EditorContextProvider>
    );
};

// // Create a Basic story
export const BasicHorizontal = BasicHorizontalTemplate.bind({});
BasicHorizontal.args = {
    // Add initial props here, for example:
};

// // Define a template for your stories
const BasicVerticalTemplate = (args) => {

    return (
        <EditorContextProvider>
            <div style={{
                position: "relative",
                height: "650px",
                overflow: "hidden",
            }}>
                <ResizableViewsVertical {...args}>
                    <div>
                        <p style={{ color: "white", fontSize: "large" }}>For these to work they have to be a child of something with a fixed height<br />You also want it to have overflow: hidden because of the secret shield that covers the mouse when dragging an element</p>
                    </div>
                    <div>
                        <p style={{ color: "white", fontSize: "large" }}>They also need more than one element which isn't too surprising<br />They might be accidentally stripping the inline style from their direct children, or storybook is having issues</p>
                    </div>
                </ResizableViewsVertical>
            </div>
        </EditorContextProvider>
    );
};

// // Create a Basic story
export const BasicVertical = BasicVerticalTemplate.bind({});
BasicVertical.args = {
    // Add initial props here, for example:
};
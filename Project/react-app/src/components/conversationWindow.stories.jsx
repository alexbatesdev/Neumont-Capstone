import React from "react";
import { ConversationWindow } from "@/components/ConversationWindow";
import { theme } from "../thatOneStuffFolderUsuallyCalledUtils/themes";
import { withThemeFromJSXProvider } from "@storybook/addon-themes";
import { ThemeProvider } from "@mui/material";
import "../reset.css"
import { EditorContextProvider } from "@/contexts/editor-context";
import { SessionProvider } from "next-auth/react";

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
    return (
        <SessionProvider session={{
            "data": {
                "user": {
                    "account_id": "90dc3ca7-a0a8-4b60-8af4-76ee6a164d11",
                    "name": "Lily",
                    "email": "mcbuzzer@gmail.com",
                    "projects": [
                        "c534e159-2568-4c37-b7ec-c38bc6241680"
                    ],
                    "my_templates": [],
                    "isAdmin": false,
                    "openai_api_key": null,
                    "following": []
                },
                "expires": "2024-05-11T22:01:55.781Z",
                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJtY2J1enplckBnbWFpbC5jb20iLCJleHAiOjE3MTU0Njg1MDR9.UnOElqRBLo0AOjujzj1l9u8v2vdMXgyUgob1_LfniMM"
            },
            "status": "authenticated"
        }}>
            <EditorContextProvider>
                <ConversationWindow {...args} />
            </EditorContextProvider>
        </SessionProvider>
    )
}
export const Default = Template.bind({});
Default.args = {

};
import React from "react";
import { ConversationWindow } from "@/components/conversationWindow";

export default {
    title: "Components/ConversationWindow",
    component: ConversationWindow,
};

const Template = (args) => <ConversationWindow {...args} />;
export const Default = Template.bind({});
Default.args = {

};
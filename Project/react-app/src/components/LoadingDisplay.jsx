import React from "react";

import { Typography, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AnimatedDots from "./AnimatedDotsByGPT";

const LoadingDisplay = ({ webContainerStatus, fun }) => {
    const theme = useTheme();

    const [loadingMessage, setLoadingMessage] = React.useState("Loading");
    // Written by AI assistant
    const loadingMessages = [
        "Reticulating Splines",
        "Generating World",
        "Yoinking The Bunkle",
        "Feeding Code Monkeys",
        "Warming Up The Flux Capacitor",
        "Generating Random Numbers",
        "Loading The Loading Screen",
        "Loading The Loading Screen's Loading Screen",
        "Squashing Bugs",
        "Dinglehoppering",
        "Taming Unicorns",
        "Knitting Pixels",
        "Herding Cats",
        "Baking Some Bits",
        "Gathering Moonbeams",
        "Synchronized Swimming In The Data Stream",
        "Performing Magic Tricks",
        "Wrestling With A Spaghetti Code Monster",
        "Waiting For The Stars To Align",
        "Dividing By the Square Root Of -1",
        "Watering The Binary Tree",
        "Whispering To The Algorithms",
        "Attempting To Divide By Zero",
        "Fine-tuning The Doohickeys",
        "Tickling The Bits",
        "Traveling To The Fourth Dimension",
        "Finding The Missing Semicolon",
        "Playing Hide And Seek With The Server",
        "Invoking The Spirits Of Computation",
        "Procrastinating",
        "Checking The Gravitational Constant",
        "Spinning The Hamster Wheel",
        "Counting Backwards From Infinity",
        "Preparing To Emit The Brown Note",
        "Hitchhiking Through The Galaxy",
        "Waking Up The Electrons",
        "Shaking The Magic 8-ball",
        "Rearranging The Cosmic Furniture",
        "Counting The Stars",
        "Evaluating Life Choices",
        "Pondering The Meaning Of Pixels",
        "Probing The Unknown",
        "Overclocking The Hamster",
        "Combing The Desert",
        "Crossing The Streams",
        "Waking Up The Gnomes",
        "Reading From The Library Of Babel",
        "Decoding The Necronomicon",
        "Waiting For The Great Pumpkin",
    ];
    // End of code written by AI assistant


    // React.useEffect(() => {
    //     if (webContainerStatus == 1) {
    //         setLoadingMessage("Installing dependencies");
    //     } else if (webContainerStatus == 2) {
    //         setLoadingMessage("Starting server");
    //     } else {
    //         setLoadingMessage("Loading");
    //     }
    // }, [webContainerStatus]);

    if (fun) {
        //Alternate through messages on a timer


        React.useEffect(() => {
            //random interval between 300 and 1000
            const randomIntervalMS = Math.floor(Math.random() * 700) + 300;
            const interval = setInterval(() => {
                const randomLoadingMessageIndex = Math.floor(Math.random() * loadingMessages.length);
                setLoadingMessage(loadingMessages[randomLoadingMessageIndex]);
            }, randomIntervalMS);
            return () => clearInterval(interval);
        }, [loadingMessage]);
    }

    return (<>
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            inset: 0,
            backgroundColor: theme.palette.background.paper,
        }}>
            <CircularProgress disableShrink />
            <Typography variant='h6' color="text.primary" style={{ marginTop: '10px', textWrap: "nowrap" }}>
                {webContainerStatus == 1 && "Installing dependencies"}
                {webContainerStatus == 2 && "Starting server"}
                {webContainerStatus != 1 && webContainerStatus != 2 && loadingMessage}<AnimatedDots />
            </Typography>
        </div>
    </>)
}

export default LoadingDisplay;
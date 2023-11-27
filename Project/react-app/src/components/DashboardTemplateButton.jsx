import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material";

const DashboardTemplateButton = ({ text, iconDivBackgroundImage, onClick = () => { }, customButtonBodyStyle = {}, customButtonIconStyle = {} }) => {
    const theme = useTheme();

    const [hover, setHover] = React.useState(false);

    const buttonBodyStyle = {
        backgroundColor: hover ? theme.palette.background.alternateDark : theme.palette.background.alternate,
        border: `1px solid ${theme.palette.utilBar.icons}`,
        borderRadius: '3px',
        padding: '10px 5px 5px 5px',
        // width: "75px",
        height: "50px",
        // Sometimes I understand the hate for css
        // With just flexGrow: 1 the buttons fill as much space as they can
        // They don't all grow to be the same size because they have different amounts of text
        aspectRatio: "1/1",
        flexGrow: 1,
        // but for some reason aspectRatio with any value ensures that they all grow to be the same size

        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        ...customButtonBodyStyle,
    }

    const buttonIconStyle = {
        height: "35px",
        aspectRatio: "1/1",
        backgroundImage: iconDivBackgroundImage,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        ...customButtonIconStyle,
    }


    return (<>
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
            style={buttonBodyStyle}>
            <div style={buttonIconStyle}>

            </div>
            <Typography variant="caption" sx={{
                userSelect: "none",
                textWrap: "nowrap",
            }}>{text}</Typography>
        </div>
    </>)

}

export default DashboardTemplateButton;
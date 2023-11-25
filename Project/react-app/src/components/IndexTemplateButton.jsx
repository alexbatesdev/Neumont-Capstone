import React from "react";
import { Typography } from "@mui/material";
import { useTheme } from "@mui/material";

const IndexTemplateButton = ({ text, iconDivBackgroundImage, onClick = () => { }, customButtonBodyStyle = {}, customButtonIconStyle = {} }) => {
    const theme = useTheme();

    const [hover, setHover] = React.useState(false);

    const buttonBodyStyle = {
        height: "3rem",
        aspectRatio: "2.5/1",
        backgroundColor: !hover ? theme.palette.background.paper : theme.palette.background.alternateDark,
        borderRadius: '3px',
        border: `1px solid ${theme.palette.utilBar.icons}`,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: '5px 1rem',
        gap: '1rem',
        cursor: 'pointer',
        ...customButtonBodyStyle,
    }

    const buttonIconStyle = {
        height: "2rem",
        aspectRatio: "1/1",
        backgroundImage: iconDivBackgroundImage,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        ...customButtonIconStyle,
    }


    return (<>
        <div
            onClick={onClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={buttonBodyStyle}>
            <div style={buttonIconStyle}>

            </div>
            <Typography variant='h5' style={{
                color: theme.palette.text.primary,
                fontFamily: 'Teko',
                paddingTop: "4px"
            }}>
                {text}
            </Typography>
        </div>
    </>)

}

export default IndexTemplateButton;
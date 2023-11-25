import React, { useState } from 'react';
import { Collapse, Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { toast } from 'react-toastify';

const FooterContactBadge = ({ Icon, text, url, copyOnClick = false }) => {
    const theme = useTheme();

    const [hover, setHover] = useState(false);

    const iconDivStyle = {
        minWidth: "50px",
        height: "50px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        color: theme.palette.text.primary,
    };

    const collapseStyle = {
        color: theme.palette.text.primary,
        height: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    };

    const handleClick = () => {
        if (copyOnClick) {
            navigator.clipboard.writeText(text);
            toast.success("Copied to clipboard!");
        } else {
            window.open(url, "_blank")
        }
    }

    return (<>
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={handleClick}
            style={iconDivStyle}
        >
            <Icon />
        </div>
        <Collapse
            in={hover}
            orientation='horizontal'
            style={collapseStyle}
        >
            <Typography
                variant='body2'
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={handleClick}
                style={{
                    userSelect: "none",
                    textWrap: "nowrap",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                }}>
                {text}
            </Typography>
        </Collapse>
    </>)
}

export default FooterContactBadge;
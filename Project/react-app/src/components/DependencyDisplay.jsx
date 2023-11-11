import { useFiles, useWebContainer } from '@/contexts/editor-context';
import { Typography, useTheme } from '@mui/material';
import Link from 'next/link';
import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Scrollbar } from 'react-scrollbars-custom';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import RefreshIcon from '@mui/icons-material/Refresh';

const DependencyDisplay = ({ height, setHeight }) => {
    const theme = useTheme();
    const [isDragging, setIsDragging] = useState(false);
    const dragShieldRef = useRef(null);
    const { webContainer } = useWebContainer();
    const [dependencies, setDependencies] = useState([]);
    const [error, setError] = useState(null);


    useEffect(() => {
        doRefresh();
    }, [webContainer]);

    const doRefresh = () => {
        if (webContainer) {
            setError(null);
            webContainer.fs.readFile("/package.json", "utf8").then((data) => {
                const packageJson = JSON.parse(data);
                const dependencies = packageJson.dependencies;
                const devDependencies = packageJson.devDependencies;
                const allDependencies = { ...dependencies, ...devDependencies };
                setDependencies(allDependencies)
            }).catch((err) => {
                setError(err);
            });
        }
    }

    const handleRefresh = (event) => {
        let target = event.target;

        // If the target is a path element, get the parent svg element
        if (target.tagName === 'path') {
            target = target.parentElement;
        }

        target.style.animation = 'rotate 0.6s ease-out';
        setTimeout(() => {
            target.style.animation = '';
        }, 600);
        doRefresh();
    }

    // I have found myself needing to re-create this functionality
    // I originally did so with a ton of GPT help
    // Now that I have entirely forgotten 1) How it worked and 2) What modifications are even mine
    // I am going to re-create it without GPT help
    // Me from the future: Yeah it wasn't hard to remember how it works, this isn't a difficult implementation of the concept
    const handleMouseDown = useCallback((event) => {
        event.preventDefault();
        setIsDragging(true);

        // Get the initial mouse position
        let lastY = event.clientY;
        let startY = event.clientY;

        const handleMouseMove = (event) => {
            // Calculate deltaX as the difference between the current and last clientX
            const deltaY = event.clientY - lastY;
            const totalDeltaY = event.clientY - startY;
            //console.log("totalDeltaX")
            //console.log(totalDeltaX)

            // Update lastX for the next move event
            lastY = event.clientY;

            //console.log("deltaX")
            //console.log(deltaX);

            // Human Addition
            // Update the drag shield
            dragShieldRef.current.style.left = `${event.clientX}px`;
            //console.log("event.clientX")
            dragShieldRef.current.style.top = `${event.clientY}px`;
            //console.log("event.clientY")

            setHeight((height) => {
                const newHeight = height - deltaY;
                if (newHeight < 50) {
                    return 50;
                }
                return newHeight;
            });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            setIsDragging(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    });

    const dragShieldStyle = {
        width: "100px",
        height: "300px",
        position: "absolute",
        zIndex: 100,
        transform: "translate(-50%, -50%)",
    }

    const refreshIconStyle = {
        display: "inline",
        height: "20px",
        padding: "2px",
        color: theme.palette.utilBar.icons,
        width: "auto",
        aspectRatio: "1/1",
        textAlign: "center",
        userSelect: "none",
        cursor: "pointer",
        marginRight: "10px",
    }

    return (
        <div style={{
            position: "absolute",
            bottom: "0px",
            right: "0px",
            left: "0px",
            width: "100%",
            height: height + "px",
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
        }}>
            {isDragging && <div ref={dragShieldRef} style={dragShieldStyle}></div>}
            <div
                onMouseDown={handleMouseDown}
                style={{
                    position: "absolute",
                    top: "0px",
                    right: "0px",
                    left: "0px",
                    width: "100%",
                    height: "10px",
                    backgroundColor: theme.palette.dragBar.default,
                    cursor: "row-resize",
                    zIndex: 2,
                }}></div>
            <Scrollbar noScrollX
                style={{
                    width: "100%",
                    height: "100%",
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    color: theme.palette.text.primary,
                }}>
                <Typography
                    variant="h6"
                    style={{
                        padding: "10px",
                        paddingBottom: "5px",
                        width: "calc(100% - 20px)",
                        backgroundColor: theme.palette.background.default,
                        filter: "brightness(1.3)",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                    Dependencies
                    <style>
                        {`
                        @keyframes rotate {
                            from {
                                transform: rotate(0deg);
                            }
                            to {
                            transform: rotate(360deg);
                        }
                    }
                    `}
                    </style>
                    <RefreshIcon
                        sx={refreshIconStyle}
                        onClick={handleRefresh}
                    />
                </Typography>
                {error ? <Typography variant="body1" style={{ padding: "10px" }}>package.json malformed</Typography> : (
                    <div style={{ paddingBottom: "10px" }}>
                        {Object.keys(dependencies).map((dependency, index) => {
                            return (
                                <div key={index} style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    width: "calc(100% - 20px)",
                                    padding: "3px 10px",
                                    backgroundColor: (index % 2 === 0) ? theme.palette.background.default : theme.palette.background.paper,
                                }}>
                                    <Link
                                        href={`https://www.npmjs.com/package/${dependency}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            textDecoration: "none",
                                            color: theme.palette.text.primary,
                                            display: "flex",
                                            flexDirection: "row",
                                            justifyContent: "flex-start",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Typography variant="body1">{dependency}</Typography>
                                        <OpenInNewIcon style={{ marginLeft: "5px", fontSize: "15px" }} />
                                    </Link>
                                    <Typography>{dependencies[dependency]}</Typography>
                                </div>
                            )
                        })}
                    </div>)}
            </Scrollbar>
        </div>
    );
}

export default DependencyDisplay;
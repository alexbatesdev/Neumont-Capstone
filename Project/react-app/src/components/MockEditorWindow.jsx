
import React, { useEffect } from 'react';
import { Collapse, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import MinimizeIcon from '@mui/icons-material/Minimize';

const MockEditorWindow = () => {
    const theme = useTheme();
    const [mockMessages, setMockMessages] = React.useState(
        [
            {
                messageID: 3,
                isUserMessage: false,
                lines: [30, 50, 10, 34, 78]
            },
            {
                messageID: 2,
                isUserMessage: true,
                lines: [30, 50, 50, 45, 55, 30]
            },
            {
                messageID: 1,
                isUserMessage: false,
                lines: [50, 150, 100, 34, 78]
            },
            {
                messageID: 0,
                isUserMessage: true,
                lines: [50, 150, 34, 78]
            },
        ]
    );
    // GPT color: "#45b288"
    // User color: theme.palette.tertiary.main

    useEffect(() => {
        const interval = setInterval(() => {
            setMockMessages((prevMessages) => {
                let lines = [];
                for (let i = 0; i < (Math.floor(Math.random() * 9) + 1); i++) {
                    lines.push(Math.floor(Math.random() * 90) + 10);
                }
                let newMessages = [{
                    messageID: prevMessages.length,
                    isUserMessage: prevMessages.length % 2 == 0 ? true : false,
                    lines: lines,
                }];
                return newMessages.concat(...prevMessages);
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);


    return (
        <div style={{
            maxWidth: '50%',
            position: 'relative',
            boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)',
        }}>
            <div style={{
                width: "550px",
                height: "420px",
                borderRadius: "10px",
                backgroundColor: "#130925",
            }}>
                {/* Mock Window Icons */}
                <CloseIcon style={{
                    position: "absolute",
                    top: "5px",
                    right: "10px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    color: theme.palette.primary.main,
                }} />
                <FullscreenIcon style={{
                    position: "absolute",
                    top: "5px",
                    right: "30px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    color: theme.palette.primary.main,
                }} />
                <MinimizeIcon style={{
                    position: "absolute",
                    top: "3px",
                    right: "50px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    color: theme.palette.primary.main,
                }} />
                {/* Mock window content */}
                <div style={{
                    position: "relative",
                    top: "30px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: theme.palette.background.paperLight,
                    width: "calc(100% - 20px)",
                    height: "calc(100% - 40px)",
                    borderRadius: "5px",
                }}>
                    {/* Mini editor top bar */}
                    <div style={{
                        height: "20px",
                        width: "100%",
                        backgroundColor: theme.palette.background.default,
                        position: "relative",
                    }}>
                        <div style={{
                            height: "10px",
                            width: "10px",
                            borderRadius: "50%",
                            backgroundColor: theme.palette.utilBar.icons,
                            display: "inline-block",
                            margin: "5px",
                        }}></div>
                        <div style={{
                            height: "10px",
                            width: "10px",
                            borderRadius: "50%",
                            backgroundColor: theme.palette.utilBar.icons,
                            display: "inline-block",
                            margin: "5px",
                        }}></div>
                        <div style={{
                            height: "10px",
                            width: "10px",
                            borderRadius: "50%",
                            backgroundColor: theme.palette.utilBar.icons,
                            display: "inline-block",
                            margin: "5px",
                        }}></div>
                        <div style={{
                            height: "10px",
                            width: "10px",
                            borderRadius: "50%",
                            backgroundColor: theme.palette.utilBar.icons,
                            display: "inline-block",
                            margin: "5px",
                            float: "right",
                        }}></div>
                        <div style={{
                            height: "1px",
                            width: "100px",
                            borderTop: "2px solid " + theme.palette.utilBar.icons,
                            borderBottom: "2px solid " + theme.palette.utilBar.icons,
                            backgroundColor: theme.palette.utilBar.icons,
                            display: "inline-block",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            borderRadius: "5px",
                        }}></div>
                    </div>
                    {/* Mini editor side bar */}
                    <div style={{
                        position: "absolute",
                        left: "0px",
                        top: "20px",
                        bottom: "0px",
                        width: "20px",
                        backgroundColor: theme.palette.background.default,
                        paddingTop: "1px",
                    }}>
                        <div style={{
                            height: "10px",
                            width: "10px",
                            borderRadius: "50%",
                            backgroundColor: theme.palette.utilBar.icons,
                            display: "inline-block",
                            margin: "5px",
                        }}></div>
                        <div style={{
                            padding: "0px 0px 2px 5px",
                            backgroundColor: theme.palette.background.paper,
                        }}>

                            <div style={{
                                height: "10px",
                                width: "10px",
                                borderRadius: "50%",
                                backgroundColor: theme.palette.utilBar.icons,
                                display: "inline-block",

                            }}></div>
                        </div>
                        <div style={{
                            height: "10px",
                            width: "10px",
                            borderRadius: "50%",
                            backgroundColor: theme.palette.utilBar.icons,
                            display: "inline-block",
                            margin: "5px",
                        }}></div>
                    </div>
                    <div style={{
                        position: "absolute",
                        left: "20px",
                        top: "20px",
                        bottom: "0px",
                        right: "0px",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                    }}>
                        {/* Mini GPT chat component  */}
                        <div style={{
                            flexGrow: 1,
                            height: "100%",
                            backgroundColor: theme.palette.background.paper,
                            position: "relative",
                        }}>
                            {/* Mini GPT top ribbon */}
                            <div style={{
                                position: "absolute",
                                top: "0px",
                                left: "0px",
                                width: "100%",
                                height: "30px",
                                borderBottom: "1px solid " + theme.palette.utilBar.icons,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                            }}>
                                <div style={{
                                    height: "20px",
                                    width: "20px",
                                    borderRadius: "50%",
                                    backgroundColor: "#45b288",
                                    display: "inline-block",
                                    margin: "5px",
                                    outline: "3px solid black",
                                    outlineOffset: "-7px",
                                }}></div>
                                <div style={{
                                    height: "20px",
                                    width: "40px",
                                    borderRadius: "3px",
                                    backgroundColor: "#45b288",
                                    display: "inline-block",
                                    margin: "5px",
                                    marginLeft: "auto",
                                    position: "relative",
                                }}>
                                    <div style={{
                                        height: "1px",
                                        width: "20px",
                                        borderTop: "2px solid black",
                                        borderBottom: "2px solid black",
                                        backgroundColor: "black",
                                        display: "inline-block",
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        borderRadius: "5px",
                                    }}></div>
                                </div>
                                <div style={{
                                    height: "1px",
                                    width: "80px",
                                    borderTop: "2px solid " + theme.palette.utilBar.icons,
                                    borderBottom: "2px solid " + theme.palette.utilBar.icons,
                                    backgroundColor: theme.palette.utilBar.icons,
                                    display: "inline-block",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-64%, -50%)",
                                    borderRadius: "5px",
                                }}></div>
                            </div>
                            {/* Mini GPT Chat container */}
                            <div style={{
                                position: "absolute",
                                top: "31px",
                                left: "0px",
                                width: "100%",
                                bottom: "38px",
                                display: "flex",
                                flexDirection: "column-reverse",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                                overflow: "hidden",
                            }}>
                                {mockMessages.map((message, index) => {
                                    let isCollapsed = index > 0;
                                    return (
                                        <Collapse
                                            key={"message-" + message.messageID}
                                            in={isCollapsed}
                                            sx={{
                                                width: "100%",
                                                flexShrink: 0,
                                                position: "relative",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "flex-start",
                                                    alignItems: "flex-start",
                                                    marginTop: "8px",
                                                    marginLeft: message.isUserMessage ? "auto" : "5px",
                                                    marginRight: "5px",
                                                    padding: "10px",
                                                    maxWidth: "calc(100% - 50px)",
                                                    width: "fit-content",
                                                    color: message.isUserMessage ? "black" : "white",
                                                    borderRadius: "10px",
                                                    borderBottomRightRadius: message.isUserMessage ? "0px" : "10px",
                                                    borderBottomLeftRadius: message.isUserMessage ? "10px" : "0px",
                                                    backgroundColor: message.isUserMessage ? theme.palette.tertiary.main : "#45b288",
                                                    boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.6)",
                                                }}>
                                                {message.lines.map((line, index) => {
                                                    let color = message.isUserMessage ? "white" : "black";
                                                    return (<div key={"line-" + index} style={{
                                                        height: "1px",
                                                        width: line + "px",
                                                        maxWidth: "calc(100% - 10px)",
                                                        borderTop: "2px solid " + color,
                                                        borderBottom: "2px solid " + color,
                                                        backgroundColor: color,
                                                        margin: "2px 0px",
                                                    }}></div>
                                                    )
                                                })}
                                            </div>
                                        </Collapse>
                                    )
                                })}
                            </div>

                            {/* Mini GPT bottom ribbon */}
                            <div style={{
                                position: "absolute",
                                bottom: "0px",
                                left: "0px",
                                width: "100%",
                                height: "30px",
                                borderTop: "1px solid " + theme.palette.utilBar.icons,
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                paddingTop: "1px",
                            }}>
                                <div style={{
                                    // width: "calc(100% - 45px)",
                                    flexGrow: 1,
                                    margin: "0px 5px",
                                    height: "calc(100% - 10px)",
                                    border: "1px solid " + theme.palette.primary.main,
                                    borderRadius: "2px",
                                }}>
                                </div>
                                <div style={{
                                    width: "calc(100% - (100% - 45px) - 20px)",
                                    height: "calc(100% - 8px)",
                                    backgroundColor: theme.palette.tertiary.main,
                                    borderRadius: "5px",
                                    marginRight: "5px",
                                    position: "relative",
                                }}>
                                    <div style={{
                                        position: "absolute",
                                        top: "50%",
                                        left: "50%",
                                        transform: "translate(-50%, -50%)",
                                        height: "10px",
                                        width: "10px",
                                        borderRadius: "50%",
                                        backgroundColor: "white",
                                        display: "inline-block",
                                    }}></div>
                                </div>
                            </div>
                        </div>
                        {/* Mini Code Editor component */}
                        <div style={{
                            flexGrow: 1,
                            height: "100%",
                            backgroundColor: theme.palette.utilBar.default,
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "flex-start",
                            alignItems: "flex-start",
                            position: "relative",
                        }}>
                            {/* Mock Language indicator */}
                            <div style={{
                                height: "0px",
                                width: "40px",
                                borderTop: "2px solid #cbc5d3",
                                borderBottom: "2px solid #cbc5d3",
                                backgroundColor: '#cbc5d3',
                                margin: "2px 0px",
                                position: "absolute",
                                top: "7px",
                                left: "7px",
                            }}></div>
                            {/* Mock tab */}
                            <div style={{
                                height: "14px",
                                width: "40px",
                                backgroundColor: theme.palette.utilBar.secondary,
                                margin: "2px 0px",
                                position: "absolute",
                                top: "0px",
                                right: "0px",
                            }}>
                                <div style={{
                                    height: "0px",
                                    width: "20px",
                                    borderTop: "2px solid #cbc5d3",
                                    borderBottom: "2px solid #cbc5d3",
                                    backgroundColor: '#cbc5d3',
                                    margin: "2px 0px",
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-70%, -50%)",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "5px",
                                    borderRadius: "50%",
                                    backgroundColor: '#cbc5d3',
                                    margin: "2px 0px",
                                    position: "absolute",
                                    top: "50%",
                                    right: "5px",
                                    transform: "translate(0%, -50%)",
                                }}></div>
                            </div>
                            {/* Mock line number indicators */}
                            <div style={{
                                position: "absolute",
                                top: "15px",
                                left: "0px",
                                bottom: "0px",
                                width: "20px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "center",
                            }}>
                                {Array(24).fill(0).map((_, index) => {
                                    return (<div
                                        key={"indicator-" + index}
                                        style={{
                                            height: "5px",
                                            width: "5px",
                                            borderRadius: "50%",
                                            backgroundColor: "#555",
                                            display: "inline-block",
                                            margin: "3px",
                                        }}></div>)
                                })}
                            </div>
                            {/* Lines of mock code */}
                            <div style={{
                                position: "absolute",
                                top: "15px",
                                left: "20px",
                                bottom: "0px",
                                right: "0px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                            }}>

                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "20px",
                                        backgroundColor: "#7233cc",
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "30px",
                                        backgroundColor: "#66cc33",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                                <div style={{
                                    height: "5px",
                                    width: "calc(100% - 10px)",
                                    // backgroundColor: "#555",
                                    display: "inline-block",
                                    margin: "3px",
                                }}></div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "30px",
                                        backgroundColor: "#7233cc",
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "15px",
                                        backgroundColor: "#ffb800",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                                <div style={{
                                    height: "5px",
                                    width: "30px",
                                    backgroundColor: "#7233cc",
                                    display: "inline-block",
                                    margin: "3px",
                                    marginLeft: "10px"
                                }}></div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "40px",
                                        backgroundColor: "#7233cc",
                                        display: "inline-block",
                                        marginLeft: "20px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "10px",
                                        backgroundColor: "#66cc33",
                                        display: "inline-block",
                                    }}></div>
                                </div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "40px",
                                        backgroundColor: "#7233cc",
                                        display: "inline-block",
                                        marginLeft: "30px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "15px",
                                        backgroundColor: "#66cc33",
                                        display: "inline-block",
                                    }}></div>
                                </div>
                                <div style={{
                                    height: "5px",
                                    width: "10px",
                                    backgroundColor: "#7233cc",
                                    display: "inline-block",
                                    margin: "3px",
                                    marginLeft: "33px",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "50px",
                                    backgroundColor: "#ffb800",
                                    display: "inline-block",
                                    margin: "3px",
                                    marginLeft: "43px",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "10px",
                                    backgroundColor: "#7233cc",
                                    display: "inline-block",
                                    margin: "3px",
                                    marginLeft: "33px",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "7px",
                                    backgroundColor: "#7233cc",
                                    display: "inline-block",
                                    margin: "3px",
                                    marginLeft: "33px",
                                }}></div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "25px",
                                        backgroundColor: "#7233cc",
                                        display: "inline-block",
                                        marginLeft: "40px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "20px",
                                        backgroundColor: "#66cc33",
                                        display: "inline-block",
                                    }}></div>
                                </div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "15px",
                                        backgroundColor: "#7233cc",
                                        display: "inline-block",
                                        marginLeft: "40px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "40px",
                                        backgroundColor: "#66cc33",
                                        display: "inline-block",
                                    }}></div>
                                </div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "20px",
                                        backgroundColor: "#7233cc",
                                        display: "inline-block",
                                        marginLeft: "40px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "20px",
                                        backgroundColor: "#66cc33",
                                        display: "inline-block",
                                    }}></div>
                                </div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "12px",
                                        backgroundColor: "#7233cc",
                                        display: "inline-block",
                                        marginLeft: "40px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "40px",
                                        backgroundColor: "#66cc33",
                                        display: "inline-block",
                                    }}></div>
                                </div>
                                <div style={{
                                    height: "5px",
                                    width: "3px",
                                    backgroundColor: "#7233cc",
                                    display: "inline-block",
                                    margin: "3px",
                                    marginLeft: "33px",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "30px",
                                    backgroundColor: "#ffb800",
                                    display: "inline-block",
                                    margin: "3px",
                                    marginLeft: "43px",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "10px",
                                    backgroundColor: "#7233cc",
                                    display: "inline-block",
                                    margin: "3px",
                                    marginLeft: "33px",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "15px",
                                    backgroundColor: "#7233cc",
                                    display: "inline-block",
                                    margin: "3px",
                                    marginLeft: "33px",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "15px",
                                    backgroundColor: "#7233cc",
                                    display: "inline-block",
                                    margin: "3px",
                                    marginLeft: "23px",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    display: "inline-block",
                                    margin: "3px",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    display: "inline-block",
                                    margin: "3px",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    display: "inline-block",
                                    margin: "3px",
                                }}></div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "40px",
                                        backgroundColor: "#7233cc",
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "15px",
                                        backgroundColor: "#ffb800",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                            </div>
                        </div>
                        {/* Mini Preview and Terminal component */}
                        <div style={{
                            flexGrow: 1,
                            height: "100%",
                            backgroundColor: "#0000FF22",
                            maxWidth: "33%",
                        }}>
                            {/* Mock preview */}
                            <div style={{
                                width: "100%",
                                height: "50%",
                                backgroundColor: theme.palette.utilBar.default,
                                position: "relative",
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: "5px",
                                    left: "5px",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: theme.palette.utilBar.icons,
                                }}></div>
                                <div style={{
                                    position: "absolute",
                                    top: "5px",
                                    right: "5px",
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    backgroundColor: theme.palette.utilBar.icons,
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "120px",
                                    backgroundColor: theme.palette.utilBar.icons,
                                    display: "inline-block",
                                    position: "absolute",
                                    top: "7.5px",
                                    left: "50%",
                                    transform: "translate(-50%, 0%)",
                                }}></div>
                                <div style={{
                                    position: "absolute",
                                    top: "20px",
                                    left: "0px",
                                    right: "0px",
                                    bottom: "0px",
                                    backgroundColor: "#282c34",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}>
                                    <div style={{
                                        height: "5px",
                                        width: "90px",
                                        backgroundColor: theme.palette.text.primary,
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "30px",
                                        backgroundColor: "#61dafb",
                                        display: "inline-block",
                                        marginTop: "10px",
                                    }}></div>
                                </div>
                            </div>
                            {/* Mock terminal */}
                            <div style={{
                                width: "100%",
                                height: "50%",
                                backgroundColor: theme.palette.utilBar.default,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                            }}>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "30px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "10px",
                                        backgroundColor: "#34e2e2",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "40px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "10px",
                                        backgroundColor: "#34e2e2",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "40px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "10px",
                                        backgroundColor: "#34e2e2",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "20px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "10px",
                                        backgroundColor: "#34e2e2",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "30px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "10px",
                                        backgroundColor: "#34e2e2",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "30px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "10px",
                                        backgroundColor: "#34e2e2",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "25px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "10px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "10px",
                                        backgroundColor: "#34e2e2",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "30px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "10px",
                                        backgroundColor: "#34e2e2",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "30px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "10px",
                                        backgroundColor: "#34e2e2",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "15px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "15px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                                <div style={{
                                    height: "5px",
                                    width: "calc(100% - 10px)",
                                    // backgroundColor: "#555",
                                    display: "inline-block",
                                    margin: "3px",
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "30px",
                                    backgroundColor: "#34e2e2",
                                    display: "inline-block",
                                    margin: "3px",
                                }}></div>

                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "15px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "15px",
                                        backgroundColor: "#555",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "25px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "15px",
                                        backgroundColor: "#555",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "5px",
                                        backgroundColor: "#4e9a06",
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "30px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "15px",
                                        backgroundColor: "#555",
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                                <div style={{
                                    height: "5px",
                                    width: "calc(100% - 10px)",
                                    // backgroundColor: "#555",
                                    display: "inline-block",
                                    margin: "3px",
                                }}></div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "20px",
                                        backgroundColor: "#ffb800",
                                        display: "inline-block",
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "75px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                                <div style={{
                                    height: "5px",
                                    width: "30px",
                                    backgroundColor: theme.palette.primary.main,
                                    display: "inline-block",
                                    margin: "3px",
                                    marginLeft: "15px"
                                }}></div>
                                <div style={{ width: "100%", margin: "3px", display: "flex" }}>
                                    <div style={{
                                        height: "5px",
                                        width: "25px",
                                        backgroundColor: "#ffb800",
                                        display: "inline-block",
                                        marginLeft: "20px"
                                    }}></div>
                                    <div style={{
                                        height: "5px",
                                        width: "75px",
                                        backgroundColor: theme.palette.primary.main,
                                        display: "inline-block",
                                        marginLeft: "4px"
                                    }}></div>
                                </div>
                                <div style={{
                                    height: "5px",
                                    width: "30px",
                                    backgroundColor: theme.palette.primary.main,
                                    display: "inline-block",
                                    margin: "3px"
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "25px",
                                    backgroundColor: "#3465a4",
                                    display: "inline-block",
                                    margin: "3px"
                                }}></div>
                                <div style={{
                                    height: "5px",
                                    width: "5px",
                                    backgroundColor: "#75507b",
                                    display: "inline-block",
                                    margin: "3px"
                                }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockEditorWindow;

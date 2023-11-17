
import React from 'react';
import { AccountCircle, Close, Fullscreen, Minimize } from '@mui/icons-material'
import { useTheme } from '@mui/material';

const MockEditorWindow = () => {
    const theme = useTheme();
    return (
        <div style={{
            maxWidth: '50%',
            position: 'relative',
        }}>
            <div style={{
                width: "550px",
                height: "420px",
                borderRadius: "10px",
                backgroundColor: "#321175"
            }}>
                {/* Mock Window Icons */}
                <Close style={{
                    position: "absolute",
                    top: "5px",
                    right: "10px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    color: theme.palette.primary.main,
                }} />
                <Fullscreen style={{
                    position: "absolute",
                    top: "5px",
                    right: "30px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    color: theme.palette.primary.main,
                }} />
                <Minimize style={{
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
                                bottom: "30px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "flex-start",
                                alignItems: "center",
                            }}>

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
                            backgroundColor: theme.palette.background.default,
                        }}></div>
                        {/* Mini Preview and Terminal component */}
                        <div style={{
                            flexGrow: 1,
                            height: "100%",
                            backgroundColor: "#0000FF22",
                        }}>
                            <div style={{
                                width: "100%",
                                height: "50%",
                                backgroundColor: theme.palette.utilBar.default,
                                position: "relative",
                            }}>
                                <div style={{
                                    position: "absolute",
                                    top: "20px",
                                    left: "0px",
                                    right: "0px",
                                    bottom: "0px",
                                    backgroundColor: "#282c34",
                                }}>

                                </div>
                            </div>
                            <div style={{
                                width: "100%",
                                height: "50%",
                                backgroundColor: theme.palette.utilBar.default,
                            }}>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MockEditorWindow;

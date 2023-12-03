import React, { useRef } from 'react'
import { useTheme } from '@emotion/react'
import Xarrow from "react-xarrows";
import { Typography, Link } from '@mui/material';


// React Icon
import DevicesIcon from '@mui/icons-material/Devices';
// Users Icon
import PeopleIcon from '@mui/icons-material/People';
// Fastapi Icon
import BoltIcon from '@mui/icons-material/Bolt';
// MongoDB Icon
import SpaIcon from '@mui/icons-material/Spa';
// Express Icon
import StorageIcon from '@mui/icons-material/Storage';
// External Resources Icon
import LanguageIcon from '@mui/icons-material/Language';
import { Scrollbar } from 'react-scrollbars-custom';

const TechStackPanel = () => {
    const theme = useTheme();

    const userIconRef = useRef(null);
    const reactIconRef = useRef(null);
    const fastapiIconRef = useRef(null);
    const fastapiIconRef2 = useRef(null);
    const fastapiIconRef3 = useRef(null);
    const mongoIconRef = useRef(null);
    const mongoIconRef2 = useRef(null);
    const expressIconRef = useRef(null);
    const gptIconRef = useRef(null);
    const internetIconRef = useRef(null);


    return (<>
        <Scrollbar
            noScrollX
            style={{
                width: "550px",
            }}>
            <div style={{
                height: "calc(500px - 2rem)",
                padding: '1rem',
            }}>

                <Typography variant='h2' style={{
                    fontFamily: 'Teko',
                    color: theme.palette.text.primary,
                }}>
                    Tech Stack
                </Typography>
                <Typography variant='h6' style={{
                    color: theme.palette.text.primary,
                    marginLeft: '1rem',
                }}>
                    Webbie was built using the following technologies
                </Typography>
                <div style={{
                    padding: '1rem',
                }}>
                    <Typography variant='h4' style={{
                        fontFamily: 'Teko',
                        color: theme.palette.text.primary,
                    }}>
                        Frontend
                    </Typography>
                    <Typography variant='body1' style={{
                        color: theme.palette.text.primary,
                        marginLeft: '1rem',
                    }}>
                        <Link href={"https://react.dev"} target='_blank' style={{
                            color: theme.palette.secondary.main,
                            textDecorationColor: theme.palette.secondary.main
                        }}>React</Link> - Frontend library
                    </Typography>
                    <Typography variant='body1' style={{
                        color: theme.palette.text.primary,
                        marginLeft: '1rem',
                    }}>
                        <Link href={"https://nextjs.org"} target='_blank' style={{
                            color: theme.palette.secondary.main,
                            textDecorationColor: theme.palette.secondary.main
                        }}>Next.JS</Link> - Fullstack React framework
                    </Typography>
                    <Typography variant='body1' style={{
                        color: theme.palette.text.primary,
                        marginLeft: '1rem',
                    }}>
                        <Link href={"https://mui.com"} target='_blank' style={{
                            color: theme.palette.secondary.main,
                            textDecorationColor: theme.palette.secondary.main
                        }}>Material UI</Link> - React UI and Icon library
                    </Typography>
                    <Typography variant='body1' style={{
                        color: theme.palette.text.primary,
                        marginLeft: '1rem',
                    }}>
                        <Link href={"https://webcontainers.io"} target='_blank' style={{
                            color: theme.palette.secondary.main,
                            textDecorationColor: theme.palette.secondary.main
                        }}>WebContainers</Link> - Powers the editor&apos;s live preview
                    </Typography>
                    <Typography variant='body1' style={{
                        color: theme.palette.text.primary,
                        marginLeft: '1rem',
                    }}>
                        <Link href={"https://microsoft.github.io/monaco-editor/"} target='_blank' style={{
                            color: theme.palette.secondary.main,
                            textDecorationColor: theme.palette.secondary.main
                        }}>Monaco</Link> - Powers the editor&apos;s code editor
                    </Typography>
                    <Typography variant='body1' style={{
                        color: theme.palette.text.primary,
                        marginLeft: '1rem',
                    }}>
                        <Link href={"http://xtermjs.org"} target='_blank' style={{
                            color: theme.palette.secondary.main,
                            textDecorationColor: theme.palette.secondary.main
                        }}>xTerm</Link> - Powers the editor&apos;s terminal interface
                    </Typography>
                </div>
                <div style={{
                    padding: '1rem',
                }}>
                    <Typography variant='h4' style={{
                        fontFamily: 'Teko',
                        color: theme.palette.text.primary,
                    }}>
                        Backend
                    </Typography>
                    <Typography variant='body1' style={{
                        color: theme.palette.text.primary,
                        marginLeft: '1rem',
                    }}>
                        <Link href={"https://fastapi.tiangolo.com"} target='_blank' style={{
                            color: theme.palette.secondary.main,
                            textDecorationColor: theme.palette.secondary.main
                        }}>Fastapi</Link> - Python Backend framework
                    </Typography>
                    <Typography variant='body1' style={{
                        color: theme.palette.text.primary,
                        marginLeft: '1rem',
                    }}>
                        <Link href={"https://www.mongodb.com"} target='_blank' style={{
                            color: theme.palette.secondary.main,
                            textDecorationColor: theme.palette.secondary.main
                        }}>MongoDB</Link> - Databases
                    </Typography>
                </div>
            </div>
        </Scrollbar>
        <div style={{
            backgroundColor: theme.palette.background.default,
            width: "650px",
            minWidth: "650px",
            height: "500px",
            margin: '2rem 1rem',
            borderRadius: '20px',
            // border: `3px solid ${theme.palette.background.default}`
            outline: `2px solid ${theme.palette.background.paper}`,
            outlineOffset: '-5px',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <PeopleIcon
                ref={userIconRef}
                style={{
                    position: 'absolute',
                    top: '25px',
                    left: '40px',
                    width: '75px',
                    height: '75px',
                    color: theme.palette.text.primary,
                    padding: '10px',
                }} />
            <Typography variant='h4' style={{
                fontFamily: 'Teko',
                color: theme.palette.text.primary,
                position: 'absolute',
                top: '100px',
                left: '60px',
                backgroundColor: theme.palette.background.default,
                zIndex: 1,
            }}>
                Users
            </Typography>
            {reactIconRef.current && userIconRef.current && (
                <Xarrow
                    start={userIconRef}
                    end={reactIconRef}
                    color={theme.palette.primary.main}
                    strokeWidth={3}
                    showHead={false}
                />
            )}
            <DevicesIcon
                ref={reactIconRef}
                style={{
                    position: 'absolute',
                    top: '25px',
                    left: '375px',
                    width: '75px',
                    height: '75px',
                    color: theme.palette.text.primary,
                    padding: '10px',
                }} />
            <Typography variant='h4'
                style={{
                    fontFamily: 'Teko',
                    color: theme.palette.text.primary,
                    position: 'absolute',
                    top: '100px',
                    left: '335px',
                    backgroundColor: theme.palette.background.default,
                    zIndex: 1,
                }}>
                Next.JS React App
            </Typography>
            {fastapiIconRef.current && reactIconRef.current && (
                <Xarrow
                    start={reactIconRef}
                    end={fastapiIconRef}
                    color={theme.palette.primary.main}
                    strokeWidth={3}
                    showHead={false}
                />
            )}
            {fastapiIconRef2.current && reactIconRef.current && (
                <Xarrow
                    start={reactIconRef}
                    end={fastapiIconRef2}
                    color={theme.palette.primary.main}
                    strokeWidth={3}
                    showHead={false}
                />
            )}
            {fastapiIconRef3.current && reactIconRef.current && (
                <Xarrow
                    start={reactIconRef}
                    end={fastapiIconRef3}
                    color={theme.palette.primary.main}
                    strokeWidth={3}
                    showHead={false}
                />
            )}
            {expressIconRef.current && reactIconRef.current && (
                <Xarrow
                    start={reactIconRef}
                    end={expressIconRef}
                    endAnchor={"top"}
                    color={theme.palette.primary.main}
                    strokeWidth={3}
                    showHead={false}
                />
            )}
            <BoltIcon
                ref={fastapiIconRef}
                style={{
                    position: 'absolute',
                    top: '175px',
                    left: '225px',
                    width: '75px',
                    height: '75px',
                    color: theme.palette.text.primary,
                    padding: '10px',
                }} />
            <Typography variant='h4'
                style={{
                    fontFamily: 'Teko',
                    color: theme.palette.text.primary,
                    position: 'absolute',
                    top: '255px',
                    left: '210px',
                    backgroundColor: theme.palette.background.default,
                    zIndex: 1,
                }}>
                Account API
            </Typography>
            {fastapiIconRef.current && fastapiIconRef2.current && (
                <Xarrow
                    start={fastapiIconRef}
                    end={fastapiIconRef2}
                    color={theme.palette.primary.main}
                    strokeWidth={3}
                    showHead={false}
                />
            )}
            <BoltIcon
                ref={fastapiIconRef2}
                style={{
                    position: 'absolute',
                    top: '175px',
                    left: '375px',
                    width: '75px',
                    height: '75px',
                    color: theme.palette.text.primary,
                    padding: '10px',
                }} />
            <Typography variant='h4'
                style={{
                    fontFamily: 'Teko',
                    color: theme.palette.text.primary,
                    position: 'absolute',
                    top: '255px',
                    left: '365px',
                    backgroundColor: theme.palette.background.default,
                    zIndex: 1,
                }}>
                Project API
            </Typography>
            <BoltIcon
                ref={fastapiIconRef3}
                style={{
                    position: 'absolute',
                    top: '175px',
                    left: '525px',
                    width: '75px',
                    height: '75px',
                    color: theme.palette.text.primary,
                    padding: '10px',
                }} />
            <Typography variant='h4'
                style={{
                    fontFamily: 'Teko',
                    color: theme.palette.text.primary,
                    position: 'absolute',
                    top: '255px',
                    left: '515px',
                    backgroundColor: theme.palette.background.default,
                    zIndex: 1,
                }}>
                My GPT API
            </Typography>
            {fastapiIconRef.current && reactIconRef.current && (
                <Xarrow
                    start={fastapiIconRef}
                    end={mongoIconRef}
                    color={theme.palette.primary.main}
                    strokeWidth={3}
                    showHead={false}
                />
            )}
            {fastapiIconRef2.current && reactIconRef.current && (
                <Xarrow
                    start={fastapiIconRef2}
                    end={mongoIconRef2}
                    color={theme.palette.primary.main}
                    strokeWidth={3}
                    showHead={false}
                />
            )}
            {fastapiIconRef3.current && reactIconRef.current && (
                <Xarrow
                    start={fastapiIconRef3}
                    end={gptIconRef}
                    color={theme.palette.primary.main}
                    strokeWidth={3}
                    showHead={false}
                />
            )}
            <SpaIcon
                ref={mongoIconRef}
                style={{
                    position: 'absolute',
                    top: '350px',
                    left: '225px',
                    width: '75px',
                    height: '75px',
                    color: theme.palette.text.primary,
                    padding: '10px',
                }} />
            <Typography variant='h4'
                style={{
                    fontFamily: 'Teko',
                    color: theme.palette.text.primary,
                    position: 'absolute',
                    top: '430px',
                    left: '215px',
                    backgroundColor: theme.palette.background.default,
                    zIndex: 1,
                }}>
                Account DB
            </Typography>
            <SpaIcon
                ref={mongoIconRef2}
                style={{
                    position: 'absolute',
                    top: '350px',
                    left: '375px',
                    width: '75px',
                    height: '75px',
                    color: theme.palette.text.primary,
                    padding: '10px',
                }} />
            <Typography variant='h4'
                style={{
                    fontFamily: 'Teko',
                    color: theme.palette.text.primary,
                    position: 'absolute',
                    top: '430px',
                    left: '370px',
                    backgroundColor: theme.palette.background.default,
                    zIndex: 1,
                }}>
                Project DB
            </Typography>
            <LanguageIcon
                ref={gptIconRef}
                style={{
                    position: 'absolute',
                    top: '350px',
                    left: '525px',
                    width: '75px',
                    height: '75px',
                    color: theme.palette.text.primary,
                    padding: '10px',
                }} />
            <Typography variant='h4'
                style={{
                    fontFamily: 'Teko',
                    color: theme.palette.text.primary,
                    position: 'absolute',
                    top: '430px',
                    left: '553px',
                    backgroundColor: theme.palette.background.default,
                    zIndex: 1,
                }}>
                GPT
            </Typography>
            <div style={{
                position: 'absolute',
                left: '1rem',
                bottom: '1rem',
                width: "150px",
                height: "235px",
                padding: '0.5rem',
                backgroundColor: theme.palette.background.paper,
                borderRadius: '10px',
            }}>
                <Typography variant='h4' style={{
                    fontFamily: 'Teko',
                    color: theme.palette.text.primary,
                }}>
                    Key
                </Typography>
                <Typography variant='body2' style={{
                    color: theme.palette.text.primary,
                    paddingBottom: "5px"
                }}>
                    <span style={{
                        color: theme.palette.secondary.main,
                        fontWeight: "bold"
                    }}>
                        Fastapi
                    </span>
                    <br />  - Account API
                    <br />  - Project API
                    <br />  - GPT interface API
                </Typography>
                <Typography variant='body2' style={{
                    color: theme.palette.text.primary,
                    paddingBottom: "5px"
                }}>
                    <span style={{
                        color: theme.palette.secondary.main,
                        fontWeight: "bold"
                    }}>
                        Express
                    </span>
                    <br />  - Image Proxy
                </Typography>
                <Typography variant='body2' style={{
                    color: theme.palette.text.primary,
                    paddingBottom: "5px"
                }}>
                    <span style={{
                        color: theme.palette.secondary.main,
                        fontWeight: "bold"
                    }}>
                        MongoDB
                    </span>
                    <br />  - Account DB
                    <br />  - Project DB
                </Typography>
            </div>
        </div>
    </>
    )
}

export default TechStackPanel
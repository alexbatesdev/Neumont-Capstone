import React from 'react';
import { useTheme } from '@mui/material/styles'; // Import useTheme from Material-UI
import { EditorContext } from '@/contexts/editor-context';
import FileStructureNode from './fileNode';
import { Typography } from '@mui/material';



const FileTreeDisplay = () => {
    const theme = useTheme();
    const { files, setFiles } = React.useContext(EditorContext);

    const filez = {
        'src': {
            directory: {
                'newFolder': {
                    directory: {
                        'newFile.js': {
                            file: {
                                contents: "blah blah blah"
                            }
                        },
                        'newFile2.js': {
                            file: {
                                contents: "blah blah blah"
                            }
                        },
                    }
                },
                'index.js': {
                    file: {
                        contents: "blah blah blah"
                    }
                },
                'App.js': {
                    file: {
                        contents: "blah blah blah"
                    }
                },
            }
        }
    }
    console.log(files)


    return (
        <div style={{
            width: '100%',
            height: '100%',
            // backgroundColor: "red",
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            // filter: "opacity(0.5)"
        }}>
            <Typography sx={{
                width: '100%',
                height: '20px',
                marginBottom: '10px',
                paddingLeft: '10px',
                paddingTop: '5px',
                paddingBottom: '10px',
                backgroundColor: theme.palette.background.default,
                filter: "brightness(1.3)"
            }}>
                File Explorer - {"Project Name"}
            </Typography>
            {Object.keys(files).map((key, index) => {
                const node = {
                    [key]: files[key]
                }
                return (
                    <>
                        <FileStructureNode currentNodeTree={node} path={"./" + key} />
                    </>
                );
            })}
        </div>
    );
}

export default FileTreeDisplay;

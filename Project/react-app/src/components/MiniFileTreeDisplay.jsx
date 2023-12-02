import React from 'react';
import { Collapse, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles'; // Import useTheme from Material-UI
import RefreshIcon from '@mui/icons-material/Refresh';

import LoadingDisplay from './LoadingDisplay';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import { Scrollbar } from 'react-scrollbars-custom';

const MiniFileTreeDisplay = ({ files }) => {
    const theme = useTheme();

    if (!files) {
        return null
    }

    let fileKeys = Object.keys(files)
    let fileKeys_folders = []
    let fileKeys_files = []

    fileKeys.forEach((key, index) => {
        const node = files[key];

        if (node.hasOwnProperty('directory')) {
            fileKeys_folders.push(key)
        } else {
            fileKeys_files.push(key)
        }
    })

    // sort the keys alphabetically
    fileKeys_folders = fileKeys_folders.sort((a, b) => {
        return a.localeCompare(b)
    })

    fileKeys_files = fileKeys_files.sort((a, b) => {
        return a.localeCompare(b)
    })

    fileKeys = fileKeys_folders.concat(fileKeys_files)

    const outerWrapperStyle = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    }

    return (<Scrollbar style={outerWrapperStyle}>
        {fileKeys.map((key, index) => {
            const node = files[key];
            return (<MiniFileStructureNode key={key + "-kebab-" + index} currentNodeTree={node} displayName={key} />)
        })}
    </Scrollbar>)
};

const MiniFileStructureNode = ({ currentNodeTree, displayName, depth = 0 }) => {
    const theme = useTheme();
    const [expanded, setExpanded] = React.useState(false);
    const [isHovered, setIsHovered] = React.useState(false);

    const typographyStyle = {
        userSelect: 'none',
    }

    const rowStyle = {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: '5px',
        backgroundColor: (isHovered) ? theme.palette.background.paper : 'transparent',
        paddingLeft: `${(depth * 10) + 10}px`,
        width: `calc(100% - ${(depth * 10) + 10}px)`,
        paddingTop: '3px',
        paddingBottom: '3px',
        position: 'relative',
    }

    if (currentNodeTree.hasOwnProperty('directory')) {
        currentNodeTree = currentNodeTree.directory
        return (<>
            <div
                style={rowStyle}
                onClick={() => setExpanded(!expanded)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Typography
                    variant='body1'
                    sx={typographyStyle}
                    color={theme.palette.text.primary}
                >
                    {displayName}
                </Typography>
                {expanded ? <ExpandLess /> : <ExpandMore />}
            </div>
            <Collapse in={expanded} timeout="auto" unmountOnExit sx={{ width: "100%" }}>
                {Object.keys(currentNodeTree).map((key, index) => {
                    return (<MiniFileStructureNode key={key + "-kebab-" + index} currentNodeTree={currentNodeTree} displayName={key} depth={depth + 1} />)
                })}
            </Collapse>
        </>)
    } else {
        return (<>
            <div style={rowStyle}
                onClick={() => setExpanded(!expanded)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <Typography
                    variant='body1'
                    sx={typographyStyle}
                    color={theme.palette.text.primary}
                    onClick={() => setExpanded(!expanded)}
                >
                    {displayName}
                </Typography>
            </div>
        </>)
    }
}

export default MiniFileTreeDisplay;
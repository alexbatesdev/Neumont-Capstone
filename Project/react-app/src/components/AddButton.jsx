import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@emotion/react';
import { Stack, TextField } from '@mui/material';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';
import AddNodePrompt from './AddNodePrompt';

export default function AddButton({ isHovered = true, path }) {
    const theme = useTheme();
    const [isOpen, setisOpen] = React.useState(false);
    const [fileName, setFileName] = React.useState();

    return (<>
        <AddIcon
            onMouseEnter={(event) => {
                let target = event.target;

                target.style.animation = 'rotatePLUS 0.3s ease-out';
                setTimeout(() => {
                    target.style.animation = '';
                }, 300);
            }}
            onClick={(event) => {
                event.stopPropagation();
                if (isOpen) {
                    document.removeEventListener('click', () => setisOpen(false));
                }
                else {
                    document.addEventListener('click', () => setisOpen(false));
                }
                setisOpen(!isOpen);
                //console.log(path)
            }}
            sx={{
                color: isHovered ? theme.palette.utilBar.icons : 'transparent',
                cursor: 'pointer',

            }} />
        <AddNodePrompt path={path} isOpen={isOpen} setIsOpen={setisOpen} />
    </>)
}
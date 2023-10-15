import React from 'react';
import CodeIcon from '@mui/icons-material/Code';
import DataObjectIcon from '@mui/icons-material/DataObject';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import ImageIcon from '@mui/icons-material/Image';
import { Css, Folder, FolderOpen, Html, Javascript, JavascriptSharp, } from '@mui/icons-material';
import FolderSharedRoundedIcon from '@mui/icons-material/FolderSharedRounded';
import FolderSpecialIcon from '@mui/icons-material/FolderSpecial';
import SnippetFolderIcon from '@mui/icons-material/SnippetFolder';
import FolderZipIcon from '@mui/icons-material/FolderZip';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import HandymanIcon from '@mui/icons-material/Handyman';
import GitHubIcon from '@mui/icons-material/GitHub';

export const FileNodeIcon = ({ filename, isFolder = false, isOpen = false }) => {
    if (isOpen) {
        return <FolderOpen />;
    }

    if (isFolder) {
        switch (filename) {
            case 'src':
                return <FolderSpecialIcon />;
            case 'public':
                return <FolderSharedRoundedIcon />;
            case 'node_modules':
                return <SnippetFolderIcon />;
            case 'util':
                return <HandymanIcon />;
            case 'utils':
                return <HandymanIcon />;
            case 'components':
                return <SnippetFolderIcon />;
            case 'pages':
                return <SnippetFolderIcon />;
            case '.git':
                return <GitHubIcon />;
            case 'images':
                return <PermMediaIcon />;
            case 'img':
                return <PermMediaIcon />;
            case 'assets':
                return <PermMediaIcon />;
            case 'media':
                return <PermMediaIcon />;
            case 'videos':
                return <PermMediaIcon />;
            case 'audio':
                return <PermMediaIcon />;
            case 'res':
                return <PermMediaIcon />;
            case 'resources':
                return <PermMediaIcon />;
            case 'styles':
                return <PermMediaIcon />;
            case 'stylesheets':
                return <PermMediaIcon />;
            case 'css':
                return <Css />;
            case 'html':
                return <Html />;
            case 'js':
                return <Javascript />;
            default:
                return <Folder />;
        }
    }
    const extension = filename.split('.').pop();
    switch (extension) {
        case 'js':
            return <Javascript />;
        case 'jsx':
            return <JavascriptSharp />;
        case 'html':
            return <Html />;
        case 'css':
            return <Css />;
        case 'json':
            return <DataObjectIcon />;
        case 'txt':
            return <FormatAlignJustifyIcon />;
        case 'md':
            return <FormatAlignLeftIcon />;
        case 'zip':
            return <FolderZipIcon />;
        case '.gitignore':
            return <GitHubIcon />;
        //Media Files
        case 'png':
            return <ImageIcon />;
        case 'jpg':
            return <ImageIcon />;
        case 'jpeg':
            return <ImageIcon />;
        case 'gif':
            return <ImageIcon />;
        case 'svg':
            return <ImageIcon />;
        case 'mp4':
            return <ImageIcon />;
        case 'mp3':
            return <ImageIcon />;
        case 'wav':
            return <ImageIcon />;
        default:
            return <CodeIcon />;
    }
}
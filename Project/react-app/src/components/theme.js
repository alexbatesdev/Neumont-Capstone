import { createTheme, ThemeProvider } from '@mui/material'

export const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#3fb59b',
        },
        secondary: {
            main: '#8d7eff',
        },
        tertiary: {
            main: '#364ee0',
        },
        background: {
            default: '#0F091A',
            paper: '#211643',
        },
        divider: {
            default: 'rgba(255, 200, 255, 0.12)',
            secondary: '#493566'
        }
    },
})
import { createTheme, PaletteMode, StyledEngineProvider, ThemeProvider } from '@mui/material';
import { amber, deepOrange, deepPurple, grey } from '@mui/material/colors';
import { SnackbarProvider } from 'notistack';
import React, { FC, ReactNode } from 'react';

export const ColorModeContext = React.createContext({ toggleColorMode: () => { } });

const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
        mode,
        ...(mode === 'light'
            ? {
                // palette values for light mode
                primary: amber,
                divider: amber[200],
                text: {
                    primary: grey[900],
                    secondary: grey[800],
                },
            }
            : {
                // palette values for dark mode
                primary: deepOrange,
                divider: deepOrange[700],
                background: {
                    default: deepOrange[900],
                    paper: deepOrange[900],
                },
                text: {
                    primary: '#fff',
                    secondary: grey[500],
                },
            }),
    },
});

export default function ToggleColorMode() {
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        [],
    );
}

export const Theme: FC<{ children: ReactNode }> = ({ children }) => {
    const [mode, setMode] = React.useState<PaletteMode>('light');
    const colorMode = React.useMemo(
        () => ({
            // The dark mode switch would invoke this method
            toggleColorMode: () => {
                setMode((prevMode: PaletteMode) =>
                    prevMode === 'light' ? 'dark' : 'light',
                );
            },
        }),
        [],
    );

    // Update the theme only if the mode changes
    const theme = React.useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
    return (
        <StyledEngineProvider injectFirst>
            <ColorModeContext.Provider value={colorMode}>

                <ThemeProvider theme={theme}>
                    <SnackbarProvider>{children}</SnackbarProvider>
                </ThemeProvider>
            </ColorModeContext.Provider>

        </StyledEngineProvider>
    );
};

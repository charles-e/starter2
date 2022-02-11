import React, { FC } from 'react';
import { AppBar, Container, Grid, Toolbar, Typography } from '@mui/material';
import {  WalletMultiButton } from './wallet-impl/material-ui';

export const AppHeaderBar: FC = () => {
    return (
        <AppBar>
            <Toolbar>
            <Grid container alignContent="flex-start">
            <Typography>My Fancy Safecoin App</Typography>
            </Grid>
        <Grid container alignContent="flex-end">
            <WalletMultiButton />
            </Grid>
            </Toolbar>
        </AppBar>
    )
};

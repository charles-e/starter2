
import { Cluster, clusterApiUrl, Connection, Keypair, PublicKey } from '@safecoin/web3.js';
import { useSnackbar } from 'notistack';
import React, { FC, ReactChild, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Theme } from '../Theme';
import AppHeaderBar from '../AppHeaderBar';
import { Button, Container, CssBaseline, Drawer, Grid, Link, Paper, Stack, styled, Typography } from '@mui/material';

import { DrawerCtx } from './DrawerCtx';
import { TokenCtx } from '../tokens/TokenCtx';
import { TokenMeta } from '../tokens/TokenMeta';
import { useConnection, useWallet } from '@/wallet-impl/wallet-adapter-react';
import { mintExisting } from '@/utils/tokens';
import { WalletAdapter } from '@/wallet-impl/abstract-wallet';
import { useSendTransaction } from '@/utils/notifications';

 export default function TokenDrawer() {
    const { connected , wallet } = useWallet();
    const { visible, setVisible } = useContext(DrawerCtx);
    const { availableTokens } = useContext(TokenCtx);
    const { endpoint, connection } = useConnection();
    const [sendTransaction] = useSendTransaction();
    console.log(endpoint);
    const possibleTokens = availableTokens(endpoint as Cluster);
    console.log(possibleTokens);
    const hideIt = () => {
      setVisible(false);
    }
    async function mintFunToken (
        connection : Connection,
        wallet : WalletAdapter,
        mint : PublicKey,
        authority : string,
        targetAccount : PublicKey,
        decimals : number
      )  {
          console.log('hello');
        const file = await import(/* @vite-ignore */ `/src/resource/keys/${authority}.json`);
        const response = await fetch(file.default);
        const text = await response.text();
        const auth = Keypair.fromSecretKey(Buffer.from(text));
        const sig = await mintExisting({
          connection: connection,
          wallet: wallet,
          mintAuth: auth,
          mint: mint,          
          targetAccount: targetAccount,
          amount: Math.pow(10, decimals) * 100,
        });
        if (sig){
           sendTransaction(sig, { onSuccess:()=>{}, onError:()=>{}}) ;
        }
      }
      
    const TokenCell = (token :TokenMeta,n :number) => {
      let [sendTransaction, sending] = useSendTransaction();

      let hasButton = token.hasFaucet && connected;
      console.log(hasButton)
      return (
        <Grid  className="centered" key={n} xs={2} item>
          <Typography variant="h6" component="div">
            {token.nick}
            </Typography>
            <Typography variant="body1" component="div">
            Sponsor: {token.org}
            </Typography>
          {hasButton && (<Button variant="contained"
          onClick={()=>{
              mintFunToken(connection,
          wallet,
          token.address,
          token.authority,
          wallet?.adapter.publicKey,
          token.decimals)}}>Get Tokens</Button>)}
        </Grid>
      );
    }
  
    const GridGuts = (tokens: TokenMeta[]) => {
      return tokens.map((tok, i) => TokenCell(tok, i));
    }
    return (
      <Drawer sx={{padding:'1em'}} className="drawermargin" onClick={hideIt} hideBackdrop={true} 
      anchor="bottom" open={visible}>
        <Typography variant="h5">Available Tokens:</Typography>
        <Grid container spacing={1}  columns={{ xs: 4, sm: 8, md: 12 }}>
        { GridGuts(possibleTokens) }
        </Grid>
  
      </Drawer>
    )
  }


import { Cluster, clusterApiUrl, Connection, Keypair, PublicKey, PublicKeyInitData } from '@safecoin/web3.js';
import React, { FC, ReactChild, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Button, Container, CssBaseline, Drawer, Grid, Link, Paper, Stack, styled, Typography } from '@mui/material';

import { DrawerCtx } from './DrawerCtx';
import { TokenCtx } from '../tokens/TokenCtx';
import { TokenMeta } from '../tokens/TokenMeta';
import { useConnection, useWallet } from '@/wallet-impl/wallet-adapter-react';
import { mintExisting } from '@/utils/tokens/index';
import { getOwnedTokenAccountInfo } from '@/utils/tokens/util';
import { WalletAdapter } from '@/wallet-impl/abstract-wallet';
import { useSendTransaction } from '@/utils/notifications';
import { stringify } from 'querystring';
type TokenMapType = {
  [id: string]: TBD;
}

type TBD = {
  mint?: PublicKey,
  balance?: BigInt,
  hasFaucet: boolean,
  hasWallet: boolean,
  nick?: string,
  decimals?: number,
  authority?: PublicKey,
  address?: PublicKey,
  org?: string
}
export default function TokenDrawer() {
  const { connected, wallet } = useWallet();
  const { visible, setVisible } = useContext(DrawerCtx);
  const { availableTokens } = useContext(TokenCtx);
  const { endpoint, connection } = useConnection();
  const [sendTransaction] = useSendTransaction();
  console.log(endpoint);
  const possibleTokens = availableTokens(endpoint as Cluster);
  console.log(possibleTokens);
  const [tokenBalances, setTokenBalances] = useState<Map<string, TBD> | null>(null);
  const hideIt = () => {
    setVisible(false);
  }
  async function mintFunToken(
    connection: Connection,
    wallet: WalletAdapter,
    mint: PublicKey,
    authority: string,
    targetAccount: PublicKey,
    decimals: number
  ) {
    if (wallet.publicKey) {
      const file = await import(/* @vite-ignore */ `/src/resource/keys/${authority}.json`);
      const response = await fetch(file.default);
      const text = await response.text();
      const auth = Keypair.fromSecretKey(Buffer.from(text));
      const sig = mintExisting({
        connection: connection,
        wallet: wallet!.publicKey,
        mintAuth: auth,
        mint: mint,
        targetAccount: targetAccount,
        amount: Math.pow(10, decimals) * 100,
      });
      if (sig) {
        sendTransaction(sig);
      }
    }
  }

  useEffect(() => {
    const getWalletData = async () => {
      if (connection && wallet && wallet.adapter && visible) {
        const ownerKey = wallet.adapter.publicKey;
        const ownedMap: Map<string, TBD> = new Map();
        if (ownerKey) {
          console.log(ownerKey.toBase58());
          const infos = await getOwnedTokenAccountInfo(connection, ownerKey);
          if (infos && infos.length > 0) {
            infos.map((i) => {
              const quantData = i.amount.toBuffer();
              const quantBI = quantData.readBigUInt64LE(0);
              /*const logData = {
                mint: i.mint.toBase58(),
                wallet: i.address.toBase58(),
                quant: quantBI
              }
              console.log(logData);*/
              const tbd: Partial<TBD> = {
                balance: quantBI,
                mint: i.mint,
                hasWallet: true,
                address: i.address,
              }
              ownedMap.set(i.mint.toBase58(), tbd as TBD);
            });
          }
          let all: TBD[] = await possibleTokens.map((tok) => {
            let exists = ownedMap.get(tok.address.toBase58());
            if (exists) {
              exists.hasFaucet = tok.hasFaucet;
              exists.nick = tok!.nick;
              if (tok.authority) {
                try {
                exists.authority = new PublicKey(tok.authority);
                } catch(e : any){
                  console.log(`error with auth ${tok.authority}`);
                }
              }
              if (tok.org) {
                exists.org = tok.org;
              }
              return exists;
            }
            else {
              return {
                mint: tok.address,
                hasWallet: false,
                hasFaucet: tok.hasFaucet,
                balance: BigInt(0),
                decimals: tok.decimals,
                nick: tok.nick,
                org: tok.org
              }
            }
          });
          const retMap: Map<string, TBD> = new Map();
          for (const a in all) {
            const info = all[a];
            if (info.mint) {
              retMap.set(info.mint.toBase58(), info);
            }
          }
          setTokenBalances(retMap);
          console.log(retMap);
        }
      }
    };
    getWalletData();
  }, [connection, wallet]);
  const TokenCell = (token: TBD, n: number) => {

    let hasButton = token.hasFaucet && connected && connection;
    const tokAddr = token.mint;
    const tokAuth = token.authority;
    const pubKey = wallet?.adapter.publicKey;
    const biBalance = token.balance as bigint;
    const dispBalance = formatToDec(biBalance || 0n,token.decimals);
    return (
      <Grid className="centered" key={n} xs={2} item>
        <Typography variant="h6" component="div">
          {token.nick}
        </Typography>
        <Typography variant="body1" component="div">
          Sponsor: {token.org}
        </Typography>
        <Typography variant="body1" component="div">
          Balance: {dispBalance.toLocaleString()}
        </Typography>
        {hasButton && connection
          && wallet && wallet.adapter
          && tokAddr && tokAuth
          && pubKey &&
          (<Button variant="contained"
            onClick={() => {
              mintFunToken(connection,
                wallet!.adapter,
                tokAddr,
                tokAuth.toBase58(),
                pubKey,
                token.decimals || 9)
            }}>Get Tokens</Button>)}
      </Grid>
    );
  }

  const GridGuts = (tokens?: Map<string, TBD>| null) => {
    if (!tokens) { return (<div/>); }
    else {
      const data = Array.from(tokens.values());
      console.log(data);
      return data.map((tok, i) => TokenCell(tok, i));
    }
  }
  return (
    <Drawer sx={{ padding: '1em' }} className="drawermargin" onClick={hideIt} hideBackdrop={true}
      anchor="bottom" open={visible}>
      <Typography variant="h5">Available Tokens:</Typography>
      <Grid container spacing={1} columns={{ xs: 4, sm: 8, md: 12 }}>
        {GridGuts(tokenBalances)}
      </Grid>

    </Drawer>
  )
}

const formatToDec = (val: bigint, dec: number = 9) : bigint => {
  const biDiv : bigint = BigInt(Math.pow(10,dec));
  return val / biDiv;
}

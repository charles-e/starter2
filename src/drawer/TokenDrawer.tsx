
import { Cluster, Connection, Keypair, PublicKey, PublicKeyInitData, Signer, Transaction, TransactionSignature } from '@safecoin/web3.js';
import React, { FC, ReactChild, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { Button, Container, SwipeableDrawer, Grid, Link, Paper, Stack, styled, Tooltip, Typography, useTheme, Box } from '@mui/material';

import { DrawerCtx } from './DrawerCtx';
import { TokenCtx } from '../tokens/TokenCtx';
import { useConnection, useWallet } from '@/wallet-impl/wallet-adapter-react';
import { formatTwoDecimals, getOwnedTokenAccountInfo } from '@/utils/tokens/util';
import { SignerWalletAdapter, WalletAdapter } from '@/wallet-impl/abstract-wallet';
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token, TOKEN_PROGRAM_ID } from '@safecoin/safe-token';
import { mintTo } from '@/utils/tokens/instructions';
import { AccountDataSize } from '../utils/tokens/data';
import boss from '../resource/keys/boss.json';
import { AirDropDialog } from './AirDropDialog';
import { useVerifyTransaction } from '@/utils/notifications2';
import { createAssociatedTokenAccountInstruction } from '@/utils/tokens/tsInstructions';
import { useBalance } from '@/utils/BalanceProvider';

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
  authority?: string,
  wallet?: PublicKey,
  org?: string
}
export default function TokenDrawer() {
  const theme = useTheme();
  const [txCount, setTxCount] = useState(0); // bumped for each "transaction": will cause useEffect to fire
  const [balance, setBalance] = useBalance();
  const [openADD, setOpenADD] = useState(false);
  const { connected, wallet } = useWallet();
  const { visible, setVisible } = useContext(DrawerCtx);
  const { availableTokens } = useContext(TokenCtx);
  const { endpoint, connection } = useConnection();
  const [verifyTransaction] = useVerifyTransaction();
  const possibleTokens = availableTokens(endpoint as Cluster);
  const [tokenBalances, setTokenBalances] = useState<Map<string, TBD> | null>(null);
  const hideIt = () => {
    setVisible(false);
  }

  const updateBalance = async (sig: TransactionSignature) => {
    if (wallet && wallet.adapter && wallet.adapter.publicKey) {
      console.log('fetching balance...');
      let wbNum = await connection?.getBalance(wallet.adapter.publicKey);
      console.log(`balance is ${wbNum} lamports`);
      setBalance(BigInt(wbNum || 0) as bigint);
    }
    return sig;
  }

  function getAuthKeyPair(): Keypair {
    // this doesnt work:
    // const file = await import(/* @vite-ignore */ `/src/resource/keys/${authority}.json`);
    // const response = await fetch(file.default);
    // const text = await response.text();
    // console.log(text);
    // const auth = Keypair.fromSecretKey(Buffer.from(text));
    return Keypair.fromSecretKey(Buffer.from(boss));
  }

  // mint the token to the user's wallet.  If necessary, create the wallet.
  async function mintTokenToWallet(params: {
    connection: Connection,
    wallet: SignerWalletAdapter,
    mint: PublicKey,
    authority: string,
    targetAccount: PublicKey | null,
    decimals: number
  }
  ) {

    if (balance < 1000n) {
      setOpenADD(true);
      return;
    }
    const { wallet, connection, mint, authority, decimals } = params;
    let { targetAccount } = params;
    if (!wallet.publicKey) {
      throw ('no wallet public key');
    }

    if (wallet.publicKey) {
      //
      // Using the keypair that created the mint in order
      // to send free tokens.  So yes, we have a keypair json file 
      // embedded in the app and this is very not secure.  But token
      // fountains should/will only exist on test/dev clusters. 
      //
      const auth = getAuthKeyPair();

      let transaction = new Transaction();
      let signers: Signer[] = [];

      if (!targetAccount) {

        // creating the token wallet is necessary so its in the same transaction=
        // with the token mint instruction.

        targetAccount = await Token.getAssociatedTokenAddress(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TOKEN_PROGRAM_ID,
          mint,
          wallet.publicKey);

        const minRent = await connection.getMinimumBalanceForRentExemption(
          AccountDataSize()
        );
        let ix = createAssociatedTokenAccountInstruction(
          {
            associatedProgramId: ASSOCIATED_TOKEN_PROGRAM_ID,
            programId: TOKEN_PROGRAM_ID,
            associatedAccount: targetAccount,
            payer: wallet.publicKey,
            owner: wallet.publicKey,
            mint: mint,
          }
        );
        for (const i in ix) {
          transaction.add(ix[i]);
        }
      }
      transaction.add(
        mintTo({
          mint: mint,
          destination: targetAccount,
          amount: Math.pow(10, decimals) * 100,
          mintAuthority: auth.publicKey,
        }),
      );
      transaction.recentBlockhash = (await connection.getRecentBlockhash()).blockhash;
      transaction.feePayer = wallet.publicKey;
      transaction.partialSign(auth);
      transaction = await wallet.signTransaction(transaction);
      let buffer = transaction.serialize();
      const sig = connection.sendRawTransaction(buffer);
      if (sig) {
        await verifyTransaction(sig, { onSuccess: updateBalance });
        setTxCount(txCount + 1);
      }
    }
  }

  // pull and aggregate necessary token data, (balances, addresses etc)
  useEffect(() => {
    const getWalletData = async () => {
      console.log(`getWalletData v: ${visible} c: ${connection} w ${wallet?.adapter}`);
      if (connection && wallet && wallet.adapter && visible) {
        const ownerKey = wallet.adapter.publicKey;
        console.log(`ownerKey ${ownerKey?.toBase58()}`);
        const ownedMap: Map<string, TBD> = new Map();
        if (ownerKey) {
          console.log(ownerKey.toBase58());
          const infos = await getOwnedTokenAccountInfo(connection, ownerKey);
          if (infos && infos.length > 0) {
            infos.map((i) => {
              const quantData = i.amount.toBuffer();
              const quantBI = quantData.readBigUInt64LE(0);
              const tbd: Partial<TBD> = {
                balance: quantBI,
                mint: i.mint,
                hasWallet: true,
                wallet: i.address,
              }
              ownedMap.set(i.mint.toBase58(), tbd as TBD);
            });
          }
          console.log(`have ${possibleTokens.length} possible tokens.`);
          let all: TBD[] = await possibleTokens.map((tok) => {
            let exists = ownedMap.get(tok.address.toBase58());
            if (exists) {
              exists.hasFaucet = tok.hasFaucet;
              exists.nick = tok!.nick;
              if (tok.authority) {
                exists.authority = tok.authority;
              }

              if (tok.org) {
                exists.org = tok.org;
              }

              exists.decimals = tok.decimals;

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
                org: tok.org,
                authority: tok.authority
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
          console.log(`returning ${retMap.size} tokens`);
          setTokenBalances(retMap);
        }
      }
    };
    getWalletData();
  }, [connection, wallet?.readyState, visible, txCount]);

  // keep track of the SAFE balance
  useEffect(() => {
    async function fetchBalance() {

      if (wallet && wallet.adapter && wallet.adapter.publicKey) {
        let walletBalance = await connection?.getBalance(wallet.adapter.publicKey);
        let biBal = BigInt(walletBalance || 0n);
        console.log(`drawer balance is ${biBal.toLocaleString()}`);
        setBalance(biBal);
      }
    }
    fetchBalance();
  }, [connection, wallet?.readyState, visible, txCount]);

  const TokenCell = (token: TBD, n: number) => {
    const tokAddr = token.mint;
    const tokAuth = token.authority;
    const pubKey = token.wallet;
    const hasButton = token.hasFaucet && connection != null && connected
      && undefined !== tokAddr && undefined !== tokAuth;
    console.log(`TokenCell hasButton ${hasButton}`)
    if (!hasButton) {
      console.log({ "pubkey": pubKey, "tokAuth": tokAuth, "tokAddr": tokAddr })
    }
    const biBalance = token.balance as bigint;
    const dispBalance = formatTwoDecimals(biBalance || 0n, token.decimals);
    return (
      <Grid className="centered" key={n} xs={2} item>
        <Paper sx={{padding: theme.spacing(1)}}>
        <Typography variant="h6" component="div">
          {token.nick}
        </Typography>
        <Typography variant="body1" component="div">
          Sponsor: {token.org}
        </Typography>
        <Typography variant="body1" component="div">
          Balance: {dispBalance.toLocaleString()}
        </Typography>
        {hasButton &&
          (<Button variant="contained"
            onClick={() => {
              mintTokenToWallet(
                {
                  connection: connection!,
                  wallet: wallet!.adapter as SignerWalletAdapter,
                  mint: tokAddr!,
                  authority: tokAuth,
                  targetAccount: token.hasWallet ? pubKey! : null,
                  decimals: token.decimals || 9
                })
            }
            }>Get Tokens</Button>)}
                  </Paper>

      </Grid>
    );
  }

  const GridGuts = (tokens?: Map<string, TBD> | null) => {
    if (!tokens) { return (<div />); }
    else {
      const data = Array.from(tokens.values());
      console.log(`GridGuts: ${data}`);
      return data.map((tok, i) => TokenCell(tok, i));
    }
  }


  const handleCloseADD = () => {
    setOpenADD(false);
    setTxCount(txCount + 1);
  };
  const toggleDrawer = (onOff: boolean)=>{
    setVisible(onOff);
  }
  const myColor = theme.palette.secondary;
  return (
    <SwipeableDrawer sx={{ padding: '1em' }} className="drawermargin" 
      onClose={() => { setVisible(false) }} onOpen={() => { setVisible(true) }}
      anchor="bottom" open={visible}>
      <Box
        sx={{ width: '100%' }}
        role="presentation"
        onKeyDown={hideIt}
      >
        <Tooltip title="Click to Hide">
          <Container sx={{ width: "auto" }} onClick={hideIt}>
            <Typography variant="h5">Available Tokens:</Typography>
          </Container>
        </Tooltip>

        <Grid container spacing={1} columns={{ xs: 4, sm: 8, md: 12 }}>
          {GridGuts(tokenBalances)}
        </Grid>
      </Box>
      <AirDropDialog open={openADD} onClose={handleCloseADD}> </AirDropDialog>

    </SwipeableDrawer>
  )
}


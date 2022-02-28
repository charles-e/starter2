import { WalletAdapterNetwork, WalletError } from './wallet-impl/abstract-wallet';
import { WalletDialogProvider } from './wallet-impl/material-ui'
import { ConnectionProvider, useConnection, useWallet, WalletProvider, ConnectContext } from './wallet-impl/wallet-adapter-react';
import {
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  SafecoinWalletAdapter,
} from './wallet-impl/wallets';
import { clusterApiUrl } from '@safecoin/web3.js';
import { useSnackbar } from 'notistack';
import React, { FC, ReactChild, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Theme } from './Theme';
import AppHeaderBar from './AppHeaderBar';
import { Container, CssBaseline, Link, Paper, Stack, styled } from '@mui/material';
import { DrawerProvider } from './drawer/DrawerProvider';
import { TokenMetaProvider } from './tokens/TokenMetaProvider';
import TokenDrawer from './drawer/TokenDrawer';
import { formatTwoDecimals } from './utils/tokens/util';

export const App: FC = () => {
  return (
    <Theme>
      <CoinContext>
        <Content />
      </CoinContext>
    </Theme>
  );
};

const CoinContext: FC<{ children: ReactNode }> = ({ children }) => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new SafecoinWalletAdapter({ network }),

      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  const { enqueueSnackbar } = useSnackbar();
  const onError = useCallback(
    (error: WalletError) => {
      enqueueSnackbar(error.message ? `${error.name}: ${error.message}` : error.name, { variant: 'error' });
      console.error(error);
    },
    [enqueueSnackbar]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletDialogProvider>{children}</WalletDialogProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  margin: 'auto'
}));

const MiddleStack = styled(Stack)(({ theme }) => ({
  margin: 'auto',
  padding: '30%',
  alignItems: 'center',
  justifyContent: 'center',
}));

const Content: FC = () => {
  const { wallet, connected } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState(0n);
  useEffect(() => {
    async function fetchBalance() {
      console.log("check wallet...")
      console.log(`wallet ${wallet}`);
      console.log(`adapter ${wallet?.adapter}`);
      console.log(`key ${wallet?.adapter?.publicKey?.toBase58()}`);
      if (wallet && wallet.adapter && wallet.adapter.publicKey) {
        console.log('fetching balance...');
        let wbNum = await connection?.getBalance(wallet.adapter.publicKey);
        console.log(`balance is ${wbNum} lamports`);
        setBalance(BigInt(wbNum || 0));
      }
    }
    fetchBalance();
  }, [wallet?.adapter.connected])
  return (
    <>
      <CssBaseline />
      <TokenMetaProvider>
        <DrawerProvider>
          <AppHeaderBar />
          <Container>
            <MiddleStack maxWidth="sm" >
              {connected ? (
                <><Item>Connected</Item><Item>Wallet Balance: {formatTwoDecimals(balance)}</Item></>
              ) :
                (
                  <><Item>
                    wallet not connected :(
                  </Item>
                    <Item><Link >REAMDE</Link></Item></>
                )}
            </MiddleStack>
            <TokenDrawer />
          </Container>
        </DrawerProvider>
      </TokenMetaProvider>

    </>);
};
/*
let MyDrawer = () => {
  const { connected } = useWallet();
  const { visible, setVisible } = useContext(DrawerCtx);
  const { availableTokens } = useContext(TokenCtx);
  const { endpoint } = useConnection();
  console.log(endpoint);
  const possibleTokens = availableTokens(endpoint as Cluster);
  console.log(possibleTokens);
  const hideIt = () => {
    setVisible(false);
  }
  const TokenCell = (token :TokenMeta,n :number) => {
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
        {hasButton && (<Button variant="contained">Get Tokens</Button>)}
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
}*/


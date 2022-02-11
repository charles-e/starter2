import { WalletAdapterNetwork, WalletError } from './wallet-impl/abstract-wallet';
import { WalletDialogProvider, WalletMultiButton } from './wallet-impl/material-ui'
import { ConnectionProvider, useConnection, useWallet, WalletProvider } from './wallet-impl/wallet-adapter-react';
import {
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  SafecoinWalletAdapter,
} from './wallet-impl/wallets';
import { clusterApiUrl } from '@safecoin/web3.js';
import { useSnackbar } from 'notistack';
import React, { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Theme } from './Theme';
import { AppHeaderBar } from './AppHeaderBar';
import ButtonAppBar from './ButtonAppBar';
import { Box, Container, CssBaseline, Paper, Stack, styled } from '@mui/material';

export const App: FC = () => {
  return (
    <Theme>
      <Context>
        <Content />
      </Context>
    </Theme>
  );
};

const Context: FC<{ children: ReactNode }> = ({ children }) => {
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
  const [balance, setBalance] = useState(undefined as any);
  useEffect(() => {
    async function fetchBalance() {
      console.log("check wallet...")
      console.log(`wallet ${wallet}`);
      console.log(`adapter ${wallet?.adapter}`);
      console.log(`key ${wallet?.adapter?.publicKey?.toBase58()}`);
      if (wallet && wallet.adapter && wallet.adapter.publicKey) {
        console.log('fetching balance...');
        let walletBalance = await connection.getBalance(wallet.adapter.publicKey);
        console.log(`balance is ${walletBalance}`);
        setBalance(walletBalance);
      }
    }
    fetchBalance();
  }, [wallet?.adapter.connected])
  return (
    <>
      <CssBaseline />

      <ButtonAppBar />
      <MiddleStack maxWidth="sm" >
        {connected ? (
          <><Item>Connected</Item><Item>Wallet Balance: {balance}</Item></>
        ) :
          (
            <Item>
              wallet not connected :(
            </Item>
          )}
      </MiddleStack>
    </>);
};

import { WalletAdapterNetwork, WalletError } from './wallet-impl/abstract-wallet';
import { WalletDialogProvider, WalletMultiButton } from './wallet-impl/material-ui'
import { ConnectionProvider, WalletProvider } from './wallet-impl/wallet-adapter-react';
import {
    SolletExtensionWalletAdapter,
    SolletWalletAdapter,
    SafecoinWalletAdapter,
} from './wallet-impl/wallets';
import { clusterApiUrl } from '@safecoin/web3.js';
import { useSnackbar } from 'notistack';
import React, { FC, ReactNode, useCallback, useMemo } from 'react';
import { Theme } from './Theme';

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

const Content: FC = () => {
    return <WalletMultiButton />;
};

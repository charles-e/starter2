import { Cluster, clusterApiUrl, Connection } from '@safecoin/web3.js';
import React, { FC, useMemo, useState } from 'react';
import { WalletAdapterNetwork } from '../abstract-wallet';
import { ConnectContext, IConnectContext } from './ConnectContext';


export const ConnectionProvider: FC<IConnectContext> = ({
    children,
    config = { commitment: 'confirmed' },
}) => {
    const [endpoint, setEndpoint ] = useState<Cluster>(WalletAdapterNetwork.Devnet);
    const url = clusterApiUrl(endpoint);
    const conn = useMemo(() => new Connection(url, config), [endpoint, config]);
    const spSetEP = setEndpoint as (ep : string) => void; // make compiler shut up

    return <ConnectContext.Provider value={{ connection: conn,endpoint: endpoint,config: config,setEndpoint: spSetEP }}>{children}</ConnectContext.Provider>;
};

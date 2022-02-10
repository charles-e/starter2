import { Adapter, WalletAdapterNetwork } from '../abstract-wallet';

import { SolletExtensionWalletAdapter, SolletWalletAdapter } from './sollet';
import {  SafecoinWalletAdapter } from './safecoin';


export interface WalletsConfig {
    network?: WalletAdapterNetwork;
}

export function getWalletAdapters({ network = WalletAdapterNetwork.Mainnet }: WalletsConfig = {}): Adapter[] {
    return [

        new SolletWalletAdapter({ network }),
        new SafecoinWalletAdapter({ network }),
    ];
}

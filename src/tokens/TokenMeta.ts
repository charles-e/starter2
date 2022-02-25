import { Cluster, PublicKey } from "@safecoin/web3.js";

export interface TokenMeta {
    nick: string;
    address:  PublicKey;
    authority?: string;
    org: string;
    url: string;
    icon: string;
    decimals: number;
    hasFaucet: boolean;
    clusters: Cluster[];
}

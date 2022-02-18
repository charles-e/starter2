import React, {  FC,  useState } from 'react';
import { ITokenContext, TokenCtx } from './TokenCtx';
import tokensJSON from './tokenmeta.json';
import { TokenMeta } from '@/tokens/TokenMeta';
import { Cluster, PublicKey } from '@safecoin/web3.js';

const allTokensInitial: TokenMeta[] = tokensJSON.map((t) => {
    let newAddr: PublicKey | null = null;
    if (t.address) {
        try {
        newAddr = new PublicKey(t.address);
    } catch {

    }
}
    let ret = {
        nick: t.nick,
        clusters: t.clusters,
        org: t.org,
        url: t.url,
        decimals: t.decimals,
        hasFaucet: t.hasFaucet,
        authority: t?.authority,
        icon: t.icon,
    };
    if (newAddr) {
        ret['address'] = newAddr;
    }
    return ret;
}) as TokenMeta[];



export const TokenMetaProvider: FC<Partial<ITokenContext>> = ({
    children,
}) => {
    const [allTokens] = useState<TokenMeta[]>(allTokensInitial);

    const available = (cluster: Cluster): TokenMeta[] => {
        let clusterMatch = ((i:Cluster) => (i == cluster)); 
        const inCluster = (meta: TokenMeta): boolean => {
            let found = meta.clusters.find(clusterMatch);
            return found != undefined;
        }
        const foundClusters = allTokens.filter(inCluster);
      //  console.log(foundClusters);
        return foundClusters;
    };

    return <TokenCtx.Provider value={{
        directory: allTokens,
        availableTokens: available
    }}> {children}</TokenCtx.Provider >;
};

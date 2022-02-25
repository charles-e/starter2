import { PublicKey } from '@safecoin/web3.js';

export function parseTokenAccountData(data: Buffer): {
    mint: PublicKey,
    owner: PublicKey
    amount: number,
};

export function parseMintData(data: Buffer): { decimals: number };

export function getOwnedAccountsFilters(publicKey: PublicKey):
    [
        { memcmp: { offset: number, bytes: number } },
        { dataSize: number }
    ];


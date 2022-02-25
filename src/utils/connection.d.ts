import React, { ProviderExoticComponent } from "react";
import { Connection, AccountInfo, PublicKey } from "@safecoin/web3.js";

interface IConnectionConfig {
  endpoint: string;
  setEndpoint: (string: any) => void;
}
interface IConnectionContext extends IConnectionConfig {
  connection: Connection
}

export const ConnectionContext: React.Context<IConnectionContext>;
export function ConnectionProvider<IConnectionContext>(): ProviderExoticComponent<IConnectionContext>;

export function useConnection(): Connection;

export function useConnectionConfig(): IConnectionConfig;

export function useIsProdNetwork(): boolean;

export function useSafecoinExplorerUrlSuffix(): string;

export function useAccountInfo(publicKey?: PublicKey): [AccountInfo<Uint8Array>, boolean];

export function refreshAccountInfo(connection: Connection,
  publicKey: PublicKey,
  clearCache?: boolean): void;

export function setInitialAccountInfo(connection: Connection,
  publicKey: PublicKey,
  accountInfo: AccountInfo<Uint8Array>): void;

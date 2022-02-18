import { clusterApiUrl, Connection, ConnectionConfig } from "@safecoin/web3.js";
import React, { createContext, useContext} from "react";

export interface IConnectContext {
  connection: Connection | null;
  endpoint: string;
  config: ConnectionConfig;
  setEndpoint: (ep: string) => void;
}

const defaultState = {
  connection: null,
  endpoint: '',
  config: { commitment: 'confirmed' } as ConnectionConfig,
  setEndpoint: (ep: string) : void => {}
};

export const ConnectContext = createContext<IConnectContext>(defaultState);

export function useConnection(): IConnectContext {
    return useContext(ConnectContext);
}

export function useSafecoinExplorerUrlSuffix() {
  const endpoint = useContext(ConnectContext).endpoint;
  if (endpoint === 'devnet') {
    return '?cluster=devnet';
  } else if (endpoint === 'testnet') {
    return '?cluster=testnet';
  }
  return '';
}
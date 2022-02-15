import { Connection, ConnectionConfig } from "@safecoin/web3.js";
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
  config: { commitment: 'confirmed' }
};

export const ConnectContext = createContext<IConnectContext>(defaultState);

export function useConnection(): IConnectContext {
    return useContext(ConnectContext);
}


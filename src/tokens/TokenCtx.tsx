import { TokenMeta } from "@/tokens/TokenMeta";
import { Cluster } from "@safecoin/web3.js";
import React from "react";


  export interface ITokenContext {
    directory : TokenMeta[];
    availableTokens:(cluster: Cluster) => TokenMeta[];
  }

  export const TokenCtx = React.createContext<ITokenContext>(
    {
      directory : [],
      availableTokens:(cluster: Cluster) : TokenMeta[] => []
    }
  );
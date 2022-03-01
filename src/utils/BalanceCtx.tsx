import React from "react";

export interface IBalanceCtx {
    lamports: bigint;
    setLamports : (count: bigint) => (void);
    transactions: number;
    setTransactions : (count: number) => (void);

  }
  
  export const BalanceCtx = React.createContext<IBalanceCtx>(
    {
        lamports: 0n,
        setLamports : (count: bigint) => {},
        transactions: 0,
        setTransactions : (count : number) => {}
    }
  );
import { Balance } from "@mui/icons-material";
import React, { ReactNode, FC, useState, useContext } from "react";
import { IBalanceCtx, BalanceCtx } from "./BalanceCtx";


export const BalanceProvider: FC<Partial<IBalanceCtx>> = ({
    children
}) => {
    const [balance, setBalance] = useState<bigint>(0n);
    const [transCount, setTransCount] = useState<number>(0);

    const defaultBalanceCtx: IBalanceCtx = {
        lamports: balance,
        setLamports: setBalance,
        transactions: transCount,
        setTransactions: setTransCount
    };


    return (
        <BalanceCtx.Provider value={defaultBalanceCtx}>
            {children}
        </BalanceCtx.Provider>);
};

export function useBalance():
    [
        lamports: bigint,
        setLamports: (count: bigint) => (void)
    ] {
        const {lamports, setLamports} = useContext(BalanceCtx); 
    return [lamports, setLamports];
}

export function useTransactions() {
    const {transactions, setTransactions} = useContext(BalanceCtx); 

    return [transactions, setTransactions];
}
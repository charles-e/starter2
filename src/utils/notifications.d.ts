import { TransactionSignature } from '@safecoin/web3.js';

export type HandlerType =    (params:{ onSuccess: () => void, onError: () => void }) => Promise<TransactionSignature>;

export type sendTxnType =   (promiseSig: Promise<TransactionSignature>, 
  handler?: HandlerType) => Promise<string>;

export function useSendTransaction(): [sendTxnType,boolean];

export type CallBackFN =  ( 
  promised: Promise<any>, params?:{
    onSuccess: () => void,
    onError: () => void
  }) => (void);

export function useCallAsync(): CallBackFN;

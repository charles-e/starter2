import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useConnection, useSafecoinExplorerUrlSuffix } from '../wallet-impl/wallet-adapter-react';
import Button from '@mui/material/Button';
import { confirmTransaction } from './utils';
import { TransactionSignature } from '@safecoin/web3.js';

interface TxnHandler {
   onSuccess?: (sig: TransactionSignature) => (void), 
    onError?: (err: any) => (void) 
};
type VerifyTxnType = (
  signaturePromise: Promise<TransactionSignature>,
  handlers?:TxnHandler
) => Promise<TransactionSignature>;

export function useVerifyTransaction() : [ VerifyTxnType, boolean] {
  console.log('useVerifyTransaction');
  const { connection } = useConnection();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [waiting, setWaiting] = useState(false);

  async function verifyTransaction(
    signaturePromise: Promise<TransactionSignature>,
    handlers:TxnHandler = {}
  )  {
    let id = enqueueSnackbar('Sending transaction...', {
      variant: 'info',
      persist: true,
    });
    setWaiting(true);
    try {
      let signature = await signaturePromise;
      console.log(`got sig ${signature}`);
      closeSnackbar(id);
      id = enqueueSnackbar('Confirming transaction...', {
        variant: 'info',
        persist: true,
        action: <ViewTransactionOnExplorerButton signature={signature} />,
      });
      await confirmTransaction(connection!, signature);
      closeSnackbar(id);
      setWaiting(false);
      enqueueSnackbar('Transaction confirmed', {
        variant: 'success',
        autoHideDuration: 15000,
        action: <ViewTransactionOnExplorerButton signature={signature} />,
      });
      if (handlers.onSuccess) {
        handlers.onSuccess(signature);
      }
      return signature;
    } catch (e: any) {
      closeSnackbar(id);
      setWaiting(false);
      if (e.message) {
        console.warn(e.message as string);
        console.log(e.stackTrace);
        enqueueSnackbar(e.message, { variant: 'error' });
      }
      else {
        const msg = `random exception: ${e}`
        console.warn(msg);
        enqueueSnackbar(msg, { variant: 'error' });

      }
      if (handlers.onError) {
        handlers.onError(e);
      }
      return e;
    }
  }

  return [verifyTransaction, waiting];
}

function ViewTransactionOnExplorerButton({ signature }) {
  const urlSuffix = useSafecoinExplorerUrlSuffix();
  return (
    <Button
      color="inherit"
      component="a"
      target="_blank"
      rel="noopener"
      href={`https://explorer.solana.com/tx/${signature}` + urlSuffix}
    >
      View on Safecoin Explorer
    </Button>
  );
}

export function useCallAsync() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  return async function callAsync(
    promise,
    {
      progressMessage = 'Submitting...',
      successMessage = 'Success',
      onSuccess,
      onError,
    } = {},
  ) {
    let id = enqueueSnackbar(progressMessage, {
      variant: 'info',
      persist: true,
    });
    try {
      let result = await promise;
      closeSnackbar(id);
      if (successMessage) {
        enqueueSnackbar(successMessage, { variant: 'success' });
      }
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (e) {
      closeSnackbar(id);
      enqueueSnackbar(e.message, { variant: 'error' });
      if (onError) {
        onError(e);
      }
    }
  };
}

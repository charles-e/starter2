import { useVerifyTransaction } from "@/utils/notifications2";
import { useConnection, useWallet } from "@/wallet-impl/wallet-adapter-react";
import { Button, CircularProgress, Dialog, DialogTitle } from "@mui/material";
import { LAMPORTS_PER_SAFE } from "@safecoin/web3.js";
import React, { useState } from "react";

export function AirDropDialog(props: any): JSX.Element {
  const { connected, wallet } = useWallet();
  const { connection } = useConnection();
  const [verifyTransaction, verifying] = useVerifyTransaction();

  const handleClickCash = async () => {
    if (connection && wallet && wallet.adapter) {
      const myAddress = wallet?.adapter.publicKey;
      const sigPromise = connection?.requestAirdrop(myAddress!, LAMPORTS_PER_SAFE / 100);
      await verifyTransaction(sigPromise);
      props.onClose();
    }
  };

  return (
    <Dialog  open={props.open}  style={{textAlign: "center"}}>
      <DialogTitle>You need a small amount of SAFE to fund token transactions.</DialogTitle>
      <Button onClick={handleClickCash} disabled={verifying}>Click Here for Cash</Button>
      {verifying && <CircularProgress style={{margin:"10px auto"}}/>}
    </Dialog>
  );
}

import { useConnection, useWallet } from "@/wallet-impl/wallet-adapter-react";
import { Button, Dialog, DialogTitle } from "@mui/material";
import { LAMPORTS_PER_SAFE } from "@safecoin/web3.js";
import React from "react";

export function AirDropDialog(props: any): JSX.Element {
    const { onClose, selectedValue, open } = props;
    const { connected, wallet } = useWallet();
    const { connection }  = useConnection();

    const handleClose = () => {
      onClose(selectedValue);
    };
  
    const handleClickCash = async() => {
        if (connection && wallet && wallet.adapter){
        const myAddress = wallet?.adapter.publicKey;
        const signature = await connection?.requestAirdrop(myAddress!, LAMPORTS_PER_SAFE / 100);
        await connection.confirmTransaction(signature);
        }
    };
  
    return (
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>You need a small amount of SAFE to fund token transactions.</DialogTitle>
       <Button onClick={handleClickCash}>Click Here for Cash</Button>
      </Dialog>
    );
  }
  
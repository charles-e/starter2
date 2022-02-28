import { AccountMeta, PublicKey, Signer, SystemProgram, SYSVAR_RENT_PUBKEY, TransactionInstruction } from "@safecoin/web3.js";
import { instructionMaxSpan } from "./instructions";

 /**
   * Construct the AssociatedTokenProgram instruction to create the associated
   * token account
   *
   * @param associatedProgramId SPL Associated Token program account
   * @param programId SPL Token program account
   * @param mint Token mint account
   * @param associatedAccount New associated account
   * @param owner Owner of the new account
   * @param payer Payer of fees (signer)
   */
  export function createAssociatedTokenAccountInstruction(params :{
    associatedProgramId: PublicKey,
    programId: PublicKey,
    mint: PublicKey,
    associatedAccount: PublicKey,
    owner: PublicKey,
    payer: PublicKey,
  }
  ):  TransactionInstruction[]{
    const data = Buffer.alloc(0);

    let keys :AccountMeta[] = [
      {pubkey: params.payer, isSigner: true, isWritable: true},
      {pubkey: params.associatedAccount, isSigner: false, isWritable: true},
      {pubkey: params.owner, isSigner: false, isWritable: false},
      {pubkey: params.mint, isSigner: false, isWritable: false},
      {pubkey: SystemProgram.programId, isSigner: false, isWritable: false},
      {pubkey: params.programId, isSigner: false, isWritable: false},
      {pubkey: SYSVAR_RENT_PUBKEY, isSigner: false, isWritable: false},
    ];

    const ops = [
     new TransactionInstruction({
      keys,
      programId: params.associatedProgramId,
      data,
    })];
    const sigs = [params.payer];
  
  return ops;
}

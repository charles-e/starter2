import {
    initializeAccount,
    initializeMint,
    mintTo,
    TOKEN_PROGRAM_ID,
    transfer,
  } from './instructions';

  import { Connection, Keypair, PublicKey, TransactionSignature } from '@safecoin/web3.js';
  
 export  function getOwnedTokenAccounts(connection: Connection, publicKey: PublicKey) 
  : Promise<{
    publicKey: PublicKey,
    accountInfo: {
      data: Buffer,
      executable : boolean,
      owner:  PublicKey,
      lamports: number,
    }}[]>; 
  
  export  function createAndInitializeMint(params: {
    connection: Connection,
    owner: PublicKey, // Account for paying fees and allowed to mint new tokens
    mint : PublicKey, // Account to hold token information
    amount: number; // Number of tokens to issue
    decimals: number;
    initialAccount : PublicKey // Account to hold newly issued tokens, if amount > 0
  }) : Promise<TransactionSignature>;
  
  export  function mintExisting(params:{
    connection: Connection,
    wallet: PublicKey,
    mintAuth: Keypair, // Account for paying fees and allowed to mint new tokens
    mint: PublicKey, // Account to hold token information
    amount: number, // Number of tokens to issue
    targetAccount : PublicKey, // Account to hold newly issued tokens
  }) : Promise<TransactionSignature>;

  
  export  function createAndInitializeTokenAccount(params: {
    connection : Connection,
    payer : PublicKey,
    mintPublicKey: PublicKey,
    newAccount : PublicKey,
}) : Promise<TransactionSignature>;

  
  export  function transferTokens(params:{
    connection: Connection,
    owner: PublicKey,
    sourcePublicKey :PublicKey,
    destinationPublicKey : PublicKey,
    amount : number,
}) : Promise<TransactionSignature>;

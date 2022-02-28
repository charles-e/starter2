import {
  initializeAccount,
  initializeMint,
  mintTo,
  TOKEN_PROGRAM_ID,
  transfer,
} from './instructions';
import { ACCOUNT_LAYOUT, getOwnedAccountsFilters, MINT_LAYOUT } from './data';
import bs58 from 'bs58';
import base64js from 'base64-js';
import { PublicKey, SystemProgram, Transaction } from '@safecoin/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@safecoin/safe-token';

function bufEq(buf1, buf2) {
  if (buf1.byteLength != buf2.byteLength) return false;
  var dv1 = new Int8Array(buf1);
  var dv2 = new Int8Array(buf2);
  for (var i = 0; i != buf1.byteLength; i++) {
    if (dv1[i] != dv2[i]) return false;
  }
  return true;
}


export async function getOwnedTokenAccounts(connection, publicKey) {
  console.log('getOwnedTokenAccounts');
  let filters = getOwnedAccountsFilters(publicKey);
  let resp = await connection._rpcRequest('getProgramAccounts', [
    TOKEN_PROGRAM_ID.toBase58(),
    {
      encoding: 'base64',
      commitment: connection.commitment,
      filters,
      filters,
    },
  ]);
  if (resp.error) {
    throw new Error(
      'failed to get token accounts owned by ' +
      publicKey.toBase58() +
      ': ' +
      resp.error.message,
    );
  }

  const ret = resp.result
    .map(({ pubkey, account: { data, executable, owner, lamports } }) => {
      let buf = Buffer.from(data[0], 'base64');
      return {
        publicKey: new PublicKey(pubkey),
        accountInfo: {
          data: buf,

          executable,
          owner: new PublicKey(owner),
          lamports,
        },
      };
    })
    .filter(({ accountInfo }) => {
      // TODO: remove this check once mainnet is updated
      return filters.every((filter) => {
        if (filter.dataSize) {
          return accountInfo.data.length === filter.dataSize;
        } else if (filter.memcmp) {
          let filterBytes = bs58.decode(filter.memcmp.bytes);
          let aiData = accountInfo.data.slice(
            filter.memcmp.offset,
            filter.memcmp.offset + filterBytes.length,
          );
          return bufEq(aiData, filterBytes);
        }
        return false;
      });
    });
  return ret;
}

export async function createAndInitializeMint({
  connection,
  owner, // Account for paying fees and allowed to mint new tokens
  mint, // Account to hold token information
  amount, // Number of tokens to issue
  decimals,
  initialAccount, // Account to hold newly issued tokens, if amount > 0
}) {
  let transaction = SystemProgram.createAccount({
    fromPubkey: owner.publicKey,
    newAccountPubkey: mint.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(
      MINT_LAYOUT.span,
    ),
    space: MINT_LAYOUT.span,
    programId: TOKEN_PROGRAM_ID,
  });
  const imInst = initializeMint({
    mint: mint.publicKey,
    decimals,
    mintAuthority: owner.publicKey,
  });
  transaction.add(imInst);
  let signers = [owner, mint];
  if (amount > 0) {
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: owner.publicKey,
        newAccountPubkey: initialAccount.publicKey,
        lamports: await connection.getMinimumBalanceForRentExemption(
          ACCOUNT_LAYOUT.span,
        ),
        space: ACCOUNT_LAYOUT.span,
        programId: TOKEN_PROGRAM_ID,
      }),
    );
    signers.push(initialAccount);
    transaction.add(
      initializeAccount({
        account: initialAccount.publicKey,
        mint: mint.publicKey,
        owner: owner.publicKey,
      }),
    );
    transaction.add(
      mintTo({
        mint: mint.publicKey,
        destination: initialAccount.publicKey,
        amount,
        mintAuthority: owner.publicKey,
      }),
    );
  }
  return await connection.sendTransaction(transaction, signers);
}

export async function mintExisting({
  connection,
  wallet,
  mintAuth, // Account for paying fees and allowed to mint new tokens
  mint, // Account to hold token information
  amount, // Number of tokens to issue
  targetAccount, // Account to hold newly issued tokens
}) {
  let transaction = new Transaction();
  if (amount == 0) {
    throw "Can't mint zero tokens";
  }
  console.log('target: ', targetAccount.toBase58());
  console.log('auth ', mintAuth.publicKey.toBase58());
  transaction.add(
    mintTo({
      mint: mint,
      destination: targetAccount,
      amount,
      mintAuthority: mintAuth.publicKey,
    }),
  );
  //transaction.feePayer = wallet.publicKey;

  return await connection.sendTransaction(transaction, [mintAuth]);
}

export async function createAndInitializeTokenAccount({
  connection,
  payer,
  mintPublicKey,
  newAccount,
}) {

  let { instructions, signers } = createAssociatedTokenAccountInstruction(
    {
      associatedProgramId: ASSOCIATED_TOKEN_PROGRAM_ID,
      programId : TOKEN_PROGRAM_ID,
      connection: connection, 
      payer: payer,
      owner: payer,
      mint : mintPublicKey, 
    }
  );
  let transaction = new Transaction();
  for (const i in instructions) {
    transaction.add(instructions[i]);
  }
  return await connection.sendTransaction(transaction, signers);
}

export function makeCreateInitTokenAcctIx({
  payer,
  mintPublicKey,
  newAccount,
  lamports
}) {

  let ca_ix = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: newAccount.publicKey,
    lamports: lamports,
    programId: TOKEN_PROGRAM_ID,
  });
  const init_ix = initializeAccount({
    account: newAccount.publicKey,
    mint: mintPublicKey,
    owner: payer.publicKey,
  });
  return ({ instructions: [ca_ix, init_ix], signers: [payer, newAccount] });
}

export async function transferTokens({
  connection,
  owner,
  sourcePublicKey,
  destinationPublicKey,
  amount,
}) {
  let transaction = new Transaction().add(
    transfer({
      source: sourcePublicKey,
      destination: destinationPublicKey,
      owner: owner.publicKey,
      amount,
    }),
  );
  let signers = [owner];
  return await connection.sendTransaction(transaction, signers);
}

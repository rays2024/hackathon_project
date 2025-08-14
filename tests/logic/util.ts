import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { createAssociatedTokenAccount, createMint, getAssociatedTokenAddressSync, mintTo } from "@solana/spl-token";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import axios from "axios";
import * as fs from "fs";
import path from "path";
import nacl from "tweetnacl";

import { connection } from './config';

export async function sleep(ms) {
  return new Promise(function (res, rej) {
    setTimeout(res, ms)
  });
}

export function get_keypair_base(path_str: string): Keypair {
  let file = fs.readFileSync(path.join(__dirname, path_str));
  let keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(file.toString())))
  return keypair;
}

export function get_keypair(name: string): Keypair {
  return get_keypair_base(`${name}`)

}

export async function getMinLamportsFromSize(prov, size) {
  return await prov.connection.getMinimumBalanceForRentExemption(size);
}

export async function confirmTx(prov, tx: string) {
  let connection = prov.connection;
  if (connection == null) {
    connection = prov
  }
  let latestInfo = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    signature: tx,
    blockhash: latestInfo.blockhash,
    lastValidBlockHeight: latestInfo.lastValidBlockHeight
  });
}

export async function airdrop_for_testnet_v1(userAddress: string, amount: number): Promise<string> {

  // replace  to the really value.
  // const userAddress = userAddress;
  const lamports = BigInt(Math.floor(amount * 10 ** 9));
  const url = `https://faucet-api-grid-1-v1.sonic.game/airdrop/${userAddress}/${lamports.toString()}`;
  // send get request

  let resp = await axios.get(url);
  console.log("aridrop result: ", resp.data)
  // await confirmTx(conn, resp.data.data)
  return resp.data.data
}

export async function is_account_exist(pubkey: PublicKey): Promise<boolean> {
  let account = await connection.getAccountInfo(pubkey);
  if (account == null) {
    return false;
  }

  return true;
}

export async function get_account_data(conn: Connection, pk: PublicKey) {
  return await conn.getAccountInfo(pk);
}

export let keyPairSignMessage = (msg: Uint8Array, signer: Keypair): Uint8Array => {
  return nacl.sign.detached(msg, signer.secretKey);
};

export let keyPairSignStringMessage = (msg: string, signer: Keypair): Uint8Array => {
  let encoder = new TextEncoder()
  return keyPairSignMessage(encoder.encode(msg), signer);
}


async function create_mint_token_if_not_exist(payer: Keypair, mint_authority_pk: PublicKey, mint: Keypair) {
  if (!(await is_account_exist(mint.publicKey))) {
    await createMint(connection, payer, mint_authority_pk, null, 9, mint)
  } else {
    console.log('mint account exist, skip create it.')
  }

}


async function create_ata_token_if_not_exists(payer: Keypair, user: PublicKey, mint_pk: PublicKey) {
  let ata_token = getAssociatedTokenAddressSync(mint_pk, user)

  if (!(await is_account_exist(ata_token))) {
    await createAssociatedTokenAccount(connection, payer, mint_pk, user)
  } else {
    console.log('ata account %o exist. skip it.', ata_token.toString());
  }

  return ata_token;
}

async function transfer_token_to_user(payer: Keypair, mint_pk: PublicKey, user: PublicKey, mint_authority: Keypair, amount: string) {
  // let mint = get_mint()
  // await create_mint_token_if_not_exist(mint)
  let user_source_token = await create_ata_token_if_not_exists(payer, user, mint_pk)
  await sleep(3000);
  console.log("user ata_token ", user_source_token.toString())
  console.log("transfer amount ", BigInt(amount))
  let tx = await mintTo(connection, payer, mint_pk, user_source_token, mint_authority, BigInt(amount), [], { skipPreflight: true })
  console.log("mint to {}, tx ", user_source_token.toString(), tx);
}

async function transfer_token_to_account(payer: Keypair, mint_authority: Keypair, mint_pk: PublicKey, dest_token: PublicKey, amount: string) {
  // let mint = get_mint()
  let tx = await mintTo(connection, payer, mint_pk, dest_token, mint_authority, BigInt(amount))
  console.log("mint to tx ", dest_token.toString(), tx);
}


export function gen_private_key_from_array(data: Uint8Array) {
  return bs58.encode(data);
}

export function print_buffer_data(title, buffer: Buffer) {
  console.log(title)
  // let arr = []
  let values = buffer.valueOf();
  console.log('[')
  let str = ''
  for (let v of values) {
    str += v + ','
    if (str.length >= 64) {
      console.log(str)
      str = ''
    }
  }

  console.log(str)

  console.log(']')
  // return arr;
}
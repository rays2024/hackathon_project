import { AnchorProvider, BN, Program, Wallet } from "@coral-xyz/anchor";
import * as Token from "@solana/spl-token";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import TokenPool from "../../target/idl/token_pool.json";
import { TokenPool as ProgramType } from "../../target/types/token_pool";
import * as util from "./util";
import { PROGRAM_TOKEN_SEED, REWARDS_TOKEN_SEED } from "../const";

// const network = 'https://api.devnet.solana.com'
// const network = 'https://skilled-wiser-surf.solana-devnet.quiknode.pro/a45e6f5edd1624fe8121f52ade0ce664db153dd4'
const network = 'https://api.testnet.sonic.game'
// const network = 'http://localhost:8899'
// const opts = {
//     preflightCommitment: "processed",
// }

const user_kp = get_user();
const wallet = new Wallet(user_kp);
const connection = new Connection(network, { commitment: "confirmed" })
const provider = new AnchorProvider(
  connection,
  wallet,
  {
    preflightCommitment: "processed"
  }
)


const program = new Program(TokenPool as ProgramType, provider)
const skipPreflight = false;
const initType: number = 0;

// let uri = "https://madlads.s3.us-west-2.amazonaws.com/json/9967.json"
// let uri = "https://bafkreiby4o5gibvgkjzg27l4vwvisg5cwhh42oqh4d6hfit2sx5jfkqyee.ipfs.nftstorage.link/"

// 


/*

import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorProvider, web3, utils, Wallet } from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";
import { readFileSync } from "fs";
import { NodeWallet } from "@project-serum/anchor";
import {IDL, type Farming} from '../idl';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import anchor from "@coral-xyz/anchor";

const functionA = async () => {

    // const network = 'https://api.devnet.solana.com'
    const network = 'https://thrilling-icy-general.solana-devnet.quiknode.pro/9a554fef76b80070e5af99d1efca0cf17d4319c3/'
    // const opts = {
    //     preflightCommitment: "processed",
    // }

    // 读取私钥文件
    const secretKey = JSON.parse(readFileSync('../id.json', 'utf8'));
    const keypair = Keypair.fromSecretKey(new Uint8Array(secretKey));
    // 创建钱包
    const wallet = new Wallet(keypair);
    const connection = new Connection(network, {commitment: "confirmed"})
    const provider = new AnchorProvider(
        connection,
        wallet,
        {
            preflightCommitment: "processed"
        }
    )

    console.log("idl", idl)
    //create program
    const programId = new PublicKey('DH6Yov4WUSpSybwNEATYUaEwCuzEb3zqWeRHksvVuD22')
    const program = new Program<Farming>(idl, programId, provider)


    let payer = util.get_keypair("./key_pair/id.json");
    let mint = util.get_keypair("./key_pair/sodi_mint.json");
    let ins_creator = util.get_keypair("./key_pair/ins_creator.json");


    // console.log("start create mint");
    // let pubkey = await Token.createMint(provider.connection, payer, payer.publicKey, null, 9, mint);
    // console.log("mint pk:", pubkey.toString());
    // // let owner = new PublicKey("56SBSummr3xBt4JzPwCLZosLwe6jR9sWvJYpQ2hjVUMd")


    // let ata_token = await Token.createAssociatedTokenAccount(provider.connection, payer, mint.publicKey, payer.publicKey)
    // console.log("sodi ata token:", ata_token.toString());


    // let ins_creator_ata_token = await Token.createAssociatedTokenAccount(provider.connection, payer, mint.publicKey, ins_creator.publicKey)
    // console.log("ins_creator ata token:", ins_creator_ata_token.toString());

    // let ata_token = await Token.createAssociatedTokenAccount(provider.connection, payer, mint.publicKey, owner)
    // console.log("sodi ata token:", ata_token.toString());

    // let ata_token = new PublicKey("EbDJ6c8a5wLS5ZGGLQWQFA2NdfFccPFM25q9raP3eXpd")

    // let tx = await Token.mintTo(provider.connection, payer, mint.publicKey, ata_token, payer, BigInt(10 ** 9) * BigInt(1000000))

    let tx1 = await Token.mintTo(provider.connection, payer, mint.publicKey, new PublicKey("EbDJ6c8a5wLS5ZGGLQWQFA2NdfFccPFM25q9raP3eXpd"), payer, BigInt(10 ** 9) * BigInt("20000000"))
    // console.log("tx:", tx);
    console.log("tx1:", tx1);
}

*/

function log_title(title: string) {
  console.log('')
  console.log('')
  console.log('')
  console.log('===========' + title + '=============')
}


function get_admin(): Keypair {
  return util.get_keypair("./key_pair/admin.json")
}


function get_user(): Keypair {
  return util.get_keypair("./key_pair/user.json")
}

function get_rewards_spl_mint(): Keypair {
  return util.get_keypair("./key_pair/rewards_spl_mint.json");
}

function get_backend_authority(): Keypair {
  return util.get_keypair("./key_pair/backend_authority.json");
}

function get_kp(name: string): Keypair {
  return util.get_keypair(`./key_pair/${name}.json`)
}

let timestamp = Math.floor(Date.now() / 1000);

function sleep(ms) {
  return new Promise((res, rej) => {
    setTimeout(res, ms);
  })
}

async function next_timestamp(): Promise<number> {
  let timestamp1 = Math.floor(Date.now() / 1000);
  while (timestamp1 == timestamp) {
    await sleep(500);
    timestamp1 = Math.floor(Date.now() / 1000);
  }

  timestamp = timestamp1;

  return timestamp1;
}



async function confirmTx(tx: string) {
  console.log("start confirm tx:" + tx);
  let latestInfo = await provider.connection.getLatestBlockhash();
  await provider.connection.confirmTransaction({
    signature: tx,
    blockhash: latestInfo.blockhash,
    lastValidBlockHeight: latestInfo.lastValidBlockHeight
  });
}

async function confirmTxs(txs: string[]) {
  for (let v of txs) {
    await confirmTx(v)
  }
}

function get_mint_pk() {
  let tokenMint = Token.NATIVE_MINT; // use WSOL instead of SOL
  if (initType == 0) {
    let tokenMintKP = get_rewards_spl_mint();
    tokenMint = tokenMintKP.publicKey;
  }

  return tokenMint;

}


async function create_outside_token(creator: Keypair, mint: Keypair, mintAmount: number) {
  let payer = creator
  // let mint = util.get_keypair("./key_pair/out_token_mint.json");


  let pubkey = mint.publicKey;
  // if account is not exist
  let account = (await provider.connection.getAccountInfo(pubkey))
  console.log("account", account);
  if (account == null) {
    console.log("create a mint");
    pubkey = await Token.createMint(provider.connection, payer, payer.publicKey, null, 9, mint);
  }
  console.log("mint pk:", mint.publicKey.toString());
  // let owner = new PublicKey("56SBSummr3xBt4JzPwCLZosLwe6jR9sWvJYpQ2hjVUMd")

  let ata_token = getAssociatedTokenAddressSync(mint.publicKey, creator.publicKey);
  console.log("ata address", ata_token.toString())
  if ((await provider.connection.getAccountInfo(ata_token)) == null) {
    await Token.createAssociatedTokenAccount(provider.connection, payer, mint.publicKey, payer.publicKey)
  }

  console.log("creator ata token:", ata_token.toString());
  let tx = await Token.mintTo(provider.connection, payer, mint.publicKey, ata_token, payer, BigInt(10 ** 9) * BigInt(mintAmount))
  await confirmTx(tx)
}



async function init_spl_or_native_program(initType: number) {
  log_title("init_program")
  let conf = PublicKey.findProgramAddressSync([Buffer.from("conf")], program.programId)[0]

  if ((await util.get_account_data(provider.connection, conf)) != null) {
    console.log("program has been initialized. skip it");
    return;
  }

  let admin = get_admin();
  let tokenMint = Token.NATIVE_MINT; // use WSOL instead of SOL
  if (initType == 0) {
    let tokenMintKP = get_rewards_spl_mint();
    await create_outside_token(admin, tokenMintKP, 10000);
    tokenMint = tokenMintKP.publicKey;
  }


  // let poolToken = PublicKey.findProgramAddressSync([Buffer.from("program_token_seed"), tokenMint.toBytes()], programId)[0]
  let backendAuthority = get_backend_authority();


  let tx = await program.methods.initializeWithSplToken({
    initType: initType, // 0 spl token, 1 native token
    backendAuthority: backendAuthority.publicKey
  }).accounts({
    admin: admin.publicKey,
    tokenMint,
    // tokenProgram: TOKEN_PROGRAM_ID,
    // systemProgram: SystemProgram.programId,
  }).signers([admin]).rpc({ skipPreflight })

  await confirmTx(tx)


  let tx1 = await program.methods.initializeWithRewards().accounts({
    admin: admin.publicKey,
    rewardsTokenMint: tokenMint,
  }).signers([admin]).rpc({ skipPreflight });

  await confirmTx(tx1)

}

async function changeConf() {
  let admin = get_admin();
  let user = get_user();
  let conf = PublicKey.findProgramAddressSync([Buffer.from("conf")], program.programId)[0]
  let backendAuthority = get_backend_authority();

  const confBefore = await program.account.conf.fetch(
    conf.toBase58()
  );
  console.log("confBefore.backendAuthority : ", confBefore.backendAuthority.toString());

  let tx = await program.methods.changeConf().accounts({
    admin: admin.publicKey,
    newBackendAuthority: user.publicKey,
  }).signers([admin]).rpc({ skipPreflight });
  await confirmTx(tx)

  const confAfter = await program.account.conf.fetch(
    conf.toBase58()
  );
  console.log("confAfter.backendAuthority : ", confAfter.backendAuthority.toString());
}

async function stake_native_token(amount = (BigInt(1) * BigInt(10 ** 9)).toString()) {
  log_title("stake_native_token")
  let user = get_user();
  let backendAuthority = get_backend_authority();
  // pad
  let conf = PublicKey.findProgramAddressSync([Buffer.from("conf")], program.programId)[0]
  if ((await util.get_account_data(provider.connection, conf)) == null) {
    throw "conf account has not been initialized";
  }
  let stakeAccount = PublicKey.findProgramAddressSync([Buffer.from("stake"), user.publicKey.toBuffer()], program.programId)[0];
  let program_sol_wallet = PublicKey.findProgramAddressSync([Buffer.from("program_sol_wallet")], program.programId)[0]
  const program_sol_wallet_before = await provider.connection.getBalance(program_sol_wallet)
  console.log("program_sol_wallet_before ", program_sol_wallet_before);
  if ((await provider.connection.getAccountInfo(stakeAccount)) !== null) {
    const stakeAccountDataBefore = await program.account.stakeAccount.fetch(
      stakeAccount.toBase58()
    );
    console.log("stakeAccountDataBefore.stakeAmount : ", stakeAccountDataBefore.stakeAmount.toString());
  }
  // stake native token
  let tx = await program.methods.stakeNativeToken(new BN(amount))
    .accounts({
      user: user.publicKey,
      backendAuthority: backendAuthority.publicKey,
    })
    .signers([user, backendAuthority])
    .rpc({ skipPreflight })
  await confirmTx(tx)
  const stakeAccountDataAfter = await program.account.stakeAccount.fetch(
    stakeAccount.toBase58()
  );
  console.log("stakeAccountDataAfter.stakeAmount : ", stakeAccountDataAfter.stakeAmount.toString());
  const program_sol_wallet_after = await provider.connection.getBalance(program_sol_wallet)
  console.log("program_sol_wallet_after ", program_sol_wallet_after);
}

async function stake_spl_token(amount = (BigInt(10) * BigInt(10 ** 9)).toString()) {
  log_title("stake_spl_token")
  let tokenMintKP = get_rewards_spl_mint();
  let user = get_user();
  let backendAuthority = get_backend_authority();
  // pda
  let conf = PublicKey.findProgramAddressSync([Buffer.from("conf")], program.programId)[0]
  let poolToken = PublicKey.findProgramAddressSync([Buffer.from("program_token_seed"), tokenMintKP.publicKey.toBuffer()], program.programId)[0];
  let stakeAccount = PublicKey.findProgramAddressSync([Buffer.from("stake"), user.publicKey.toBuffer()], program.programId)[0]
  let admin = get_admin();
  // prepare spl token for user
  let admin_ata_token = getAssociatedTokenAddressSync(tokenMintKP.publicKey, admin.publicKey);
  let userAtaToken = getAssociatedTokenAddressSync(tokenMintKP.publicKey, user.publicKey);
  if ((await provider.connection.getAccountInfo(userAtaToken)) == null) {
    await Token.createAssociatedTokenAccount(provider.connection, user, tokenMintKP.publicKey, user.publicKey);
  }
  let tx0 = await Token.transfer(provider.connection, admin, admin_ata_token, userAtaToken, admin, BigInt(amount), [], { skipPreflight: true });
  await confirmTx(tx0);
  console.log("user ata address", userAtaToken.toString())
  let userAtaTokenBefore = await Token.getAccount(provider.connection, userAtaToken);
  console.log("userAtaTokenBefore amount: ", userAtaTokenBefore.amount);
  let poolTokenBefore = await Token.getAccount(provider.connection, poolToken);
  console.log("poolTokenBefore amount: ", poolTokenBefore.amount);

  if ((await provider.connection.getAccountInfo(stakeAccount)) !== null) {
    const stakeAccountDataBefore = await program.account.stakeAccount.fetch(
      stakeAccount.toBase58()
    );
    console.log("stakeAccountDataBefore.stakeAmount : ", stakeAccountDataBefore.stakeAmount.toString());
  }
  // stake spl token
  let tx = await program.methods.stakeSplToken(new BN(amount))
    .accounts({
      user: user.publicKey,
      backendAuthority: backendAuthority.publicKey,
    })
    .signers([user, backendAuthority])
    .rpc({ skipPreflight });
  await confirmTx(tx)

  let userAtaTokenAfter = await Token.getAccount(provider.connection, userAtaToken);
  console.log("userAtaTokenAfter amount: ", userAtaTokenAfter.amount);
  let poolTokenAfter = await Token.getAccount(provider.connection, poolToken);
  console.log("poolTokenAfter amount: ", poolTokenAfter.amount);
  const stakeAccountDataAfter = await program.account.stakeAccount.fetch(
    stakeAccount.toBase58()
  );
  console.log("stakeAccountDataAfter.stakeAmount : ", stakeAccountDataAfter.stakeAmount.toString());
}


async function withdraw_spl_or_native_token(amount = (BigInt(1) * BigInt(10 ** 9))) {
  log_title("withdraw_spl_or_native_token");

  let tokenMint = get_mint_pk();
  let user = get_user();
  let backendAuthority = get_backend_authority();
  let stakeAccount = PublicKey.findProgramAddressSync([Buffer.from("stake"), user.publicKey.toBuffer()], program.programId)[0]
  const stakeAccountDataBefore = await program.account.stakeAccount.fetch(
    stakeAccount.toBase58()
  );
  console.log("stakeAccountDataBefore.stakeAmount : ", stakeAccountDataBefore.stakeAmount.toString());
  console.log("stakeAccountDataBefore.withdrawAmount : ", stakeAccountDataBefore.withdrawAmount.toString());

  let tx = await program.methods.withdraw(new BN(amount.toString())).accounts({
    user: user.publicKey,
    backendAuthority: backendAuthority.publicKey,
    tokenMint: tokenMint
  }).signers([user, backendAuthority]).rpc({ skipPreflight });

  await confirmTx(tx)
  const stakeAccountDataAfter = await program.account.stakeAccount.fetch(
    stakeAccount.toBase58()
  );
  console.log("stakeAccountDataAfter.stakeAmount : ", stakeAccountDataAfter.stakeAmount.toString());
  console.log("stakeAccountDataAfter.withdrawAmount : ", stakeAccountDataAfter.withdrawAmount.toString());
}

async function claimRewards(amount) {
  let tokenMint = get_mint_pk();
  let user = get_user();
  let backendAuthority = get_backend_authority();

  let tx = await program.methods.claimRewards(new BN(amount.toString())).accounts({
    user: user.publicKey,
    backendAuthority: backendAuthority.publicKey,
    tokenMint: tokenMint
  }).signers([user, backendAuthority]).rpc({ skipPreflight });

  await confirmTx(tx)
}

async function claim_rewards_spl_or_native_token(amount = (BigInt(1) * BigInt(10 ** 9))) {
  log_title("claim_rewards_spl_or_native_token");
  let user = get_user();
  let admin = get_admin();
  let stakeAccount = PublicKey.findProgramAddressSync([Buffer.from("stake"), user.publicKey.toBuffer()], program.programId)[0]
  const stakeAccountDataBefore = await program.account.stakeAccount.fetch(
    stakeAccount.toBase58()
  );
  console.log("stakeAccountDataBefore.withdrawRewardsAmount : ", stakeAccountDataBefore.withdrawRewardsAmount.toString());
  if (initType == 0) {
    let rewards_spl_mint = get_rewards_spl_mint();
    let rewardsToken = PublicKey.findProgramAddressSync([Buffer.from("rewards_token"), rewards_spl_mint.publicKey.toBuffer()], program.programId)[0];
    let userAtaToken = getAssociatedTokenAddressSync(rewards_spl_mint.publicKey, user.publicKey);
    // prepare spl token for rewards
    let admin_ata_token = getAssociatedTokenAddressSync(rewards_spl_mint.publicKey, admin.publicKey);
    let tx0 = await Token.transfer(provider.connection, admin, admin_ata_token, rewardsToken, admin, BigInt(10 ** 9), [], { skipPreflight: true });
    await confirmTx(tx0);
    // read token account before
    let rewardsTokenBefore = await Token.getAccount(provider.connection, rewardsToken);
    console.log("rewardsTokenBefore amount: ", rewardsTokenBefore.amount);
    let userAtaTokenBefore = await Token.getAccount(provider.connection, userAtaToken);
    console.log("userAtaTokenBefore amount: ", userAtaTokenBefore.amount);
    await claimRewards(amount);
    // read token account after
    let rewardsTokenAfter = await Token.getAccount(provider.connection, rewardsToken);
    console.log("rewardsTokenAfter amount: ", rewardsTokenAfter.amount);
    let userAtaTokenAfter = await Token.getAccount(provider.connection, userAtaToken);
    console.log("userAtaTokenAfter amount: ", userAtaTokenAfter.amount);
  } else {
    // transfer sol from admin to reward wallet
    let rewards_sol_wallet = PublicKey.findProgramAddressSync([Buffer.from("rewards_sol_wallet")], program.programId)[0];
    let allRewards = BigInt(2) * BigInt(10 ** 9);
    if ((await provider.connection.getAccountInfo(rewards_sol_wallet)) == null) {
      allRewards += BigInt(await connection.getMinimumBalanceForRentExemption(0));  // avoid recycle account
    }
    const transferToRewardsWalletIx = SystemProgram.transfer({
      lamports: allRewards,
      fromPubkey: admin.publicKey,
      toPubkey: rewards_sol_wallet,
      programId: SystemProgram.programId,
    });
    let recentBlockhash = await connection.getLatestBlockhash().then(res => res.blockhash);
    const message = new TransactionMessage({
      payerKey: admin.publicKey,
      recentBlockhash,
      instructions: [transferToRewardsWalletIx],
    }).compileToV0Message();
    const tx = new VersionedTransaction(message);
    tx.sign([admin])
    const signature = await provider.connection.sendTransaction(tx);
    await confirmTx(signature);
    // claim_rewards_spl_or_native_token
    const rewards_wallet_before = await provider.connection.getBalance(rewards_sol_wallet)
    console.log("rewards_wallet_before: ", rewards_wallet_before);
    const user_wallet_before = await provider.connection.getBalance(user.publicKey)
    console.log("user_wallet_before: ", user_wallet_before);
    await claimRewards(amount);
    const rewards_wallet_after = await provider.connection.getBalance(rewards_sol_wallet)
    console.log("rewards_wallet_after: ", rewards_wallet_after);
    const user_wallet_after = await provider.connection.getBalance(user.publicKey)
    console.log("rewards_wallet_after: ", user_wallet_after);
  }
  const stakeAccountDataAfter = await program.account.stakeAccount.fetch(
    stakeAccount.toBase58()
  );
  console.log("stakeAccountDataAfter.withdrawRewardsAmount : ", stakeAccountDataAfter.withdrawRewardsAmount.toString());
}

async function transferToRewards(amount) {
  let tokenMint = get_mint_pk();
  let backendAuthority = get_backend_authority();

  let tx = await program.methods.transferToRewards(new BN(amount.toString())).accounts({
    backendAuthority: backendAuthority.publicKey,
    tokenMint: tokenMint
  }).signers([backendAuthority]).rpc({ skipPreflight });

  await confirmTx(tx)
}

async function transfer_to_rewards_spl_or_native_token(amount = (BigInt(1) * BigInt(10 ** 9))) {
  log_title("transfer_to_rewards_spl_or_native_token");
  let admin = get_admin();

  if (initType == 0) {
    let rewards_spl_mint = get_rewards_spl_mint();
    let rewardsToken = PublicKey.findProgramAddressSync([Buffer.from("rewards_token"), rewards_spl_mint.publicKey.toBuffer()], program.programId)[0];
    let poolToken = PublicKey.findProgramAddressSync([Buffer.from("program_token_seed"), rewards_spl_mint.publicKey.toBuffer()], program.programId)[0];
    // transfer spl token from admin to pool
    let admin_ata_token = getAssociatedTokenAddressSync(rewards_spl_mint.publicKey, admin.publicKey);
    let tx0 = await Token.transfer(provider.connection, admin, admin_ata_token, poolToken, admin, BigInt(10 ** 9), [], { skipPreflight: true });
    await confirmTx(tx0);
    // read token account before
    let rewardsTokenBefore = await Token.getAccount(provider.connection, rewardsToken);
    console.log("rewardsTokenBefore amount: ", rewardsTokenBefore.amount);
    let poolTokenBefore = await Token.getAccount(provider.connection, poolToken);
    console.log("poolTokenBefore amount: ", poolTokenBefore.amount);
    await transferToRewards(amount);
    // read token account after
    let rewardsTokenAfter = await Token.getAccount(provider.connection, rewardsToken);
    console.log("rewardsTokenAfter amount: ", rewardsTokenAfter.amount);
    let poolTokenAfter = await Token.getAccount(provider.connection, poolToken);
    console.log("poolTokenAfter amount: ", poolTokenAfter.amount);
  } else {
    // transfer sol from admin to program sol wallet
    let program_sol_wallet = PublicKey.findProgramAddressSync([Buffer.from("program_sol_wallet")], program.programId)[0];
    let allRewards = BigInt(2) * BigInt(10 ** 9);
    if ((await provider.connection.getAccountInfo(program_sol_wallet)) == null) {
      allRewards += BigInt(await connection.getMinimumBalanceForRentExemption(0));  // avoid recycle account
    }
    const transferToRewardsWalletIx = SystemProgram.transfer({
      lamports: allRewards,
      fromPubkey: admin.publicKey,
      toPubkey: program_sol_wallet,
      programId: SystemProgram.programId,
    });
    let recentBlockhash = await connection.getLatestBlockhash().then(res => res.blockhash);
    const message = new TransactionMessage({
      payerKey: admin.publicKey,
      recentBlockhash,
      instructions: [transferToRewardsWalletIx],
    }).compileToV0Message();
    const tx = new VersionedTransaction(message);
    tx.sign([admin])
    const signature = await provider.connection.sendTransaction(tx);
    await confirmTx(signature);
    // program sol wallet to reward sol wallet
    let rewards_sol_wallet = PublicKey.findProgramAddressSync([Buffer.from("rewards_sol_wallet")], program.programId)[0];
    const rewards_wallet_before = await provider.connection.getBalance(rewards_sol_wallet)
    console.log("rewards_wallet_before: ", rewards_wallet_before);
    const program_sol_wallet_before = await provider.connection.getBalance(program_sol_wallet)
    console.log("program_sol_wallet_before: ", program_sol_wallet_before);
    await transferToRewards(amount);
    const rewards_wallet_after = await provider.connection.getBalance(rewards_sol_wallet)
    console.log("rewards_wallet_after: ", rewards_wallet_after);
    const program_sol_wallet_after = await provider.connection.getBalance(program_sol_wallet)
    console.log("program_sol_wallet_after: ", program_sol_wallet_after);
  }
}

describe("test contract", () => {

  it("print info", async () => {
    let admin = get_admin()
    let backend_authority = get_backend_authority()
    let user = get_user()
    let rewards_spl_mint = get_rewards_spl_mint();
    let rewards_spl_mint_pk = rewards_spl_mint.publicKey;
    let conf = PublicKey.findProgramAddressSync([Buffer.from('conf')], program.programId)[0];
    let program_sol_wallet = PublicKey.findProgramAddressSync([Buffer.from("program_sol_wallet")], program.programId)[0]
    let rewards_sol_wallet = PublicKey.findProgramAddressSync([Buffer.from("rewards_sol_wallet")], program.programId)[0]
    let program_spl_wallet = PublicKey.findProgramAddressSync([Buffer.from(PROGRAM_TOKEN_SEED), rewards_spl_mint_pk.toBuffer()], program.programId)[0]
    let rewards_spl_wallet = PublicKey.findProgramAddressSync([Buffer.from(REWARDS_TOKEN_SEED), rewards_spl_mint_pk.toBuffer()], program.programId)[0]

    console.log("admin: ", admin.publicKey.toString())
    console.log("conf: ", conf.toString());
    console.log("conf ata: ", getAssociatedTokenAddressSync(rewards_spl_mint_pk, conf, true).toString())
    console.log("backend_authority:", backend_authority.publicKey.toString());
    console.log("user", user.publicKey.toString());
    console.log("rewards_spl_mint: ", rewards_spl_mint.publicKey.toString())
    console.log("program_spl_wallet: ", program_spl_wallet.toString())
    console.log("rewards_spl_wallet: ", rewards_spl_wallet.toString())
    console.log("program_sol_wallet: ", program_sol_wallet.toString())
    console.log("rewards_sol_wallet: ", rewards_sol_wallet.toString())
  })

  // it("transfer sol to accounts", async () => {
  //   // return;
  //   let user = get_user()
  //   let admin = get_admin()

  //   let tx_sign = await provider.connection.requestAirdrop(user.publicKey, 10 ** 9 * 100);
  //   let tx_sign1 = await provider.connection.requestAirdrop(admin.publicKey, 10 ** 9 * 100);
  //   await confirmTxs([tx_sign, tx_sign1]);
  //   // console.log("transfer sol tx: ", tx_sign)
  // })

  it("initialize", async () => {
    await init_spl_or_native_program(initType);
  })

  // it("initialize", async () => {
  //   await changeConf();
  // })

  // it("stake_spl_or_native_token", async () => {
  //   if (initType == 0) {
  //     await stake_spl_token();
  //   } else {
  //     await stake_native_token();
  //   }
  // })

  // it("withdraw_spl_or_native_token", async () => {
  //   await withdraw_spl_or_native_token();
  // })

  // it("claim_rewards_spl_or_native_token", async () => {
  //   await claim_rewards_spl_or_native_token();
  // })

  // it("transfer_to_rewards_spl_or_native_token", async () => {
  //   await transfer_to_rewards_spl_or_native_token();
  // })
})  

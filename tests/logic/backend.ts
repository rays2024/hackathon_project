import { createAssociatedTokenAccount, createMint, getAssociatedTokenAddressSync, mintTo } from "@solana/spl-token";
import { Connection, Keypair, PublicKey, Signer, Transaction } from "@solana/web3.js";
import axios from "axios";
import bs58 from "bs58";
import nacl from "tweetnacl";
import * as util from "./util";
require("dotenv").config();


function get_admin(): Keypair {
    return util.get_keypair("admin")
}

function get_validator(): Keypair {
    return util.get_keypair('validator')
}

function get_user(): Keypair {
    return util.get_keypair('user')
}


// this mint is stake withdraw and reward mint
function get_mint(): Keypair {
    return util.get_keypair('rewards_spl_mint')
}

let payer = get_user()
let admin = get_admin()

// let connection = new Connection('https://skilled-wiser-surf.solana-devnet.quiknode.pro/a45e6f5edd1624fe8121f52ade0ce664db153dd4');
let connection = new Connection('https://api.devnet.solana.com')
// let connection = new Connection('https://api.testnet.sonic.game')

const BACKEND_DOMAIN = "http://localhost:8080/"

export interface ApiResponse<T> {
    data: T;
    code: number;
    err_msg: string | null;
}

type TokenPoolParams = {
    user: string,
    validator_pubkey: string,
    amount: string,
}

type ClaimRewardParams = {
    user: string,
    amount: string,
}

type CommonPreTxData = {
    base64_tx: string,
    extra_data: string,
    sign_data: string,
}

enum RequestType {
    StakeSPLToken = 'stake_spl_token',
    Withdraw = 'withdraw',
    UserStakeSPLToken = 'user_stake_spl_token',
    UserWithdraw = 'user_withdraw',
    ClaimRewards = 'claim_rewards',
}

const api_gen_request = async (tokenPoolParams: TokenPoolParams | ClaimRewardParams, type: RequestType): Promise<CommonPreTxData> => {
    const resp = await axios.post(
        new URL("/api/gen_request/" + type, BACKEND_DOMAIN).toString(),
        tokenPoolParams
    );
    // console.log(resp.data.data);
    if (resp.data.code != 0) {
        console.error(resp.data);
    }
    return resp.data.data;
}




const api_process_request = async (tokenPoolParams: CommonPreTxData, type: RequestType) => {
    const resp = await axios.post(
        new URL("/api/process_request/" + type, BACKEND_DOMAIN).toString(),
        tokenPoolParams
    );
    console.log(resp.data);
}



const api_get_nonce_request = async (): Promise<number> => {
    const resp = await axios.get(
        new URL("/api/gen_next_nonce", BACKEND_DOMAIN).toString(),
    );
    console.log(resp.data);
    return resp.data.data;
}





// admin:  BdGQXhqUnHugY6BfZ8XWBCizqPe8aEC8CXDcRr76NuiH
// backend_authority: 2FKuAZxxfLkAe64Cv4racBV9cpkpZ6XGeF4BXfPjXmQU
// user 6REGV7KSiSUEyHvHqQY6oz1dYurbhTsaKNRVvR9QRPCn
// rewards_spl_mint:  BajqRAuFgGxzAcNr1BG3LnsnenHyzcWC2d6t4ezRsWEV
// program_spl_wallet:  24jkhWgTAEG9eks72ouxEVZLQDMJYhN5Hh1idW6U8yHE
// rewards_spl_wallet:  DL5VJChRV5fKB4HPNeyArHnTn21HgKQyAnUWte86P6YN
// program_sol_wallet:  CsRViYfwNXTy1Xma6CAwKccUpmHBpLBjRkgqiGNCRFv9
// rewards_sol_wallet:  5aFkrEG6ttDbarBZBrDg5CGF14MjECeLjmvYdVQkkKHg


type AddValidatorParams = {
    pubkey: string,
    owner: string,
    cosmos_pk: string,
    name: string,
    ip: string,
    stake_type: number,
    validator_type: number,
    delegate_fee: number,
    receive_rewards_account: string,
    nonce: number,
    sign_admin: string
}

type CommonSignData = {
    data: any,
    signature: string
}

class BincodeSerializer {
    buffer: Buffer
    len: number

    constructor() {
        this.buffer = Buffer.alloc(0)
        this.len = 0
    }
    writeUint(n: bigint, type) {
        if (type == 'u8') {
            let temp = Buffer.alloc(1)
            temp.writeUInt8(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 1
        } else if (type == 'u16') {
            let temp = Buffer.alloc(2)
            temp.writeUInt16LE(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 2
        } else if (type == 'u32') {
            let temp = Buffer.alloc(4)
            temp.writeUInt32LE(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 4
        } else if (type == 'u64') {
            let temp = Buffer.alloc(8)
            temp.writeBigUInt64LE(n, 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 8
        } else if (type == 'u128') {
            let mod = BigInt(2) ** BigInt(64)
            let a = n / mod
            let b = n % mod
            this.writeUint(b, 'u64')
            this.writeUint(a, 'u64')
        } else if (type == 'u256') {
            let mod = BigInt(2) ** BigInt(128)
            let a = n / mod
            let b = n % mod
            this.writeUint(b, 'u128')
            this.writeUint(a, 'u128')
        } else {
            throw "not supported type " + type;
        }
    }

    writeInt(n: bigint, type) {
        if (type == 'i8') {
            let temp = Buffer.alloc(1)
            temp.writeInt8(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 1
        } else if (type == 'i16') {
            let temp = Buffer.alloc(2)
            temp.writeInt16LE(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 2
        } else if (type == 'i32') {
            let temp = Buffer.alloc(4)
            temp.writeInt32LE(Number(n), 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 4
        } else if (type == 'i64') {
            let temp = Buffer.alloc(8)
            temp.writeBigInt64LE(n, 0)
            this.buffer = Buffer.concat([this.buffer, temp])
            this.len += 8
        } else if (type == 'i128') {

            if (n >= BigInt(0)) {
                this.writeUint(n, 'u128')
            } else {
                let newN = (BigInt(1) << BigInt(128)) - (n * BigInt(-1))
                this.writeUint(newN, 'u128')
            }

        } else if (type == 'i256') {
            if (n >= BigInt(0)) {
                this.writeUint(n, 'u256')
            } else {
                let newN = (BigInt(1) << BigInt(256)) - (n * BigInt(-1))
                this.writeUint(newN, 'u256')
            }
        } else {
            throw "not supported type " + type;
        }
    }

    writeDouble(n: number) {
        let temp = Buffer.alloc(8)
        temp.writeDoubleLE(n, 0)
        this.buffer = Buffer.concat([this.buffer, temp])
        this.len += 8
    }

    writeString(s: string) {
        let temp = Buffer.alloc(s.length + 8)
        temp.writeBigUInt64LE(BigInt(s.length))
        temp.write(s, 8, 'utf8')
        this.buffer = Buffer.concat([this.buffer, temp])
        this.len += s.length + 4
    }

}

class AddValidatorData {
    pubkey: string;
    owner: string;
    cosmos_pk: string;
    name: string;
    ip: string;
    stake_type: number;
    validator_type: number;
    delegate_fee: number;
    receive_rewards_account: string;
    nonce: number;
    sign_admin: string;

    constructor(d: AddValidatorParams) {
        this.pubkey = d.pubkey
        this.owner = d.owner
        this.cosmos_pk = d.cosmos_pk
        this.name = d.name
        this.ip = d.ip
        this.stake_type = d.stake_type
        this.validator_type = d.validator_type
        this.delegate_fee = d.delegate_fee
        this.receive_rewards_account = d.receive_rewards_account
        this.nonce = d.nonce
        this.sign_admin = d.sign_admin
    }




    serialize(): Buffer {
        let writer = new BincodeSerializer()
        writer.writeString(this.pubkey)
        writer.writeString(this.owner)
        writer.writeString(this.cosmos_pk)
        writer.writeString(this.name)
        writer.writeString(this.ip)
        writer.writeInt(BigInt(this.stake_type), 'i16')
        writer.writeInt(BigInt(this.validator_type), 'i16')
        writer.writeDouble(this.delegate_fee)
        writer.writeString(this.receive_rewards_account)
        writer.writeInt(BigInt(this.nonce), 'i64')
        writer.writeString(this.sign_admin)

        return writer.buffer;
    }
}

const keyPairSignMessage = (msg: Uint8Array, signer: Keypair): Uint8Array => {
    return nacl.sign.detached(msg, signer.secretKey);
};

const keyPairSignStringMessage = (msg: string, signer: Keypair): Uint8Array => {
    let encoder = new TextEncoder()
    return keyPairSignMessage(encoder.encode(msg), signer);
}

async function admin_add_validator(data: AddValidatorData) {
    let admin = get_admin();
    let buffer = data.serialize()
    let sign_result = keyPairSignMessage(new Uint8Array(buffer), admin)
    let signature = bs58.encode(sign_result)
    const resp = await axios.post(
        new URL("/api/admin/add_validator", BACKEND_DOMAIN).toString(),
        {
            data: data,
            signature
        }
    );
    console.log(resp.data);
}

async function add_validator_main(owner: PublicKey, validator_pk: PublicKey) {
    let nonce = await api_get_nonce_request()
    let admin = get_admin();
    let admin_pk = admin.publicKey.toString()
    // let validator_pvk = get_keypair('validator1')
    let pk = validator_pk.toString()
    // admin_pk = ""
    // let pk = 'Cghiw5uDDcFZ9GxdN1BJgt1FX8AuRXhU6xF2T3aNKwis'

    console.log("new pk ", pk)
    let addValidatorParams: AddValidatorParams = {
        pubkey: pk.toString(),
        owner: owner.toString(),
        cosmos_pk: "ox1",
        name: "test name v1",
        ip: "",
        stake_type: 0, // 0 invite node. 1 free node
        validator_type: 1, // 0 invite validator, 1 freedom validator
        delegate_fee: 0.2,
        receive_rewards_account: owner.toString(),
        nonce: nonce,
        sign_admin: admin_pk
    }
    let data = new AddValidatorData(addValidatorParams)
    let d = data.serialize()

    let str = ''
    for (let i = 0; i < d.length; i++) {
        str += d[i] + ','
    }
    console.log(str)

    // admin sign it.
    await admin_add_validator(data);
}


async function common_request(signer: Keypair, params: TokenPoolParams | ClaimRewardParams, type: RequestType) {
    console.log('process type ', type)
    let user: Signer = signer
    let resp = await api_gen_request(params, type)
    // console.log("ajax resp %o", resp)
    const { base64_tx, extra_data, sign_data } = resp;
    const tx: Transaction = Transaction.from(Buffer.from(base64_tx, "base64"));

    tx.partialSign(user);
    const signedTransactionBase64 = tx
        .serialize({ requireAllSignatures: false })
        .toString("base64");
    console.log('start wait')
    await util.sleep(20000);
    console.log('end wait')
    // console.log(signedTransactionBase64);
    await api_process_request({
        base64_tx: signedTransactionBase64,
        extra_data,
        sign_data,
    }, type);
}




async function stake_spl_token(user: Keypair, validator_pk: PublicKey, n: number) {
    await common_request(user, { user: user.publicKey.toString(), validator_pubkey: validator_pk.toString(), amount: BigInt(Math.floor(n * 10 ** 9)).toString() }, RequestType.StakeSPLToken)
}

async function user_stake_spl_token(user: Keypair, validator_pk: PublicKey, n: number) {
    await common_request(user, { user: user.publicKey.toString(), validator_pubkey: validator_pk.toString(), amount: BigInt(Math.floor(n * 10 ** 9)).toString() }, RequestType.UserStakeSPLToken)
}


async function withdraw_token(user: Keypair, validator_pk: PublicKey, n: number) {
    await common_request(user, { user: user.publicKey.toString(), validator_pubkey: validator_pk.toString(), amount: BigInt(Math.floor(n * 10 ** 9)).toString() }, RequestType.Withdraw)
}

async function user_withdraw_token(user: Keypair, validator_pk: PublicKey, n: number) {
    await common_request(user, { user: user.publicKey.toString(), validator_pubkey: validator_pk.toString(), amount: BigInt(Math.floor(n * 10 ** 9)).toString() }, RequestType.UserWithdraw)
}

async function claim_rewards(user: Keypair, n: number) {
    // rewards token account in contract
    // DL5VJChRV5fKB4HPNeyArHnTn21HgKQyAnUWte86P6YN
    // let validator = get_validator()
    await common_request(user, { user: user.publicKey.toString(), amount: BigInt(Math.floor(n * 10 ** 9)).toString() }, RequestType.ClaimRewards)
}

const prefix = "You need to confirm the signature to proceed with this action. This request will not trigger a blockchain transaction or incur any gas fees.\nNonce: "

async function req0(user_kp: Keypair, amount: string): Promise<CommonPreTxData> {

    let now = Math.floor(Date.now() / 1000);
    let signature_u8 = util.keyPairSignStringMessage(prefix + user_kp.publicKey.toString() + "," + amount + "," + now, user_kp)
    let signature = bs58.encode(signature_u8);
    console.log(signature);
    let resp = await axios.post("https://hyperfuse-backend-node.sonic.game/api/claim_rewards", {
        claim_rewards: amount,
        owner: user_kp.publicKey.toString(),
        sign_time: now,
        signature: signature
    })
    let data = resp.data
    console.log(data);
    return data.data;
}

function get_sign_data(user_kp, data: CommonPreTxData): CommonPreTxData {
    let tx = Transaction.from(Buffer.from(data.base64_tx, 'base64'))
    // console.log("first tx", tx)
    tx.partialSign(user_kp)
    // console.log("signed tx", tx)

    let base64_tx = tx.serialize({ verifySignatures: false }).toString('base64');

    return {
        base64_tx,
        extra_data: data.extra_data,
        sign_data: data.sign_data
    }
}

async function req1(data: CommonPreTxData) {

    return axios.post('https://hyperfuse-backend-node.sonic.game/api/process_claim_rewards', {
        base64_tx: data.base64_tx,
        extra_data: data.extra_data,
        sign_data: data.sign_data
    });

    // axios.post('https://hyperfuse-backend-node.sonic.game/api/process_claim_rewards', {
    //     base64_tx: base64_tx,
    //     extra_data: data.extra_data,
    //     sign_data: data.sign_data
    // });


}

(async () => {

    // console.log(bs58.decode('2t3BUqV88HVX9oLSt3Vt1krzXXmDEUy8CyxYhFDkTTTJVzeh7afXf1MFvG16j7C1saNEUZpk1E2c66YPeTEJrdFr'))
    let temp_u = util.get_keypair('temp_user')
    console.log(temp_u.publicKey.toString());
    let req_data = await req0(temp_u, '2000000000')
    let req_data1 = await req0(temp_u, '2000000000')
    let d0 = get_sign_data(temp_u, req_data)
    let d1 = get_sign_data(temp_u, req_data1)
    let a = await Promise.all([req1(d0), req1(d1)])
    a.forEach(v => {
        console.log(v.data)
    })
    // req1(temp_u, req_data)
    return;
    // return;
    // let temp_user = Keypair.fromSecretKey()
    // prestep mint test token to user.
    let user = util.get_keypair('user5');
    console.log(user.secretKey.toString());
    let validator = util.get_keypair('validator1')
    let user_pk = user.publicKey
    let validator_pk = validator.publicKey;
    console.log('user_pk, ', user_pk.toString())
    console.log('validator_pk, ', validator_pk.toString())
    // console.log('ata address ', getAssociatedTokenAddressSync(new PublicKey('BajqRAuFgGxzAcNr1BG3LnsnenHyzcWC2d6t4ezRsWEV'), new PublicKey('4xmsRJAdxD2KXeDP45KNwKBnx9yKAkb3oJbiyP7MLn6x')).toString())
    // airdrop to testnetv1 account
    // await util.airdrop_for_testnet_v1(user_pk.toString(), 1)
    // await transfer_token_to_user(user_pk, "1800000000000")
    // rewards_spl_token in contract
    // await transfer_token_to_account(new PublicKey("DL5VJChRV5fKB4HPNeyArHnTn21HgKQyAnUWte86P6YN"), "2000000000000")

    // step 1
    // await add_validator_main(user_pk, validator_pk)


    // step 2
    // await stake_spl_token(user, validator_pk, 900)
    if (process.env.step == "2") {
        user_stake_spl_token(user, validator_pk, 2000)
        // user_stake_spl_token(user, validator_pk, 2000)
    }




    // step 3

    // await withdraw_token(user, validator_pk, 900)
    if (process.env.step == "3") {
        await user_withdraw_token(user, validator_pk, 2000)
    }


    // step 4
    // await claim_rewards(user, 1598.334246576)

    // const balance = await connection.getBalance(user.publicKey);
    // const fee = await connection.getFeeForMessage(tx.compileMessage());
    // if (fee.value! > balance) {
    //   return;
    // }


})();


// test function
async function is_account_exist(pubkey: PublicKey): Promise<boolean> {
    let account = await connection.getAccountInfo(pubkey);
    if (account == null) {
        return false;
    }

    return true;
}

async function create_mint_token_if_not_exist(mint: Keypair) {
    if (!(await is_account_exist(mint.publicKey))) {
        await createMint(connection, payer, admin.publicKey, null, 9, mint)
    } else {
        console.log('mint account exist, skip create it.')
    }

}


async function create_ata_token_if_not_exists(user: PublicKey, mint_pk: PublicKey) {
    let ata_token = getAssociatedTokenAddressSync(mint_pk, user)

    if (!(await is_account_exist(ata_token))) {
        await createAssociatedTokenAccount(connection, payer, mint_pk, user)
    } else {
        console.log('ata account %o exist. skip it.', ata_token.toString());
    }

    return ata_token;
}

async function transfer_token_to_user(user: PublicKey, amount: string) {
    let mint = get_mint()
    await create_mint_token_if_not_exist(mint)
    let user_source_token = await create_ata_token_if_not_exists(user, mint.publicKey)
    await util.sleep(6000);
    console.log("user ata_token ", user_source_token.toString())
    console.log("transfer amount ", BigInt(amount))
    let tx = await mintTo(connection, payer, mint.publicKey, user_source_token, admin, BigInt(amount), [], { skipPreflight: true })
    console.log("mint to {}, tx ", user_source_token.toString(), tx);
}

async function transfer_token_to_account(dest_token: PublicKey, amount: string) {
    let mint = get_mint()
    let tx = await mintTo(connection, payer, mint.publicKey, dest_token, admin, BigInt(amount))
    console.log("mint to tx ", dest_token.toString(), tx);
}
// end test function
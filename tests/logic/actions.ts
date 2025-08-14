
import { Keypair, Signer, Transaction, PublicKey } from "@solana/web3.js";
import axios from "axios";
import * as util from "./util";
import { BACKEND_DOMAIN, connection, STAKE_TOKEN_MINT } from "./config";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
require("dotenv").config();


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
    await common_request(user, { user: user.publicKey.toString(), amount: BigInt(Math.floor(n * 10 ** 9)).toString() }, RequestType.ClaimRewards)
}

// below is a example
(async () => {

    let user = util.get_keypair('your solana keypair');
    let user_pk = user.publicKey
    let validator_pk = new PublicKey("validator pubkey");
    console.log('user_pk, ', user_pk.toString())
    console.log('validator_pk, ', validator_pk.toString())

    const balance = await connection.getBalance(user.publicKey);
    if (balance == 0) {
        throw "please transfer some sols into user account";
    }



    let step = process.env.step;
    // step 1
    if (step == "1") {

        // check ata account
        let user_ata = getAssociatedTokenAddressSync(STAKE_TOKEN_MINT, user_pk)
        if (!(await util.is_account_exist(user_ata))) {
            throw "please transfer stake token to user before staking"
        }

        // IMPORTANT: only use one of this. owner of validator use stake_spl_token, normal user use user_stake_spl_token
        // for owner of validator
        await stake_spl_token(user, validator_pk, 900.3)

        // for normal user
        await user_stake_spl_token(user, validator_pk, 2000.56)
    }

    // step 2
    if (step == "2") {
        // IMPORTANT: only use one of this. owner of validator use withdraw_token, normal user use user_withdraw_token
        // for owner of validator
        await withdraw_token(user, validator_pk, 900.3)

        // for normal user
        await user_withdraw_token(user, validator_pk, 2000.56)
    }

    // step 3
    if (step == "3") {
        // for owner of validator and normal user
        await claim_rewards(user, 1598.334246576)
    }


})();


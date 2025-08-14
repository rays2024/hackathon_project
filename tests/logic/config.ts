import { PublicKey } from "@solana/web3.js"
import { Connection } from "@solana/web3.js"

export const connection = new Connection('https://api.testnet.sonic.game')

export const BACKEND_DOMAIN = "http://localhost:8080/"

export const STAKE_TOKEN_MINT = new PublicKey("BajqRAuFgGxzAcNr1BG3LnsnenHyzcWC2d6t4ezRsWEV")
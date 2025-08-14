pub mod pool_state;

use anchor_lang::constant;
pub use pool_state::*;

#[constant]
pub const CONF_SEED: &str = "conf";
#[constant]
pub const TOKEN_MINT_SEED: &str = "token_mint_seed";
#[constant]
pub const PROGRAM_TOKEN_SEED: &str = "program_token_seed";
#[constant]
pub const NFT_INFO_SEED: &str = "nft_info";
#[constant]
pub const MINT_SEED: &str = "mint";
#[constant]
pub const METADATA_SEED: &str = "metadata";
#[constant]
pub const EDITION_SEED: &str = "edition";
#[constant]
pub const STAKE_SEED: &str = "stake";
#[constant]
pub const REWARDS_CONF_SEED: &str = "rewards_conf";
#[constant]
pub const REWARDS_TOKEN_SEED: &str = "rewards_token";
#[constant]
pub const PROGRAM_SOL_WALLET_SEED: &str = "program_sol_wallet";
#[constant]
pub const REWARDS_SOL_WALLET_SEED: &str = "rewards_sol_wallet";

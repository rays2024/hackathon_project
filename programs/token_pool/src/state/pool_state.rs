use anchor_lang::prelude::*;

use super::{CONF_SEED, REWARDS_CONF_SEED};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct InitParams {
    pub init_type: u8,
    pub backend_authority: Pubkey,
}

// #[derive(AnchorDeserialize, AnchorSerialize)]
// pub struct InitParams {
//     pub token_name: String,
//     pub token_symbol: String,
//     pub token_uri: String,
// }

#[account]
#[derive(Debug)]
pub struct Conf {
    pub admin: Pubkey,
    pub bump: [u8; 1],
    pub token_mint: Pubkey, // will be default value for native token.
    pub backend_authority: Pubkey,
    pub init_type: u8, // 0 spl token. 1 native token.
    pub reserved: Pubkey,
}

impl Conf {
    pub const LEN: usize = 8 + 32 + 1 + 32 + 32 + 1 + 32;

    pub fn as_seeds(&self) -> [&[u8]; 2] {
        [CONF_SEED.as_bytes(), &self.bump]
    }
}

#[account]
pub struct RewardsConf {
    pub bump: [u8; 1],
    pub token_mint: Pubkey, // will be default value for native token.
    pub reserved: Pubkey,
}

impl RewardsConf {
    pub const LEN: usize = 8 + 1 + 32 + 32;

    pub fn as_seeds(&self) -> [&[u8]; 2] {
        [REWARDS_CONF_SEED.as_bytes(), &self.bump]
    }
}

#[account]
#[derive(Debug)]
pub struct StakeAccount {
    pub user: Pubkey,
    pub stake_amount: u64,
    pub withdraw_amount: u64,
    pub withdraw_rewards_amount: u64,
    pub reserved: Pubkey,
}

impl StakeAccount {
    pub const LEN: usize = 8 + 32 + 8 + 8 + 8 + 32;
}

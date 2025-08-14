use anchor_lang::prelude::*;

#[event]
pub struct InitEvent {
    pub admin: Pubkey,
    pub conf: Pubkey,
    pub init_type: u8,
    pub backend_authority: Pubkey,
}

#[event]
pub struct InitRewardsEvent {
    pub rewards_conf: Pubkey,
    pub rewards_token_mint: Pubkey,
}

#[event]
pub struct ChangeConfigEvent {
    pub conf: Pubkey,
    pub backend_authority: Pubkey,
}

#[event]
pub struct TokenStakeEvent {
    pub payer: Pubkey,
    pub receiver: Pubkey,
    pub amount: u64,
    pub init_type: u8,
}

#[event]
pub struct TokenWithdrawEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub init_type: u8,
}

#[event]
pub struct TransferToRewardsEvent {
    pub amount: u64,
    pub init_type: u8,
}

#[event]
pub struct ClaimRewardsEvent {
    pub user: Pubkey,
    pub amount: u64,
    pub init_type: u8,
}

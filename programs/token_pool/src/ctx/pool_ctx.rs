use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{Mint, Token, TokenAccount},
};

use crate::{
    state::{Conf, RewardsConf, CONF_SEED, REWARDS_CONF_SEED, REWARDS_TOKEN_SEED, STAKE_SEED},
    StakeAccount, PROGRAM_SOL_WALLET_SEED, PROGRAM_TOKEN_SEED, REWARDS_SOL_WALLET_SEED,
};

#[derive(Accounts)]
pub struct InitializeWithSPLToken<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    // store conf
    #[account(init, payer = admin, space = Conf::LEN, seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Box<Account<'info, Conf>>,

    #[account()]
    pub token_mint: Box<Account<'info, Mint>>,

    #[account(init, payer = admin, seeds=[PROGRAM_TOKEN_SEED.as_bytes(), token_mint.key().as_ref()], bump, token::mint = token_mint, token::authority = conf)]
    pub pool_token: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct InitializeRewards<'info> {
    #[account(mut, address = conf.admin)]
    pub admin: Signer<'info>,

    #[account(mut, seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Account<'info, Conf>,

    #[account()]
    pub rewards_token_mint: Box<Account<'info, Mint>>,

    #[account(init, payer = admin, space = RewardsConf::LEN, seeds = [REWARDS_CONF_SEED.as_bytes()], bump)]
    pub rewards_conf: Box<Account<'info, RewardsConf>>,

    #[account(init, payer = admin, seeds=[REWARDS_TOKEN_SEED.as_bytes(), rewards_token_mint.key().as_ref()], bump, token::mint = rewards_token_mint, token::authority = conf)]
    pub rewards_token: Box<Account<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct ChangeConfig<'info> {
    #[account(mut, address = conf.admin)]
    pub admin: Signer<'info>,

    // store conf
    #[account(mut, seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Account<'info, Conf>,
    /// CHECK: allow any values for backend end authority
    pub new_backend_authority: UncheckedAccount<'info>,
}

#[derive(Accounts)]
pub struct StakeNativeToken<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(address = conf.backend_authority)]
    pub backend_authority: Signer<'info>,

    #[account(init_if_needed, payer=user, space = StakeAccount::LEN, seeds = [STAKE_SEED.as_bytes(), user.key().as_ref()], bump)]
    pub stake_account: Account<'info, StakeAccount>,

    // store conf
    #[account(mut, seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Account<'info, Conf>,
    /// CHECK:
    #[account(mut, seeds = [PROGRAM_SOL_WALLET_SEED.as_bytes()], bump)]
    pub program_sol_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct StakeSplToken<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(address = conf.backend_authority)]
    pub backend_authority: Signer<'info>,

    #[account(init_if_needed, payer=user, space = StakeAccount::LEN, seeds = [STAKE_SEED.as_bytes(), user.key().as_ref()], bump)]
    pub stake_account: Account<'info, StakeAccount>,

    // store conf
    #[account(seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Account<'info, Conf>,

    #[account(mut, associated_token::mint = conf.token_mint, associated_token::authority = user)]
    pub user_ata_token: Account<'info, TokenAccount>,

    #[account(mut, seeds=[PROGRAM_TOKEN_SEED.as_bytes(), conf.token_mint.as_ref()], bump)]
    pub pool_token: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct TransferToRewardsPool<'info> {
    #[account(address = conf.backend_authority)]
    pub backend_authority: Signer<'info>,

    // store conf
    #[account(mut, seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Account<'info, Conf>,

    #[account(mut, seeds=[PROGRAM_TOKEN_SEED.as_bytes(), conf.token_mint.as_ref()], bump)]
    pub pool_token: Account<'info, TokenAccount>,

    /// CHECK:
    #[account(mut, seeds = [PROGRAM_SOL_WALLET_SEED.as_bytes()], bump)]
    pub program_sol_wallet: AccountInfo<'info>,

    #[account(address = conf.token_mint)]
    pub token_mint: Account<'info, Mint>,

    #[account(mut,  seeds = [REWARDS_CONF_SEED.as_bytes()], bump)]
    pub rewards_conf: Box<Account<'info, RewardsConf>>,

    #[account(mut, seeds=[REWARDS_TOKEN_SEED.as_bytes(), token_mint.key().as_ref()], bump)]
    pub rewards_token: Box<Account<'info, TokenAccount>>,
    /// CHECK:
    #[account(mut, seeds = [REWARDS_SOL_WALLET_SEED.as_bytes()], bump)]
    pub rewards_sol_wallet: AccountInfo<'info>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(address = conf.backend_authority)]
    pub backend_authority: Signer<'info>,

    #[account(mut,  seeds = [STAKE_SEED.as_bytes(), user.key().as_ref()], bump)]
    pub stake_account: Account<'info, StakeAccount>,
    // store conf
    #[account(mut,seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Account<'info, Conf>,
    /// CHECK:
    #[account(mut, seeds = [PROGRAM_SOL_WALLET_SEED.as_bytes()], bump)]
    pub program_sol_wallet: AccountInfo<'info>,

    #[account(address = conf.token_mint)]
    pub token_mint: Account<'info, Mint>,

    /// for sol token just create a empty ata account for user if it doesn't exist
    #[account(init_if_needed, payer=user, associated_token::mint = token_mint, associated_token::authority = user)]
    pub user_ata_token: Account<'info, TokenAccount>,

    #[account(mut, seeds=[PROGRAM_TOKEN_SEED.as_bytes(), conf.token_mint.as_ref()], bump)]
    pub pool_token: Account<'info, TokenAccount>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct ClaimRewards<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    #[account(address = conf.backend_authority)]
    pub backend_authority: Signer<'info>,

    // #[account(mut, seeds = [STAKE_SEED.as_bytes(), user.key().as_ref()], bump)]
    // pub stake_account: Account<'info, StakeAccount>,

    // store conf
    #[account(mut,seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Account<'info, Conf>,
    /// CHECK:
    #[account(mut, seeds = [REWARDS_SOL_WALLET_SEED.as_bytes()], bump)]
    pub rewards_sol_wallet: AccountInfo<'info>,

    #[account(address = conf.token_mint)]
    pub token_mint: Account<'info, Mint>,

    /// for sol token just create a empty ata account for user if it doesn't exist
    #[account(init_if_needed, payer=user, associated_token::mint = token_mint, associated_token::authority = user)]
    pub user_ata_token: Account<'info, TokenAccount>,

    #[account(mut, seeds = [REWARDS_CONF_SEED.as_bytes()], bump)]
    pub rewards_conf: Account<'info, RewardsConf>,

    #[account(mut, seeds=[REWARDS_TOKEN_SEED.as_bytes(), rewards_conf.token_mint.as_ref()], bump)]
    pub rewards_token: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
/*

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    // store conf
    #[account(init, payer = admin, space = Conf::LEN, seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Account<'info, Conf>,

    #[account(init, payer = admin, seeds = [TOKEN_MINT_SEED.as_bytes()], bump, mint::authority = conf, mint::decimals = 9 )]
    pub token_mint: Account<'info, Mint>,

    #[account(init, payer = admin, seeds=[PROGRAM_TOKEN_SEED.as_bytes(), token_mint.key().as_ref()], bump, token::mint = token_mint, token::authority = conf)]
    pub pool_token: Account<'info, TokenAccount>,

    /// CHECK: metaplex will allocate and init it.
    #[account(mut,seeds = [METADATA_SEED.as_bytes(), metadata_program.key().as_ref(), token_mint.key().as_ref()], seeds::program = metadata_program.key(),bump)]
    pub token_metadata: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub metadata_program: Program<'info, Metadata>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct SupplyToken<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    // store conf
    #[account(seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Account<'info, Conf>,

    #[account(constraint = conf.token_mint == token_mint.key())]
    pub token_mint: Account<'info, Mint>,

    #[account(mut, constraint = payer_token.mint == token_mint.key(), constraint = payer_token.owner == payer.key())]
    pub payer_token: Account<'info, TokenAccount>,

    #[account(mut, seeds=[PROGRAM_TOKEN_SEED.as_bytes(), token_mint.key().as_ref()], bump)]
    pub pool_token: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

impl<'info> Initialize<'info> {
    pub fn create_token_metadata_accounts_ctx(
        &self,
    ) -> CpiContext<'_, '_, '_, 'info, CreateMetadataAccountsV3<'info>> {
        let program = self.metadata_program.to_account_info();
        let accounts = CreateMetadataAccountsV3 {
            metadata: self.token_metadata.to_account_info(),
            mint: self.token_mint.to_account_info(),
            mint_authority: self.conf.to_account_info(),
            payer: self.admin.to_account_info(),
            update_authority: self.conf.to_account_info(),
            system_program: self.system_program.to_account_info(),
            rent: self.rent.to_account_info(),
        };
        CpiContext::new(program, accounts)
    }
}

*/

/*
#[derive(Accounts)]
pub struct SwitchToAMM<'info> {
    #[account(mut)]
    pub admin: Signer<'info>,

    #[account(mut, constraint = conf.admin == admin.key(), constraint = conf.is_pool == false, seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Account<'info, Conf>,

    #[account(constraint = pool_token.amount >0, seeds=[PROGRAM_TOKEN_SEED.as_bytes(), conf.token_mint.as_ref()], bump)]
    pub pool_token: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    // pub token_program: Program<'info, Token>,
    // pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Swap<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: no check for it
    #[account(mut)]
    pub receiver: UncheckedAccount<'info>,

    #[account(mut, seeds = [CONF_SEED.as_bytes()], bump)]
    pub conf: Account<'info, Conf>,

    #[account(mut, constraint = conf.token_mint == token_mint.key())]
    pub token_mint: Account<'info, Mint>,

    #[account(init_if_needed, payer=payer, associated_token::mint = token_mint, associated_token::authority = payer)]
    pub payer_token: Account<'info, TokenAccount>,

    #[account(init_if_needed, payer = payer, associated_token::mint = token_mint, associated_token::authority = receiver)]
    pub receiver_ata_token: Account<'info, TokenAccount>,

    #[account(mut, seeds=[PROGRAM_TOKEN_SEED.as_bytes(), token_mint.key().as_ref()], bump)]
    pub pool_token: Account<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub rent: Sysvar<'info, Rent>,
}
 */

use anchor_lang::prelude::*;
use ctx::*;
use state::*;

pub mod ctx;
pub mod error;
pub mod events;
pub mod instructions;
pub mod state;

#[cfg(feature = "localnet")]
declare_id!("2NueBFH5VmAM3o9iDyZf1Z5tt7dZZvnXXw6w3rLUWirU");
#[cfg(feature = "devnet")]
declare_id!("2NueBFH5VmAM3o9iDyZf1Z5tt7dZZvnXXw6w3rLUWirU");
#[cfg(feature = "testnet")]
declare_id!("2NueBFH5VmAM3o9iDyZf1Z5tt7dZZvnXXw6w3rLUWirU");
#[cfg(feature = "mainnet")]
declare_id!("2NueBFH5VmAM3o9iDyZf1Z5tt7dZZvnXXw6w3rLUWirU");

mod native_mint {
    anchor_lang::declare_id!("So11111111111111111111111111111111111111112");
}

mod metaplex {
    #[cfg(feature = "localnet")]
    anchor_lang::declare_id!("A5aTXEEGjFkFmdyzKB9DbEiJcBjeQd8ymFvgkeGvdzM1");
    #[cfg(feature = "testnet")]
    anchor_lang::declare_id!("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
}

#[program]
pub mod token_pool {

    use super::*;

    // it support native sol, for native sol, we will use wsol address as spl token and transfer sol to conf account.
    pub fn initialize_with_spl_token(
        ctx: Context<InitializeWithSPLToken>,
        params: InitParams,
    ) -> Result<()> {
        instructions::initialize_with_spl_token_handler(ctx, params)
    }

    pub fn initialize_with_rewards(ctx: Context<InitializeRewards>) -> Result<()> {
        instructions::initialize_rewards_handler(ctx)
    }

    pub fn change_conf(ctx: Context<ChangeConfig>) -> Result<()> {
        instructions::change_config_handler(ctx)
    }

    pub fn stake_spl_token(ctx: Context<StakeSplToken>, amount: u64) -> Result<()> {
        instructions::stake_spl_token_handler(ctx, amount)
    }
    pub fn stake_native_token(ctx: Context<StakeNativeToken>, amount: u64) -> Result<()> {
        instructions::stake_native_token_handler(ctx, amount)
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        instructions::withdraw_token_handler(ctx, amount)
    }

    pub fn claim_rewards(ctx: Context<ClaimRewards>, amount: u64) -> Result<()> {
        instructions::claim_rewards_handler(ctx, amount)
    }

    pub fn transfer_to_rewards(ctx: Context<TransferToRewardsPool>, amount: u64) -> Result<()> {
        instructions::transfer_to_rewards_handler(ctx, amount)
    }

    // pub fn supply_token(ctx: Context<SupplyToken>, amount: u64) -> Result<()> {
    //     instructions::supply_token_handler(ctx, amount)
    // }

    // pub fn initialize(ctx: Context<Initialize>, params: InitParams) -> Result<()> {
    //     instructions::initialize_handler(ctx, params)
    // }

    // pub fn change_conf(ctx: Context<SwitchToAMM>) -> Result<()> {
    //     instructions::switch_to_amm_handler(ctx)
    // }

    // pub fn swap(ctx: Context<Swap>, amount_in: u64, swap_type: u8) -> Result<()> {
    //     instructions::swap_handler(ctx, amount_in, swap_type)
    // }
}

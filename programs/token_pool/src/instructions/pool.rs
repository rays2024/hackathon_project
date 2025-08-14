use anchor_lang::{prelude::*, system_program};
use anchor_spl::token::{self};

use crate::{
    ctx::{
        ChangeConfig, ClaimRewards, InitializeRewards, InitializeWithSPLToken, StakeNativeToken,
        StakeSplToken, Withdraw,
    },
    error::CustomError,
    events::{
        ChangeConfigEvent, ClaimRewardsEvent, InitEvent, InitRewardsEvent, TokenStakeEvent,
        TokenWithdrawEvent, TransferToRewardsEvent,
    },
    state::InitParams,
    TransferToRewardsPool, PROGRAM_SOL_WALLET_SEED, REWARDS_SOL_WALLET_SEED,
};

// pub struct MyMetadata {}

// impl anchor_lang::Id for MyMetadata {
//     fn id() -> Pubkey {
//         Pubkey::from_str("A5aTXEEGjFkFmdyzKB9DbEiJcBjeQd8ymFvgkeGvdzM1").unwrap()
//     }
// }
pub fn initialize_with_spl_token_handler(
    ctx: Context<InitializeWithSPLToken>,
    params: InitParams,
) -> Result<()> {
    let conf = &mut ctx.accounts.conf;
    conf.bump = [ctx.bumps.conf];
    conf.admin = ctx.accounts.admin.key();
    conf.token_mint = ctx.accounts.token_mint.key();
    conf.init_type = params.init_type;
    conf.backend_authority = params.backend_authority;

    emit!(InitEvent {
        admin: conf.admin,
        conf: conf.key(),
        init_type: conf.init_type, // 0 spl token. 1 native token.
        backend_authority: conf.backend_authority
    });
    Ok(())
}

pub fn initialize_rewards_handler(ctx: Context<InitializeRewards>) -> Result<()> {
    let rewards_conf = &mut ctx.accounts.rewards_conf;
    rewards_conf.bump = [ctx.bumps.rewards_conf];
    rewards_conf.token_mint = ctx.accounts.rewards_token_mint.key();

    emit!(InitRewardsEvent {
        rewards_conf: rewards_conf.key(),
        rewards_token_mint: ctx.accounts.rewards_token_mint.key()
    });
    Ok(())
}

pub fn change_config_handler(ctx: Context<ChangeConfig>) -> Result<()> {
    let conf = &mut ctx.accounts.conf;
    conf.backend_authority = ctx.accounts.new_backend_authority.key();

    emit!(ChangeConfigEvent {
        conf: conf.key(),
        backend_authority: conf.backend_authority
    });

    Ok(())
}

pub fn stake_native_token_handler(ctx: Context<StakeNativeToken>, amount: u64) -> Result<()> {
    require!(amount > 0, CustomError::InputAmountIsZero);
    let init_type = ctx.accounts.conf.init_type;
    require!(init_type == 1, CustomError::NotNativeToken);

    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.program_sol_wallet.to_account_info(),
            },
        ),
        amount,
    )?;

    let stake_account = &mut ctx.accounts.stake_account;
    stake_account.user = ctx.accounts.user.key();
    stake_account.stake_amount += amount;

    emit!(TokenStakeEvent {
        payer: ctx.accounts.user.key(),
        receiver: ctx.accounts.conf.key(),
        amount,
        init_type,
    });

    Ok(())
}

pub fn stake_spl_token_handler(ctx: Context<StakeSplToken>, amount: u64) -> Result<()> {
    require!(amount > 0, CustomError::InputAmountIsZero);
    let init_type = ctx.accounts.conf.init_type;
    require!(init_type == 0, CustomError::NotSplToken);

    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.user_ata_token.to_account_info(),
                to: ctx.accounts.pool_token.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        amount,
    )?;

    let stake_account = &mut ctx.accounts.stake_account;
    stake_account.user = ctx.accounts.user.key();
    stake_account.stake_amount += amount;

    emit!(TokenStakeEvent {
        payer: ctx.accounts.user.key(),
        receiver: ctx.accounts.conf.key(),
        amount,
        init_type,
    });

    Ok(())
}

pub fn transfer_to_rewards_handler(ctx: Context<TransferToRewardsPool>, amount: u64) -> Result<()> {
    require!(amount > 0, CustomError::InputAmountIsZero);

    let init_type = ctx.accounts.conf.init_type;
    if init_type == 0 {
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.pool_token.to_account_info(),
                    to: ctx.accounts.rewards_token.to_account_info(),
                    authority: ctx.accounts.conf.to_account_info(),
                },
            )
            .with_signer(&[&ctx.accounts.conf.as_seeds()]),
            amount,
        )?;
    } else if init_type == 1 {
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.program_sol_wallet.to_account_info(),
                    to: ctx.accounts.rewards_sol_wallet.to_account_info(),
                },
            )
            .with_signer(&[&[
                PROGRAM_SOL_WALLET_SEED.as_bytes(),
                &[ctx.bumps.program_sol_wallet],
            ]]),
            amount,
        )?;
    }

    emit!(TransferToRewardsEvent { amount, init_type });

    Ok(())
}

pub fn withdraw_token_handler(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
    require!(amount > 0, CustomError::InputAmountIsZero);
    let stake_account = &mut ctx.accounts.stake_account;
    require!(
        amount <= stake_account.stake_amount,
        CustomError::NotEnoughStakeAmountForUser
    );

    let user = ctx.accounts.user.key();
    let init_type = ctx.accounts.conf.init_type;
    if init_type == 0 {
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.pool_token.to_account_info(),
                    to: ctx.accounts.user_ata_token.to_account_info(),
                    authority: ctx.accounts.conf.to_account_info(),
                },
            )
            .with_signer(&[&ctx.accounts.conf.as_seeds()]),
            amount,
        )?;
    } else if init_type == 1 {
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.program_sol_wallet.to_account_info(),
                    to: ctx.accounts.user.to_account_info(),
                },
            )
            .with_signer(&[&[
                PROGRAM_SOL_WALLET_SEED.as_bytes(),
                &[ctx.bumps.program_sol_wallet],
            ]]),
            amount,
        )?;
    }

    stake_account.withdraw_amount += amount;
    stake_account.stake_amount -= amount;

    emit!(TokenWithdrawEvent {
        user,
        amount,
        init_type
    });

    Ok(())
}

pub fn claim_rewards_handler(ctx: Context<ClaimRewards>, amount: u64) -> Result<()> {
    require!(amount > 0, CustomError::InputAmountIsZero);
    // let stake_account = &mut ctx.accounts.stake_account;
    let user = ctx.accounts.user.key();
    let init_type = ctx.accounts.conf.init_type;
    if init_type == 0 {
        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.rewards_token.to_account_info(),
                    to: ctx.accounts.user_ata_token.to_account_info(),
                    authority: ctx.accounts.conf.to_account_info(),
                },
            )
            .with_signer(&[&ctx.accounts.conf.as_seeds()]),
            amount,
        )?;
    } else if init_type == 1 {
        system_program::transfer(
            CpiContext::new(
                ctx.accounts.system_program.to_account_info(),
                system_program::Transfer {
                    from: ctx.accounts.rewards_sol_wallet.to_account_info(),
                    to: ctx.accounts.user.to_account_info(),
                },
            )
            .with_signer(&[&[
                REWARDS_SOL_WALLET_SEED.as_bytes(),
                &[ctx.bumps.rewards_sol_wallet],
            ]]),
            amount,
        )?;
    }

    // stake_account.withdraw_rewards_amount += amount;

    emit!(ClaimRewardsEvent {
        user,
        amount,
        init_type
    });

    Ok(())
}
/*
pub fn initialize_handler(ctx: Context<Initialize>, params: InitParams) -> Result<()> {
    let conf = &mut ctx.accounts.conf;
    conf.bump = [ctx.bumps.conf];
    conf.initialized = true;
    conf.admin = ctx.accounts.admin.key();

    conf.token_mint = ctx.accounts.token_mint.key();
    conf.init_type = 1;

    let is_mutable = true;
    let update_authority_is_signer = true;
    metadata::create_metadata_accounts_v3(
        ctx.accounts
            .create_token_metadata_accounts_ctx()
            .with_signer(&[&ctx.accounts.conf.as_seeds()]),
        DataV2 {
            name: params.token_name,
            symbol: params.token_symbol,
            uri: params.token_uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        },
        is_mutable,
        update_authority_is_signer,
        None,
    )?;

    Ok(())
}

pub fn supply_token_handler(ctx: Context<SupplyToken>, amount: u64) -> Result<()> {
    require!(amount > 0, CustomError::InputAmountIsZero);
    token::transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.payer_token.to_account_info(),
                to: ctx.accounts.pool_token.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        ),
        amount,
    )?;

    Ok(())
}
*/

/*
pub fn switch_to_amm_handler(ctx: Context<SwitchToAMM>) -> Result<()> {
    let conf = &mut ctx.accounts.conf;
    conf.is_pool = true;

    Ok(())
}

pub fn safe_u64_mul_dev(a: u64, b: u64, c: u64) -> u64 {
    ((a as u128 * b as u128) / c as u128) as u64
}

pub fn swap_handler(ctx: Context<Swap>, input_amount: u64, swap_type: u8) -> Result<()> {
    let conf = &ctx.accounts.conf;

    require!(input_amount > 0, CustomError::InputAmountIsZero);

    let mut token_mint_decimal = 9;

    if conf.init_type == 0 {
        // outside token.
        token_mint_decimal = ctx.accounts.token_mint.decimals;
    }

    let delta_decimal: i8 = token_mint_decimal as i8 - 9;

    let mut numerator = 1;
    let mut denominator = 1;
    if delta_decimal > 0 {
        numerator = 10u64.pow(delta_decimal as u32)
    } else {
        denominator = 10u64.pow(delta_decimal.abs() as u32)
    }

    if conf.is_pool {
        // transfer sol in and get token out
        if swap_type == 0 {
            let r_in = ctx.accounts.conf.get_lamports();
            let r_out = ctx.accounts.pool_token.amount;

            require!(r_in > 0, CustomError::NotPoolSolReserved);
            require!(r_out > 0, CustomError::NotPoolTokenReserved);

            let out_amount = safe_u64_mul_dev(r_out, input_amount, r_in + input_amount);

            system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    system_program::Transfer {
                        from: ctx.accounts.payer.to_account_info(),
                        to: ctx.accounts.conf.to_account_info(),
                    },
                ),
                input_amount,
            )?;

            // out amount is the actual amount. don't need to cal again.
            // let out_amount = safe_u64_mul_dev(out_amount, numerator, denominator);

            require!(out_amount > 0, CustomError::SwapAmountIsTooSmall);
            // transfer token to user
            // token::mint_to(
            //     CpiContext::new(
            //         ctx.accounts.token_program.to_account_info(),
            //         MintTo {
            //             mint: ctx.accounts.token_mint.to_account_info(),
            //             to: ctx.accounts.receiver_ata_token.to_account_info(),
            //             authority: ctx.accounts.conf.to_account_info(),
            //         },
            //     )
            //     .with_signer(&[&conf.as_seeds()]),
            //     out_amount,
            // )?;

            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    token::Transfer {
                        from: ctx.accounts.pool_token.to_account_info(),
                        to: ctx.accounts.receiver_ata_token.to_account_info(),
                        authority: ctx.accounts.conf.to_account_info(),
                    },
                )
                .with_signer(&[&conf.as_seeds()]),
                out_amount,
            )?;

            msg!("pool sol in {}", input_amount);
            msg!("pool token out {}", out_amount);
        } else {
            // transfer token in and get sol out.
            let r_in = ctx.accounts.pool_token.amount;
            let r_out = ctx.accounts.conf.get_lamports();

            require!(r_in > 0, CustomError::NotPoolTokenReserved);
            require!(r_out > 0, CustomError::NotPoolSolReserved);

            let out_amount = safe_u64_mul_dev(r_out, input_amount, r_in + input_amount);

            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    token::Transfer {
                        from: ctx.accounts.payer_token.to_account_info(),
                        to: ctx.accounts.pool_token.to_account_info(),
                        authority: ctx.accounts.payer.to_account_info(),
                    },
                ),
                input_amount,
            )?;

            // let out_amount = safe_u64_mul_dev(out_amount, denominator, numerator);

            require!(out_amount > 0, CustomError::SwapAmountIsTooSmall);

            conf.sub_lamports(out_amount)?;

            ctx.accounts.receiver.add_lamports(out_amount)?;

            msg!("pool token in {}", input_amount);
            msg!("pool sol out {}", out_amount);
        }
    } else {
        if swap_type == 0 {
            // transfer sol in and get token out.
            system_program::transfer(
                CpiContext::new(
                    ctx.accounts.system_program.to_account_info(),
                    system_program::Transfer {
                        from: ctx.accounts.payer.to_account_info(),
                        to: ctx.accounts.conf.to_account_info(),
                    },
                ),
                input_amount,
            )?;

            let out_amount = input_amount * numerator / denominator;

            require!(out_amount > 0, CustomError::SwapAmountIsTooSmall);

            // // mint ins token to user pool
            // token::mint_to(
            //     CpiContext::new(
            //         ctx.accounts.token_program.to_account_info(),
            //         MintTo {
            //             mint: ctx.accounts.token_mint.to_account_info(),
            //             to: ctx.accounts.receiver_ata_token.to_account_info(),
            //             authority: ctx.accounts.conf.to_account_info(),
            //         },
            //     )
            //     .with_signer(&[&conf.as_seeds()]),
            //     out_amount,
            // )?;

            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    token::Transfer {
                        from: ctx.accounts.pool_token.to_account_info(),
                        to: ctx.accounts.receiver_ata_token.to_account_info(),
                        authority: ctx.accounts.conf.to_account_info(),
                    },
                )
                .with_signer(&[&conf.as_seeds()]),
                out_amount,
            )?;

            // token::transfer(
            //     CpiContext::new(
            //         ctx.accounts.token_program.to_account_info(),
            //         token::Transfer {
            //             from: ctx.accounts.pool_token.to_account_info(),
            //             to: ctx.accounts.receiver_ata_token.to_account_info(),
            //             authority: ctx.accounts.conf.to_account_info(),
            //         },
            //     ).with_signer(&[&conf.as_seeds()]),
            //     input_amount,
            // )?;

            msg!("sol in amount: {}", input_amount);
            msg!("token out amount: {}", out_amount);
        } else {
            // transfer token in and get sol out.

            token::transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    token::Transfer {
                        from: ctx.accounts.payer_token.to_account_info(),
                        to: ctx.accounts.pool_token.to_account_info(),
                        authority: ctx.accounts.payer.to_account_info(),
                    },
                ),
                input_amount,
            )?;

            let out_amount = input_amount * denominator / numerator;

            require!(out_amount > 0, CustomError::SwapAmountIsTooSmall);

            require!(conf.get_lamports() >= out_amount, CustomError::NotEnoughSol);

            conf.sub_lamports(out_amount)?;

            // system_program::transfer(
            //     CpiContext::new(
            //         ctx.accounts.system_program.to_account_info(),
            //         system_program::Transfer {
            //             from: ctx.accounts.minter.to_account_info(),
            //             to: ctx.accounts.fund_pool.to_account_info(),
            //         },
            //     ),
            //     user_can_wd_amount,
            // )?;

            ctx.accounts.receiver.add_lamports(out_amount)?;

            msg!("token in amount: {}", input_amount);
            msg!("sol out amount: {}", out_amount);
        }
    }

    emit!(TokenSwap {
        payer: ctx.accounts.payer.key(),
        receiver: ctx.accounts.receiver.key(),
        is_pool: conf.is_pool,
        swap_type
    });

    Ok(())
}
*/

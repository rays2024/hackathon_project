use anchor_lang::error_code;

#[error_code]
pub enum CustomError {
    #[msg("InputAmountIsZero")]
    InputAmountIsZero,

    #[msg("NotEnoughStakeAmountForUser")]
    NotEnoughStakeAmountForUser,

    #[msg("NotPoolTokenReserved")]
    NotPoolTokenReserved,

    #[msg("NotPoolSolReserved")]
    NotPoolSolReserved,

    #[msg("SwapAmountIsTooSmall")]
    SwapAmountIsTooSmall,

    #[msg("NotSplToken")]
    NotSplToken,

    #[msg("NotNativeToken")]
    NotNativeToken,
}

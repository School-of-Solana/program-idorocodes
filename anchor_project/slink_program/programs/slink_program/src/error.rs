use anchor_lang::prelude::*;


#[error_code]
pub enum ErrorCode{
    #[msg("Sorry, this slink has already been claimed!")]
    AlreadyClaimed,
    #[msg("Incorrect claim key, please try again")]
    InvalidClaimKey,
    #[msg("Insufficient Balance")]
    InsufficientBalance,
    #[msg("Description too long")]
    DescriptionTooLong,
    #[msg("not slink creator")]
    NonCreator,
    #[msg("incorrect slink id")]
    IncorrectSlinkId,
    #[msg("cannot cancel already claimed slink")]
    CannotCancelAlradyClaimedSlink
}
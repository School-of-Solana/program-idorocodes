use anchor_lang::prelude::*;

#[event]
pub struct SlinkCreated {
    pub creator: Pubkey,
    pub amount: u64,
}

#[event]
#[derive(Debug, Clone)]
pub struct SlinkClaimed {
    pub owner: Pubkey,
    pub is_claimed: bool,
    pub recipient: Pubkey,
}

#[event]
pub struct SlinkClosed {
    pub owner: Pubkey,
}

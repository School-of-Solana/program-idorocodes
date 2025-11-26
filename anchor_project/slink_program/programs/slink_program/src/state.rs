use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct SlinkVault {
    pub creator: Pubkey,
    #[max_len(50)]
    pub description: String,
    #[max_len(40)]
    pub slink_id: String,
    pub amount: u64,
    #[max_len(50)]
    pub claim_key_hash:String,
    pub is_claimed: bool,
}

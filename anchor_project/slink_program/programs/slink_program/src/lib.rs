use anchor_lang::prelude::*;

mod handlers;

pub use handlers::*;

pub mod error;

pub mod event;

pub mod state;

declare_id!("4goWpqS7XGfyvXZAKSf7mdUPShMoFZWvmS4S5H21xY9s");

#[program]
pub mod slink_program {
    use super::*;

    pub fn create(
        ctx: Context<CreateSlink>,
        slink_id: String,
        amount: u64,
        description: String,
        claim_key: String,
    ) -> Result<()> {
        create_slink(ctx, slink_id, amount, description, claim_key)
    }

    pub fn claim(ctx: Context<ClaimSlink>,
        slink_id: String,
        claim_key: String
    ) -> Result<()> {
        claim_slink(ctx, slink_id, claim_key)
    }
    
    pub fn cancel(ctx:Context<CancelSlink>,slink_id: String)->Result<()>{
        cancel_slink(ctx,slink_id)
    }
}

#[derive(Accounts)]
pub struct Initialize {}

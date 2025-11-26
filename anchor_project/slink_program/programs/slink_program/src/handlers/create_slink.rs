use crate::error::ErrorCode;
use crate::event::*;
use crate::state::*;
use anchor_lang::prelude::*;
use anchor_lang::system_program::transfer;
use anchor_lang::system_program::Transfer;

pub fn create_slink(
    ctx: Context<CreateSlink>,
    slink_id: String,
    amount: u64,
    description: String,
    claim_key: String,
) -> Result<()> {
    require!(description.len() <= 50, ErrorCode::DescriptionTooLong);

    let user = &ctx.accounts.creator;

    require!(user.lamports() >= amount, ErrorCode::InsufficientBalance);

    let vault = &mut ctx.accounts.slink_vault;

    let from_pubkey = ctx.accounts.creator.to_account_info();
    let to_pubkey = vault.to_account_info();
    let program_id = ctx.accounts.system_program.to_account_info();

    let cpi_context = CpiContext::new(
        program_id,
        Transfer {
            from: from_pubkey,
            to: to_pubkey,
        },
    );

    transfer(cpi_context, amount)?;

    vault.creator = user.key();
    vault.description = description;
    vault.slink_id = slink_id;
    vault.amount = amount;
    vault.claim_key_hash = claim_key;
    vault.is_claimed = false;

    emit!(SlinkCreated {
        creator: vault.creator,
        amount: vault.amount,
    });

    msg!("Slink created!");

    Ok(())
}

#[derive(Accounts)]
#[instruction(slink_id:String,)]
pub struct CreateSlink<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(init,
        payer = creator,
        space = 8 + SlinkVault::INIT_SPACE,
        seeds = [b"slink_vault", slink_id.as_bytes().as_ref()],
        bump)]
    pub slink_vault: Account<'info, SlinkVault>,
    

    pub system_program: Program<'info, System>,
}

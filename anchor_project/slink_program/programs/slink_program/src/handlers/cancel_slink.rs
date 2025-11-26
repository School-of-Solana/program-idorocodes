use crate::error::ErrorCode;
use crate::event::*;
use crate::state::*;
use anchor_lang::prelude::*;
pub fn cancel_slink(ctx: Context<CancelSlink>, slink_id: String) -> Result<()> {
    let vault = &mut ctx.accounts.slink_vault;

    require!(
        vault.creator == ctx.accounts.creator.key(),
        ErrorCode::NonCreator
    );
    require!(vault.slink_id == slink_id,
        ErrorCode::IncorrectSlinkId);
    require!(
        vault.is_claimed == false,
        ErrorCode::CannotCancelAlradyClaimedSlink
    );
    vault.is_claimed = true;

    let vault_account = vault.to_account_info();
    let creator_account = ctx.accounts.creator.to_account_info();

   
    vault_account.sub_lamports(vault.amount)?;
    creator_account.add_lamports(vault.amount)?;
    

    emit!(SlinkClosed {
        owner: vault.creator,
    });

    msg!("✅ Slink cancelled and funds returned!");

    Ok(())
}

#[derive(Accounts)]
#[instruction(slink_id: String)]
pub struct CancelSlink<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,

    #[account(
        mut,
        has_one = creator,
        close = creator,
        seeds = [b"slink_vault", slink_id.as_bytes()],
        bump
    )]
    pub slink_vault: Account<'info, SlinkVault>,

    pub system_program: Program<'info, System>,
}

use crate::error::ErrorCode;
use crate::event::*;
use crate::state::*;
use anchor_lang::prelude::*;

pub fn claim_slink(ctx: Context<ClaimSlink>, slink_id: String, claim_key: String) -> Result<()> {
    let recipient = &ctx.accounts.recipient;
    let vault_balance = ctx.accounts.slink_vault.amount;

    let vault = &mut ctx.accounts.slink_vault;

    require!(vault.slink_id == slink_id, ErrorCode::IncorrectSlinkId);

    require!(vault.is_claimed == false, ErrorCode::AlreadyClaimed);

    require!(
        vault.claim_key_hash == claim_key,
        ErrorCode::InvalidClaimKey
    );

    let from_pubkey = vault.to_account_info();

    let to_pubkey = recipient.to_account_info();

    from_pubkey.sub_lamports(vault_balance)?;
    to_pubkey.add_lamports(vault_balance)?;

    vault.is_claimed = true;

    emit!(SlinkClaimed {
        recipient: recipient.key(),
        owner: vault.creator,
        is_claimed: true
    });

    msg!("Slink claimed!");

    Ok(())
}

#[derive(Accounts)]
#[instruction(slink_id:String)]
pub struct ClaimSlink<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,

    #[account(mut,
        seeds = [b"slink_vault",slink_id.as_bytes().as_ref()],
        bump)]
    pub slink_vault: Account<'info, SlinkVault>,

    #[account(mut)]
    pub recipient: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}

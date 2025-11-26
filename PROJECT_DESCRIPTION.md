# Project Description

**Deployed Frontend URL:** [TODO: Link to your deployed frontend]

**Solana Program ID:** 4goWpqS7XGfyvXZAKSf7mdUPShMoFZWvmS4S5H21xY9s

## Project Overview

### Description
Slink is a lightweight, on-chain value-transfer protocol that lets users lock SOL into a PDA vault and generate a shareable claim link. Anyone with the correct claim key can unlock the funds and withdraw them.

Think of Slink as a Web3 cash-drop system:

The creator locks SOL + a description + a secret claim key.

A PDA vault is created for that Slink.

The creator shares the Slink link and claim key with the intended recipient.

The recipient visits the site, enters the claim key, and instantly withdraws the locked SOL to their wallet.

This creates a simple, permissionless, gas-efficient way to transfer SOL without needing to know the recipient’s wallet upfront.
### Key Features
[TODO: List the main features of your dApp. Be specific about what users can do.]

- Feature 1: [Description]
- Feature 2: [Description]
- ...
  
### How to Use the dApp
Create Slinks: Lock any amount of SOL into a PDA vault with a short description.

Claim Slinks: Anyone with the claim key can withdraw the funds.

Secure Claim Keys: Claim logic validates keys and prevents double-claiming.

Predictable PDA Vaults: Deterministic vault addresses using "slink_vault" + slink_id.

Anchor Events: Emits events on creation for analytics and indexing.

Modern React Frontend:
• Wallet adapter
• Realtime status messages
• Automatic PDA derivation
• Clean UI for create + claim flows

## Program Architecture
Overview

The Slink program revolves around a single PDA vault for each created Slink.
Each vault stores:

Creator

Amount locked

Description

Slink ID

Claim key hash

Claim state

The program executes two key instructions:

create_slink: initializes the vault + moves SOL in

claim_slink: validates the claim key + transfers SOL out

### PDA Usage

Overview

The Slink program revolves around a single PDA vault for each created Slink.
Each vault stores:

Creator

Amount locked

Description

Slink ID

Claim key hash

Claim state

The program executes two key instructions:

create_slink: initializes the vault + moves SOL in

claim_slink: validates the claim key + transfers SOL out

Program Instructions
1. create_slink(...)

Creates a PDA vault and transfers SOL from the creator into it.

Core logic:

Reject descriptions > 50 chars.

Check user has enough SOL.

Initialize vault.

Perform CPI to system_program::transfer.

Store metadata (creator, amount, claim key hash).

Emit SlinkCreated.

2. claim_slink(...)

Allows a user to claim funds if they provide the correct claim key.

Core logic:

Validate claim key.

Ensure the vault is not already claimed.

Transfer lamports to the claimant.

Mark is_claimed = true.


### Account Structure


```rust
// Example account structure (replace with your actual structs)
#[account]#[account]
pub struct SlinkVault {
    pub creator: Pubkey, 
    pub slink_id: String, 
    pub description: String, 
    pub amount: u64,
    pub claim_key_hash: String,
    pub is_claimed: bool,
}
```

## Testing

### Test CoverageHappy Paths

Create a Slink with valid inputs.

Claim a Slink with correct claim key.

Validate funds transfer into and out of the vault.

Confirm events emitted.

Unhappy Paths

Oversized descriptions (>50 chars).

Insufficient balance during creation.

Incorrect claim key.

Attempting to claim an already claimed Slink.

Invalid PDA derivation or missing account.

### Running Tests
```bash
# Commands to run your tests
anchor test
```

### Additional Notes for Evaluators

The system uses strict PDA validation to eliminate account spoofing.

All SOL transfers are done via CPI to System Program for correctness.

Frontend computes PDA before creation to ensure deterministic addresses.

Fully compatible with Phantom, Solflare, and all Wallet Adapter wallets.

Architecture is clean, minimal, and easily extensible:

Expirations

Multi-claim

Time-locked vaults

Encrypted claim keys
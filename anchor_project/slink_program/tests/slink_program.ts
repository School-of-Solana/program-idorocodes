import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Keypair } from "@solana/web3.js";
import { SlinkProgram } from "../target/types/slink_program";
const { assert } = require("chai");

describe("slink_program", () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.SlinkProgram as Program<SlinkProgram>;

  const creator = anchor.web3.Keypair.generate();
  const user = anchor.web3.Keypair.generate();
  const recipient = anchor.web3.Keypair.generate();

  const slinkId = "test123";
  const amount = new anchor.BN(1_000_000);
  const description = "Unit test slink";
  const claimKey = "claim-xyz";

  const VAULT_SEED = Buffer.from("slink_vault");

  let vaultPda: PublicKey;
  let vaultBump: number;

  before(async () => {
    // fund test wallets
    await airdrop(provider.connection, creator.publicKey);
    await airdrop(provider.connection, user.publicKey);
    await airdrop(provider.connection, recipient.publicKey);

    // PDA used for ALL instructions
    [vaultPda, vaultBump] = await PublicKey.findProgramAddress(
      [VAULT_SEED, Buffer.from(slinkId)],
      program.programId
    );
  });

  it("cannot create a slink with long description", async () => {
    const new_description = "long_description".repeat(10);

    let flag = "This should fail";

    try {
      await program.methods
        .create(slinkId, amount, new_description, claimKey)
        .accounts({
          creator: creator.publicKey,
          slinkVault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(
        err.error.errorCode.code,
        "DescriptionTooLong",
        "Should fail with long description"
      );
    }

    assert.strictEqual(
      flag,
      "Failed",
      "Creating slink with long description should fail"
    );
  });

  it("cannot create a slink with insfficienet balance", async () => {
    const new_amount = new anchor.BN(1_000_000_000_000_000);

    let flag = "This should fail";

    try {
      await program.methods
        .create(slinkId, new_amount, description, claimKey)
        .accounts({
          creator: creator.publicKey,
          slinkVault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(
        err.error.errorCode.code,
        "InsufficientBalance",
        "Should fail with insufficient balance"
      );
    }

    assert.strictEqual(
      flag,
      "Failed",
      "Creating slink with insufficient balance should fail"
    );
  });

  it("Creates a slink", async () => {
    
    
    const tx = await program.methods
      .create(slinkId, amount, description, claimKey)
      .accounts({
        creator: creator.publicKey,
        slinkVault: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    const vaultAcc = await program.account.slinkVault.fetch(vaultPda);

    if (vaultAcc.creator.toBase58() !== creator.publicKey.toBase58()) {
      throw new Error("Creator mismatch");
    }
    if (vaultAcc.slinkId !== slinkId) {
      throw new Error("slinkId mismatch");
    }
    if (vaultAcc.isClaimed === true) {
      throw new Error("Vault should not be claimed yet");
    }

  
    
    

    const eventtx = await provider.connection.getParsedTransaction(tx, "confirmed");
    const eventParser = new anchor.EventParser(program.programId, new anchor.BorshCoder(program.idl));
    const events = eventParser.parseLogs(eventtx.meta.logMessages);

    let logsEmitted = false;
    for (let event of events) {
      if (event.name === "slinkCreated") {
        logsEmitted = true;
          assert.strictEqual(event.data.amount.toString(), amount.toString(), "Event amount should match the deposit account");
          assert.strictEqual(event.data.creator.toString(), creator.publicKey.toString(), "Event creator should match creator");
      }
    }
    assert.isTrue(logsEmitted, "InitializeVaultEvent should have been emitted");
  });

  it("cannot claim slink with wrong slink-id", async () => {
    let fakeSlinkId = "myslinkdid";
    let flag = "This should fail";

    try {
      await program.methods
        .claim(fakeSlinkId, claimKey)
        .accounts({
          signer: user.publicKey,
          slinkVault: vaultPda,
          recipient: recipient.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(
        err.error.errorCode.code,
        "ConstraintSeeds",
        "Should fail with incorrect slink id error"
      );
    }

    assert.strictEqual(
      flag,
      "Failed",
      "Claiming slink with wrong slink id  should fail"
    );
  });

  it("cannot claim slink with wrong claimkey", async () => {
    let fakeClaimKey = "fakeclaimkey";
    let flag = "This should fail";

    try {
      await program.methods
        .claim(slinkId, fakeClaimKey)
        .accounts({
          signer: user.publicKey,
          slinkVault: vaultPda,
          recipient: recipient.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(
        err.error.errorCode.code,
        "InvalidClaimKey",
        "Should fail with Wrong claim key error"
      );
    }

    assert.strictEqual(
      flag,
      "Failed",
      "Claiming slink with wrong claim key should fail"
    );
  });

  it("Claims the slink", async () => {
      const tx = await program.methods
      .claim(slinkId, claimKey)
      .accounts({
        signer: user.publicKey,
        slinkVault: vaultPda,
        recipient: recipient.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([user])
      .rpc();

    const vaultAcc = await program.account.slinkVault.fetch(vaultPda);
    if (!vaultAcc.isClaimed) {
      throw new Error("Vault should be marked claimed");
    }
  });

  it("cannot claim slink that's already claimed", async () => {
    let flag = "This should fail";

    try {
      await program.methods
        .claim(slinkId, claimKey)
        .accounts({
          signer: user.publicKey,
          slinkVault: vaultPda,
          recipient: recipient.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .signers([user])
        .rpc();
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(
        err.error.errorCode.code,
        "AlreadyClaimed",
        "Should fail with already claimed slink"
      );
    }

    assert.strictEqual(
      flag,
      "Failed",
      "Claiming slink that's already claimed should fail"
    );
  });

  it("cannot cancel slink if not creator", async () => {
    let flag = "This should fail";

    const new_creator = anchor.web3.Keypair.generate();

    try {
      await program.methods
        .cancel(slinkId)
        .accounts({
          creator: new_creator.publicKey,
          slinkVault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([new_creator])
        .rpc();
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(
        err.error.errorCode.code,
        "ConstraintHasOne",
        "Should fail with non slink creator error"
      );
    }

    assert.strictEqual(
      flag,
      "Failed",
      "Claiming slink with wrong slink creator should fail"
    );
  });

  it("cannot cancel slink with wrong slink-id", async () => {
    let fakeSlinkId = "myslinkdid";
    let flag = "This should fail";

    try {
      await program.methods
        .cancel(fakeSlinkId)
        .accounts({
          creator: creator.publicKey,
          slinkVault: vaultPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([creator])
        .rpc();
    } catch (error) {
      flag = "Failed";
      const err = anchor.AnchorError.parse(error.logs);
      assert.strictEqual(
        err.error.errorCode.code,
        "ConstraintSeeds",
        "Should fail with incorrect slink id error"
      );
    }

    assert.strictEqual(
      flag,
      "Failed",
      "Canceling slink with wrong slink id  should fail"
    );
  });

  it("cancels the slink ", async () => {
    const tx = await program.methods
      .cancel(slinkId)
      .accounts({
        creator: creator.publicKey,
        slinkVault: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([creator])
      .rpc();

    const info = await provider.connection.getAccountInfo(vaultPda);
    if (info !== null) {
      throw new Error("Vault account should be closed after delete");
    }
  });
});

async function airdrop(
  connection: any,
  address: any,
  amount = 100 * anchor.web3.LAMPORTS_PER_SOL
) {
  await connection.confirmTransaction(
    await connection.requestAirdrop(address, amount),
    "confirmed"
  );
}

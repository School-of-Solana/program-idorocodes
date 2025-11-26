import {
    useConnection,
    useWallet,
    type Wallet,
} from "@solana/wallet-adapter-react";
import { v4 as uuidv4 } from "uuid";
import BN from "bn.js";
import idl from "./idl/slink_program.json";
import type { SlinkProgram } from "./types/slink_program";
import { useState, useEffect } from "react";
import type { Connection } from "@solana/web3.js";
import { AnchorProvider, web3, Program } from "@coral-xyz/anchor";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Dialog, DialogPanel } from "@headlessui/react";


interface SlinkAccount {
    id: string;
    creator: string;
    amount: number;
    description: string;
    claimed: boolean;
    publicKey: string;
}

const Slink = () => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [createClaimKey, setCreateClaimKey] = useState("");
    const [claimClaimKey, setClaimClaimKey] = useState("");
    const [status, setStatus] = useState("");

    const { connection } = useConnection();
    const { connected, wallet } = useWallet();

    const [pda, setPda] = useState<web3.PublicKey>();
    const [slinkId] = useState(() => uuidv4());
    const slinkIdForSeed = slinkId.slice(0, 32);
    const [claimSlinkId, setClaimSlinkId] = useState("");
    const [cancelSlinkId, setCancelSlinkID] = useState("");
    const [showCreatedModal, setShowCreatedModal] = useState(false);
    const [createdSlinkData, setCreatedSlinkData] = useState<{
        id: string;
        link: string;
    } | null>(null);

    const [allSlinks, setAllSlinks] = useState<SlinkAccount[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!wallet?.adapter?.publicKey) return;

        const program = getProgram(wallet, connection);
        if (!program) return;

        const [addr] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("slink_vault"), Buffer.from(slinkIdForSeed)],
            program.programId,
        );

        setPda(addr);
    }, [wallet?.adapter?.publicKey]);

    const fetchAllSlinks = async () => {
        if (!wallet?.adapter) return;

        const program = getProgram(wallet, connection);
        if (!program) return;

        setLoading(true);
        try {
            const accounts = await program.account.slinkVault.all();

            const slinksData: SlinkAccount[] = accounts.map((acc) => ({
                id: acc.account.slinkId || "N/A",
                creator: acc.account.creator.toString(),
                amount: acc.account.amount.toNumber() / web3.LAMPORTS_PER_SOL,
                description: acc.account.description || "",
                claimed: acc.account.isClaimed || false,
                publicKey: acc.publicKey.toString(),
            }));

            setAllSlinks(slinksData);
            setStatus("✅ Loaded all Slinks!");
        } catch (err) {
            console.error("Error fetching Slinks:", err);
            setStatus("❌ Failed to fetch Slinks");
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!wallet?.adapter?.publicKey || !pda) return;
        setStatus("Creating Slink... ⏳");

        try {
            const tx = await createSlink(
                wallet,
                connection,
                slinkIdForSeed,
                Number(amount),
                description,
                createClaimKey,
                pda,
                wallet.adapter.publicKey,
            );

            const publicLink = `${window.location.origin}/slink/${slinkIdForSeed}`;

            setCreatedSlinkData({
                id: slinkIdForSeed,
                link: publicLink,
            });

            setShowCreatedModal(true);

            setStatus(
                `✅ Slink created!
                 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`,
            );

            setTimeout(() => fetchAllSlinks(), 2000);
        } catch (err) {
            console.error(err);
            setStatus("❌ Transaction failed.");
        }
    };

    const handleClaim = async () => {
        if (!wallet?.adapter?.publicKey) return;

        const program = getProgram(wallet, connection);
        if (!program) return;

        const [vault] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("slink_vault"), Buffer.from(claimSlinkId)],
            program.programId,
        );

        setStatus("Claiming Slink... ⏳");

        try {
            const tx = await claimSlink(
                wallet,
                connection,
                claimSlinkId,
                claimClaimKey,
                vault,
                wallet.adapter.publicKey,
            );

            setStatus(
                `✅ Slink claimed!
                 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`,
            );
            // Refresh the list after claiming
            setTimeout(() => fetchAllSlinks(), 2000);
        } catch (err) {
            console.error(err);
            setStatus("❌ Claim failed. Check console.");
        }
    };

    const handleCancel = async () => {
        if (!wallet?.adapter?.publicKey || !pda) return;
        setStatus("Canceling Slink... ⏳");

        try {
            const tx = await cancelSlink(
                wallet,
                connection,
                cancelSlinkId,
                pda,
                wallet.adapter.publicKey,
            );
            setStatus(
                `✅ Slink canceled!
                 Explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`,
            );
            // Refresh the list after canceling
            setTimeout(() => fetchAllSlinks(), 2000);
        } catch (err) {
            console.error(err);
            setStatus("❌ Transaction failed. Check console for details.");
        }
    };

    return (
        <div className="min-h-screen bg-green-50 p-6 flex flex-col items-center relative overflow-hidden">
            <div className="relative z-10 w-full max-w-6xl">
                {/* Header */}
                <div className="p-5">
                    <header className="fixed sm:w-full sm:mt7 w-full m-auto mt-0 inset-x-0 top-0 font-inter backdrop-blur-3xl bg-[#ffffffd7] text-black z-50">
                        <nav
                            aria-label="Global"
                            className="flex items-center justify-between p-3 lg:px-8"
                        >
                            <div className="flex lg:flex-1">
                                <a className="-m-1.5 p-1.5 text-green-900 text-3xl ">
                                    <span>s</span>
                                    <span className="text-black">l</span>
                                    <span>i</span>
                                    <span className="text-black">n</span>
                                    <span>k</span>
                                </a>
                            </div>
                            <div className="flex ">
                                <WalletMultiButton className="from-purple-600! to-blue-600! hover:from-purple-700! hover:to-blue-700! !rounded-xl !px-1 !py-1 !text-lg !font-semibold !-2xl !border !border-white/20" />
                            </div>
                        </nav>
                    </header>
                </div>

                {/* Status Message */}
                {status && (
                    <div className="mb-8 backdrop-blur-xl bg-white/90 border border-green-200 rounded-2xl p-6 mt-20">
                        <p className="text-green-900 text-center whitespace-pre-line">
                            {status}
                        </p>
                    </div>
                )}
                
                {/* Three Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 mt-15 gap-6">
                    {/* Create Slink Card */}
                    <div className="backdrop-blur-xl bg-white/90 border border-green-300 rounded-3xl p-8 hover:bg-white/95 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                                <span className="text-2xl">✨</span>
                            </div>
                            <h2 className="text-2xl font-bold text-green-800">
                                Create Slink
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-green-700 font-medium mb-2">
                                    Amount (SOL)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) =>
                                        setAmount(String(Number(e.target.value)))
                                    }
                                    className="w-full bg-white border border-green-300 rounded-xl p-3 text-green-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400/50 transition-all"
                                    placeholder="0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-green-700 font-medium mb-2">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    className="w-full bg-white border border-green-300 rounded-xl p-3 text-green-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400/50 transition-all"
                                    placeholder="What's this for?"
                                />
                            </div>

                            <div>
                                <label className="block text-green-700 font-medium mb-2">
                                    Claim Key
                                </label>
                                <input
                                    type="text"
                                    value={createClaimKey}
                                    onChange={(e) =>
                                        setCreateClaimKey(e.target.value)
                                    }
                                    className="w-full bg-white border border-green-300 rounded-xl p-3 text-green-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400/50 transition-all"
                                    placeholder="Secret key"
                                />
                            </div>

                            <button
                                disabled={
                                    !connected ||
                                    !pda ||
                                    Number(amount) <= 0 ||
                                    !description ||
                                    !createClaimKey
                                }
                                onClick={handleCreate}
                                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                            >
                                Create Slink
                            </button>
                        </div>
                    </div>

                    {/* Claim Slink Card */}
                    <div className="backdrop-blur-xl bg-white/90 border border-green-300 rounded-3xl p-8 hover:bg-white/95 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center">
                                <span className="text-2xl">🎁</span>
                            </div>
                            <h2 className="text-2xl font-bold text-green-800">
                                Claim Slink
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-green-700 font-medium mb-2">
                                    Slink ID
                                </label>
                                <input
                                    type="text"
                                    value={claimSlinkId}
                                    onChange={(e) =>
                                        setClaimSlinkId(e.target.value)
                                    }
                                    className="w-full bg-white border border-green-300 rounded-xl p-3 text-green-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400/50 transition-all"
                                    placeholder="Enter Slink ID"
                                />
                            </div>

                            <div>
                                <label className="block text-green-700 font-medium mb-2">
                                    Claim Key
                                </label>
                                <input
                                    type="text"
                                    value={claimClaimKey}
                                    onChange={(e) =>
                                        setClaimClaimKey(e.target.value)
                                    }
                                    className="w-full bg-white border border-green-300 rounded-xl p-3 text-green-900 placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-400/50 transition-all"
                                    placeholder="Enter claim key"
                                />
                            </div>

                            <button
                                disabled={!connected || !pda || !claimClaimKey}
                                onClick={handleClaim}
                                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                            >
                                Claim Slink
                            </button>
                        </div>
                    </div>

                    {/* Cancel Slink Card */}
                    <div className="backdrop-blur-xl bg-white/90 border border-green-300 rounded-3xl p-8 hover:bg-white/95 transition-all duration-300">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
                                <span className="text-2xl">🚫</span>
                            </div>
                            <h2 className="text-2xl font-bold text-green-800">
                                Cancel Slink
                            </h2>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-green-700 font-medium mb-2">
                                    Slink ID
                                </label>
                                <input
                                    type="text"
                                    value={cancelSlinkId}
                                    onChange={(e) =>
                                        setCancelSlinkID(e.target.value)
                                    }
                                    className="w-full bg-white border border-green-300 rounded-xl p-3 text-green-900 placeholder-gray-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-400/50 transition-all"
                                    placeholder="Enter Slink ID"
                                />
                            </div>

                            <button
                                disabled={!connected || !pda}
                                onClick={handleCancel}
                                className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                            >
                                Cancel Slink
                            </button>
                        </div>
                    </div>
                </div>

                {/* View All Slinks Section */}
                <div className="mt-12 backdrop-blur-xl bg-white/90 border border-green-300 rounded-3xl p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 flex items-center justify-center">
                                <span className="text-2xl">📋</span>
                            </div>
                            <h2 className="text-2xl font-bold text-green-800">
                                All Slinks
                            </h2>
                        </div>
                        <button
                            disabled={!connected || loading}
                            onClick={fetchAllSlinks}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:opacity-50 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
                        >
                            {loading ? "Loading..." : "Refresh"}
                        </button>
                    </div>

                    {allSlinks.length === 0 ? (
                        <div className="text-center py-12 text-green-600">
                            <p className="text-lg">
                                No Slinks found. Click Refresh to load or create
                                your first Slink!
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {allSlinks.map((slink, index) => (
                                <div
                                    key={index}
                                    className={`border-2 rounded-xl p-5 transition-all duration-300 hover:shadow-lg ${
                                        slink.claimed
                                            ? "border-gray-300 bg-gray-50"
                                            : "border-green-400 bg-green-50"
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-200 text-green-800">
                                            {slink.claimed
                                                ? "Claimed ✓"
                                                : "Active"}
                                        </span>
                                        <span className="text-lg font-bold text-green-700">
                                            {slink.amount} SOL
                                        </span>
                                    </div>
                                    <p className="text-sm text-green-900 font-medium mb-2">
                                        {slink.description}
                                    </p>
                                    <div className="space-y-1 text-xs text-green-600">
                                        <p className="truncate">
                                            <span className="font-semibold">
                                                ID:
                                            </span>{" "}
                                            {slink.id}
                                        </p>
                                        <p className="truncate">
                                            <span className="font-semibold">
                                                Creator:
                                            </span>{" "}
                                            {slink.creator.slice(0, 4)}...
                                            {slink.creator.slice(-4)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Dialog
                open={showCreatedModal}
                onClose={() => setShowCreatedModal(false)}
                className="fixed inset-0 z-9999 flex items-center backdrop-blur justify-center"
            >
               
              
                  
                    
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl border border-green-200">
                        <h2 className="text-2xl font-bold text-green-800 mb-4">
                            Slink Created
                        </h2>

                        <p className="text-green-700 font-medium">Slink ID</p>
                        <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl mb-4 border border-green-200">
                            <span className="text-green-900 font-mono">
                                {createdSlinkData?.id}
                            </span>
                            <button
                                className="text-green-700 font-semibold"
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        createdSlinkData?.id || "",
                                    )
                                }
                            >
                                Copy
                            </button>
                        </div>

                        <p className="text-green-700 font-medium">Share Link</p>
                        <div className="flex items-center justify-between bg-green-50 p-3 rounded-xl mb-4 border border-green-200">
                            <span className="text-green-900 truncate">
                                {createdSlinkData?.link}
                            </span>
                            <button
                                className="text-green-700 font-semibold"
                                onClick={() =>
                                    navigator.clipboard.writeText(
                                        createdSlinkData?.link || "",
                                    )
                                }
                            >
                                Copy
                            </button>
                        </div>

                        <button
                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 rounded-xl"
                            onClick={() => setShowCreatedModal(false)}
                        >
                            Close
                        </button>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
};

export default Slink;

const createSlink = async (
    wallet: Wallet,
    connection: Connection,
    slink_id: string,
    amount: number,
    description: string,
    claim_key: string,
    pda: web3.PublicKey,
    creator: web3.PublicKey,
) => {
    const program = getProgram(wallet, connection);
    if (!program) throw new Error("Program not found");

    const lamports = new BN(amount * web3.LAMPORTS_PER_SOL);

    const tx = await program.methods
        .create(slink_id, lamports, description, claim_key)
        .accounts({
            creator,
            slinkVault: pda,
            systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

    console.log("Transaction Signature:", tx);
    return tx;
};

const claimSlink = async (
    wallet: Wallet,
    connection: Connection,
    slink_id: string,
    claim_key: string,
    pda: web3.PublicKey,
    recipient: web3.PublicKey,
) => {
    const program = getProgram(wallet, connection);
    if (!program) throw new Error("Program not found");

    const tx = await program.methods
        .claim(slink_id, claim_key)
        .accounts({
            signer: recipient,
            recipient,
            slinkVault: pda,
            systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

    console.log("Transaction Signature:", tx);
    return tx;
};

const cancelSlink = async (
    wallet: Wallet,
    connection: Connection,
    slink_id: string,
    pda: web3.PublicKey,
    creator: web3.PublicKey,
) => {
    const program = getProgram(wallet, connection);
    if (!program) throw new Error("Program not found");

    const tx = await program.methods
        .cancel(slink_id)
        .accounts({
            creator: creator,
            slinkVault: pda,
            systemProgram: web3.SystemProgram.programId,
        })
        .rpc();

    console.log("Transaction Signature:", tx);
    return tx;
};

const getProvider = (wallet: Wallet, connection: Connection) => {
    if (!wallet?.adapter) return null;

    return new AnchorProvider(connection, wallet.adapter as any, {
        commitment: "confirmed",
    });
};

const getProgram = (wallet: Wallet, connection: Connection) => {
    const provider = getProvider(wallet, connection);
    if (!provider) return null;

    return new Program<SlinkProgram>(idl as any, provider);
};

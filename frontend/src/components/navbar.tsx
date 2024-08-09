import { useState } from "react";
import { VscDebugDisconnect } from "react-icons/vsc";
import { useWallet } from "@meshsdk/react";
import Image from "next/image";

import { WALLETS } from "@/constants/wallets";
import { useAppStore } from "@/store/app";
import { useWalletStore } from "@/store/wallet";
import Button from "./button";
import CreateTokenButton from "./CreateTokenButton";

const Navbar = () => {
    const [openMenu, setOpenMenu] = useState(false);

    const { disconnect, connect } = useWallet();
    const { setModal } = useAppStore();

    const { connected_wallet, resetWallet } = useWalletStore();

    const disconnectWallet = () => {
        disconnect();
        resetWallet();
        localStorage.setItem("wallet_name", "")
    }

    return (
        <>
            <div className={`sticky z-[10] top-0 left-0 right-0`}>
                {/* Navbar wrapper */}
                <div className={`p-2 lg:px-5 lg:py-3 w-full sticky z-50`}>
                    <div className={`backdrop-blur-md bg-[#4e4e4e3d] p-2 lg:p-5 lg:px-8 px-4 rounded-lg md:rounded-2xl`}>
                        <div className="w-full m-auto flex justify-between items-center text-white">
                            <h1 className="font-semibold text-xl">Access, Create and Port RWA Across 30+ Blockchains</h1>
                            <div className="gap-4 flex items-center">
                                {/* Connect Button */}
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center tracking-wider ">
                                        <button
                                            onClick={() => setModal("CONNECT_WALLET")}
                                            className={`font-inter  px-4 font-semibold md:px-[17px] ${connected_wallet ? "border-white border-r-2 pr-5 rounded-r-none" : ""} py-2 md:py-[10px] flex items-center gap-x-3 text-base bg-black/30  text-white scale-xs`}
                                        >
                                            {connected_wallet && <Image className="relative " width={25} height={25} alt="wallet-logo" src={WALLETS[connected_wallet]?.image ?? "https://ticketingserver.nucast.io/storage/v1/object/public/web-assets/img_19529-1679824415.png?t=2023-09-06T11%3A24%3A55.660Z"} />}
                                            <div className="capitalize relative">{connected_wallet ? connected_wallet : "Connect Wallet"}</div>
                                        </button>

                                        {connected_wallet &&
                                            <button
                                                onClick={disconnectWallet}
                                                className={` pl-4 pr-4 font-semibold md:pr-[17px] bg-black/30 cursor-pointer py-2 md:py-[10px] ripple group`}
                                            >
                                                <VscDebugDisconnect className="text-[25px] group-hover:invert" />
                                            </button>
                                        }
                                        <CreateTokenButton className="ml-4 bg-black/30" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;
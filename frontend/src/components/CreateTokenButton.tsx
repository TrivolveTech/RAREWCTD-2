import { useAppStore } from "@/store/app";
import Button from "./button";

export default function CreateTokenButton({ label, className }: { label?: string; className?: string }) {
    const { setModal } = useAppStore();

    return (
        <>
            <Button
                className={`${className} px-4 py-[10px]`}
                onClick={() => setModal("UPLOAD")}
            >
                <div className="relative text-sm font-semibold">{label ? label : "Create Cross-chain RWA Token"}</div>
            </Button>
        </>
    );
}
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@solana/wallet-adapter-react-ui/styles.css";
import AppRoutes from "./Routes.tsx";
import { SolanaProvider } from "./provider.tsx";
import "buffer";
import { Buffer } from 'buffer';

(window as any).Buffer = Buffer;
createRoot(document.getElementById("root")!).render(
    <StrictMode>
       
            <SolanaProvider>
                <AppRoutes />
            </SolanaProvider>
       
    </StrictMode>,
);

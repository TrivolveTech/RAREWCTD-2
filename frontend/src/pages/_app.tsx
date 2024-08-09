import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { MeshProvider } from "@meshsdk/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { createWeb3Modal } from '@web3modal/wagmi/react'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { WagmiProvider } from 'wagmi'
import { arbitrum, mainnet, wanchainTestnet } from 'wagmi/chains'
import Modals from "@/components/modals";
import Navbar from "@/components/navbar";
import { Toast } from "@/components/Toast";

const projectId = process.env.WALLETCONNECT_PROJECT_ID ?? "";

const chains = [mainnet, arbitrum, wanchainTestnet] as const

const metadata = {
  name: 'RWA RARE EVO',
  description: "RWA RARE EVO",
  url: 'https://test.com',
  icons: ['https://test.com/icon.png']
}

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

createWeb3Modal({
  metadata,
  wagmiConfig,
  projectId,
  enableAnalytics: true
})

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <MeshProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </MeshProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Modals />
      <Toast />
    </>
  )
}
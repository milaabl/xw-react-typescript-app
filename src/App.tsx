import { /*customChains,*/ projectId, wagmiClient } from "./utils/wagmi";
// import { Web3Modal } from "@web3modal/react";
import { ReferralModalTarget } from "./components/ReferralModal";
// import { fetchReferralCode } from "./utils/apis";
import { WagmiProvider, useAccount } from "wagmi";
// import { useDispatch } from "react-redux";
import HeaderSection from "./components/sections/HeaderSection";
// import { useEffect } from "react";
// import config from "./config";
// import { setUser } from "./store/wallet";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { EffectsModule } from "./components/EffectsModule";
// import { defaultWagmiConfig } from "@web3modal/wagmi";
// import { walletConnect } from "@wagmi/connectors";

const queryClient = new QueryClient();

// 2. Create wagmiConfig
/*const metadata = {
  name: "Web3Modal",
  description: "Web3Modal Example",
  url: "https://web3modal.com", // origin must match your domain & subdomain
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};*/

/*export const config = defaultWagmiConfig({
  chains: customChains,
  projectId,
  metadata,
  connectors: [walletConnect({ projectId, metadata, showQrModal: false })],
});*/

// 3. Create modal
createWeb3Modal({
  wagmiConfig: wagmiClient,
  projectId,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  enableOnramp: false, // Optional - false as default
});

function App() {
  return (
    <>
      <WagmiProvider config={wagmiClient}>
        <QueryClientProvider client={queryClient}>
          <EffectsModule />
          <main id="main" className="flex min-h-screen flex-col">
            <HeaderSection />
            <ReferralModalTarget />
          </main>
        </QueryClientProvider>
      </WagmiProvider>
      {/* <WebglFluidAnimation /> */}
    </>
  );
}

export default App;

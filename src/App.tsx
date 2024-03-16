import { customChains, projectId, wagmiClient } from "./utils/wagmi";
// import { Web3Modal } from "@web3modal/react";
import { ReferralModalTarget } from "./components/ReferralModal";
import { fetchReferralCode } from "./utils/apis";
import { WagmiProvider, useAccount } from "wagmi";
import { useDispatch } from "react-redux";
import HeaderSection from "./components/sections/HeaderSection";
import { useEffect } from "react";
// import config from "./config";
import { setUser } from "./store/wallet";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' ;
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { defaultWagmiConfig } from "@web3modal/wagmi";
import { walletConnect } from "@wagmi/connectors";


const queryClient = new QueryClient();


// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = defaultWagmiConfig({
  chains: customChains,
  projectId,
  metadata,
  connectors: [walletConnect({ projectId, metadata, showQrModal: false })]
})

// 3. Create modal
createWeb3Modal({
  wagmiConfig: config,
  projectId,
  enableAnalytics: false, // Optional - defaults to your Cloud configuration
  enableOnramp: false // Optional - false as default
})

function App() {
  const { address, isConnected } = useAccount({config});
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(window?.location.search);
    const referralId = searchParams.get("ref");
    if (referralId?.length === 6) {
      localStorage.setItem("ref", referralId);
    }
  }, []);

  useEffect(() => {
    if (!isConnected) return;

    signIn();
  }, [isConnected]);

  const signIn = async () => {
    try {
      const { user } = await fetchReferralCode(address as string);
      const  ref_address  = await fetchReferralCode(address as string); 
      dispatch(setUser({ ...user, ref_address:ref_address }));
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    let newEvent: any;

    window.addEventListener("mousemove", (event: any) => {
      newEvent = new event.constructor(event.type, event);
    });

    document.addEventListener("mousemove", (event: any) => {
      if (event.isTrusted && newEvent) {
        document.getElementById("webgl-fluid")?.dispatchEvent(newEvent);
      }
    });
  }, []);

  return (
    <>
      <WagmiProvider
        config={wagmiClient}>
          <QueryClientProvider client={queryClient}>
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

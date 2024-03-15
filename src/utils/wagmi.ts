import { createConfig, http } from "wagmi";
import { goerli, mainnet } from "viem/chains";
import { injected, walletConnect } from '@wagmi/connectors';

export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const customChains = [mainnet, goerli] as const;

export const wagmiClient = createConfig({
  chains: customChains,
  connectors: [injected({
    shimDisconnect: true
  }), walletConnect({
    projectId
  })],
  transports: {
    [mainnet.id]: http(),
    [goerli.id]: http(),
  },
});


import { createConfig, http } from "wagmi";
import { Chain, goerli, mainnet } from "viem/chains";
import { injected, walletConnect } from '@wagmi/connectors';

export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

const ganacheEthereumFork = { ...mainnet, rpcUrls: { default: { http: [`http://127.0.0.1:8545` ] } } } satisfies Chain;

export const customChains = [ganacheEthereumFork] as const;

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


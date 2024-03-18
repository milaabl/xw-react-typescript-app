import { createConfig, http } from "wagmi";
import { /*injected,*/ walletConnect } from '@wagmi/connectors';

import { chains } from '../config';
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config";

export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const wagmiClient = defaultWagmiConfig({
  projectId,
    metadata: {
      name: 'XUIRIN Finance: Presale',
      description: 'Connect to the XUIRIN Finance dApp',
      url: 'https://sandbox-tau-wheat.vercel.app', // origin must match your domain & subdomain
      icons: ['/img/favicon.ico']
    },
  chains,
  transports: {
    [chains[0].id]: http(),
    [chains[1].id]: http(),
  },
});

export const customChains = chains;


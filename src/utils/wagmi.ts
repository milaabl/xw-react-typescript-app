import { createConfig, http } from "wagmi";
import { injected, walletConnect } from '@wagmi/connectors';

import { chains } from '../config';

export const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID;

export const wagmiClient = createConfig({
  chains,
  connectors: [injected({
    shimDisconnect: true
  })],
  transports: {
    [chains[0].id]: http(),
    [chains[1].id]: http(),
  },
});

export const customChains = chains;


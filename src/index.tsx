import React from 'react';
import './index.css';
import App from './App';
import { createRoot } from 'react-dom/client';
import { WagmiConfig, createConfig } from 'wagmi';
import {
  ConnectKitProvider,
  getDefaultConfig,
} from 'connectkit';
import { baseGoerli, base, polygonMumbai } from 'wagmi/chains';



const alchemyId = process.env.ALCHEMY_ID;
const walletConnectProjectId = process.env.WALLETCONNECT_PROJECT_ID as string;

// Choose which chains you'd like to show
const chains = [baseGoerli, base, polygonMumbai];

const config = createConfig(
  getDefaultConfig({
    appName: 'Utu Protocol',
    alchemyId,
    walletConnectProjectId ,
    chains,
  })
);



const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <WagmiConfig config={config}>
      <ConnectKitProvider>
       <App/>
      </ConnectKitProvider>{' '}
    </WagmiConfig>
  </React.StrictMode>
);


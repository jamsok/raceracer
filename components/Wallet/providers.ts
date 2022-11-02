import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";

export const providerOptions = {
  walletlink: {
    package: CoinbaseWalletSDK, // Required
    options: {
      appName: "dex agg", // Required
      rpc: {
        56: 'https://bsc-dataseed.binance.org/'
      },
      chainId: 56// Required unless you provide a JSON RPC url; see `rpc` below
    }
  },
  walletconnect: {
    package: WalletConnect, // required
    options: {
      rpc: {
        56: 'https://bsc-dataseed.binance.org/'
      },
      chainId: 56
    }
  }
};
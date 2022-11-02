import { BigNumber } from "ethers";
import { type } from "os";
export enum ChainId {
  BSC_MAIN = 56,
  BSC_TEST = 97,
}

export type addressesList = {
  [ChainId.BSC_MAIN]?: string;
  [ChainId.BSC_TEST]: string;
};
export const MintEngineAddress: addressesList = {
  [ChainId.BSC_TEST]: "0xB778EF5576DE338629f3b5A3E59F491f019bCA74",
  [ChainId.BSC_MAIN]: "",
};
export const NFTAddress: addressesList = {
  [ChainId.BSC_TEST]: "0x826B91B6188B94aB60775c150F20c78633c051E3",
  [ChainId.BSC_MAIN]: "",
};
export type Token = {
  name: string;
  symbol: string;
  address: string;
  chainId: number;
  decimals: number;
  logoURI: string;
};
export const currency = {
  [ChainId.BSC_MAIN]: [
    {
      name: "BUSD Token",
      symbol: "BUSD",
      address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56",
      chainId: 56,
      decimals: 18,
      logoURI: "/Tokens/BUSD.png", // add from local assets images
    },
    {
      name: "USDT Token",
      symbol: "USDT",
      address: "0x55d398326f99059fF775485246999027B3197955",
      chainId: 56,
      decimals: 18,
      logoURI: "/Tokens/USDT.png",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d",
      chainId: 56,
      decimals: 18,
      logoURI: "/Tokens/USDC.png",
    },
  ],
  [ChainId.BSC_TEST]: [
    {
      name: "BUSD Token",
      symbol: "BUSD",
      address: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
      chainId: 97,
      decimals: 18,
      logoURI: "/Tokens/BUSD.png", // add from local assets images
    },
    {
      name: "USDT Token",
      symbol: "USDT",
      address: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
      chainId: 97,
      decimals: 18,
      logoURI: "/Tokens/USDT.png",
    },
    {
      name: "USD Coin",
      symbol: "USDC",
      address: "0x64544969ed7EBf5f083679233325356EbE738930",
      chainId: 97,
      decimals: 18,
      logoURI: "/Tokens/USDC.png",
    },
  ],
};
export type categoryInfo = {
  category: string;
  ids: number[];
};
//@dev token id list of nfts that is to be sold in market
export const nftCategories = [
  {
    category: "cars",
    ids: [1, 2, 3],
  },
  {
    category: "powerups",
    ids: [4, 5, 6, 7, 8, 9, 10, 11],
  },
];

import React, { useContext,useDebugValue, useState, ReactNode } from 'react'
import { ethers } from "ethers";
interface Props {
  children?: ReactNode
  // any props that come into the component
}
export type accountContext ={
    address: undefined | string,
    network: ethers.providers.Network | undefined
    provider : {} | ethers.providers.Web3Provider | undefined
    signer: any
    connected : boolean
}
export type WalletContext = {
  account :accountContext | undefined |null
  setAccount: React.Dispatch<React.SetStateAction<accountContext | undefined>>
 
};
const WalletContext = React.createContext<WalletContext>(
  {
        account:{
        address: undefined,
        network: undefined,
        provider: {},
        signer: undefined,
        connected: false},
        setAccount :  async (newValue) => null
      });
        
export const useWallet = () => {
    const { account,setAccount} = useContext(WalletContext)
    useDebugValue(account, account => account?  "Logged In" : "Logged Out")
    return useContext(WalletContext)
}

export const WalletProvider = ({children}:Props) => {
  const [account, setAccount] = useState<accountContext | undefined>()
  return <WalletContext.Provider 
      value={{ account, setAccount }}>{children}
      </WalletContext.Provider>
}
import React, { useContext,useDebugValue, useState, ReactNode } from 'react'
import { ethers } from "ethers";
import { type } from 'os';
interface Props {
  children?: ReactNode
  // any props that come into the component
}
export type Contracts ={
    NFT: ethers.Contract | undefined
    MintEngine:ethers.Contract | undefined
}
export type ContractsContext = {
  contracts : Contracts | undefined | null
  setContracts: React.Dispatch<React.SetStateAction<Contracts | undefined>>
 
};
const ContractsContext = React.createContext<ContractsContext>(
      {
        contracts:{
            NFT: undefined,
            MintEngine:undefined
        },
        setContracts :  async (newValue) => null
      });        
export const useContracts=() => {
    const { contracts,setContracts} = useContext(ContractsContext)
    useDebugValue(contracts, contracts => contracts?  "contracts set" : "contracts not set")
    return useContext(ContractsContext)
}

export const ContractsProvider = ({children}:Props) => {
  const [contracts, setContracts] = useState<Contracts | undefined>()
  return <ContractsContext.Provider 
      value={{ contracts, setContracts }}>{children}
      </ContractsContext.Provider>
}
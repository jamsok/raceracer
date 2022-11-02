  
import { MintEngineAddress } from "./constants"
import { ethers } from "ethers"
import { NFTAddress } from "./constants"
import { ChainId } from "./constants"
import { Contracts } from "../context/ContractsContext"
import { IMintEngineABI } from "../abi/abis"
import { IERC1155 } from "../abi/abis"

export const toHex = (num: number) => {
    const val = Number(num);
    return "0x" + val.toString(16);
};

// query block chain contracts without user connecting wallet
export const getContractInstance= async (chainID:ChainId,signer?:ethers.providers.JsonRpcProvider | ethers.providers.JsonRpcSigner):Promise<Contracts>=>{
    let provider
    let _NFTAddress
    let _MintEngineAddress
    if(chainID == ChainId.BSC_TEST ){
        provider = new ethers.providers.StaticJsonRpcProvider(process.env.BSC_TEST_RPC,97)
        _MintEngineAddress = MintEngineAddress[ChainId.BSC_TEST]
        _NFTAddress = NFTAddress[ChainId.BSC_TEST]
    }
    if(chainID == ChainId.BSC_MAIN){
        provider = new ethers.providers.StaticJsonRpcProvider(process.env.BSC_MAIN_RPC,97)
        _MintEngineAddress = MintEngineAddress[ChainId.BSC_MAIN]
        _NFTAddress = NFTAddress[ChainId.BSC_MAIN]
    }
    if(signer){
        provider = signer    
    }
    // runs if valid cid and addresses
    if(provider && _MintEngineAddress && _NFTAddress){
        const MintEngine = new ethers.Contract(_MintEngineAddress,IMintEngineABI,provider)
        const NFT = new ethers.Contract(_NFTAddress,IERC1155,provider)
        const queryContracts:Contracts = {
            MintEngine:MintEngine,
            NFT:NFT
        }
        return(queryContracts)
    } 
    const queryContracts ={
        MintEngine:undefined,
        NFT:undefined
    }
    return queryContracts 

}
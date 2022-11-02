// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ChainId } from '../../../../utils/constants'
import { NFT } from '../../../../components/NFT/NFTList'
import fs from 'fs'
import { getContractInstance} from '../../../../utils/utils'
import { Contracts } from '../../../../context/ContractsContext'

type Data = {
  message?:string
} | any

export default async  function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    if(req.method!=="PATCH")return res.status(400).json({message:"not patch"})
    const {chainId,id,address}= req.query
    // get price
    let contracts:Contracts;
    if(Number(chainId) == ChainId.BSC_TEST) contracts = await getContractInstance(ChainId.BSC_TEST)     
    else contracts = await getContractInstance(ChainId.BSC_MAIN)
    if(!contracts.MintEngine) return res.status(500).json({message:"could not get contracts"})
    const price = (await contracts.MintEngine.price(id)).toString()
    const nftJsonString = fs.readFileSync(`data/${id}.json`);
    const nft = JSON.parse(nftJsonString.toString());
    // update fs
    nft.price = price
    const updatedData = JSON.stringify(nft)
    fs.writeFileSync(`data/${id}.json`, updatedData); 
    res.status(200).json(nft)
}

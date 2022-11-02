import React, { useContext,useDebugValue, useState, ReactNode } from 'react'
import { ethers,BigNumber } from "ethers";
import { type } from 'os';
interface Props {
  children?: ReactNode
  // any props that come into the component
}
export type buyInfo ={
    id:number
    amount:number
    price:BigNumber,
}
export type CartInfo={
    totalPrice:BigNumber
    cart:buyInfo[]
    buyNow:buyInfo | undefined
    showModal:boolean
}
export type CartInfoContext = {
  cartInfo : CartInfo 
  setCartInfo: React.Dispatch<React.SetStateAction<CartInfo >>
 
};
const ContractsContext = React.createContext<CartInfoContext>(
    {
      cartInfo:{
        totalPrice:BigNumber.from(0),
        cart:[],
        showModal:false,
        buyNow: undefined
      },
      setCartInfo :  async (newValue) => null
    });
        
export const useCartInfo=() => {
    const { cartInfo,setCartInfo} = useContext(ContractsContext)
    useDebugValue(cartInfo, CartInfo => CartInfo?  "CartInfo set" : "CartInfo not set")
    return useContext(ContractsContext)
}

export const CartInfoProvider = ({children}:Props) => {
  const [cartInfo, setCartInfo] = useState<CartInfo >({
    totalPrice:BigNumber.from(0),
    cart:[],
    buyNow: undefined,
    showModal:false
  })

  return <ContractsContext.Provider 
      value={{ cartInfo, setCartInfo }}>{children}
      </ContractsContext.Provider>
}
import styles from "../../styles/Home.module.css";
import { useWallet } from "../../context/WalletContext";
import { useEffect, useState } from "react";
import NFTList from "./NFTList";
import Image from "next/image";
import type { categoryInfo } from "../../utils/constants";
import { useContracts } from "../../context/ContractsContext";
import { useCartInfo } from "../../context/CartInfoContext";
import { BigNumber, utils } from "ethers";
const { formatEther } = utils;
import type { buyInfo } from "../../context/CartInfoContext";
type attribute = {
  trait_type: string;
  value: number | string | boolean;
  display_type?: string;
};

export interface NFT {
  id: number;
  attributes: attribute[];
  name: string;
  price: string;
  description: string;
  image: string;
  // top_Speed: Number;
  // RPM: Number;
  // FrontSuspension: Number;
}
type props = {
  category: categoryInfo;
  currentCategory: categoryInfo;
};
const Category = ({ category, currentCategory }: props) => {
  const { account } = useWallet();
  const { contracts } = useContracts();
  const defaultNFT = require(`../../data/${category.ids[0]}.json`);
  const { cartInfo, setCartInfo } = useCartInfo();
  const [selectedNFT, setSelectedNFT] = useState<NFT>(defaultNFT as NFT);

  const showBuyNowModal = () => {
    const price = BigNumber.from(selectedNFT.price);
    const buyInfo: buyInfo = {
      id: selectedNFT.id,
      amount: 1,
      price: price,
    };
    setCartInfo((prev: any) => ({
      ...prev,
      buyNow: buyInfo,
      showModal: true,
    }));
  };
  const addToCart = () => {
    const price = BigNumber.from(selectedNFT.price);
    const buyInfo: buyInfo = {
      id: selectedNFT.id,
      amount: 1,
      price: price,
    };
    cartInfo.cart[selectedNFT.id] = buyInfo;
    setCartInfo((prev: any) => ({
      ...prev,
      totalPrice: prev.totalPrice.add(price),
    }));
  };
  const removeFromCart = () => {
    const subFromTotal = BigNumber.from(selectedNFT.price).mul(
      cartInfo.cart[selectedNFT.id].amount
    );
    delete cartInfo.cart[selectedNFT.id];
    setCartInfo((prev: any) => ({
      ...prev,
      totalPrice: prev.totalPrice.sub(subFromTotal),
    }));
  };
  const updateAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _amount = Number(e.target.value);
    if (_amount <= 1) _amount = 1;

    const price = BigNumber.from(selectedNFT.price);
    const buyInfo: buyInfo = {
      id: selectedNFT.id,
      amount: _amount,
      price: price,
    };
    const prevAmount = cartInfo?.cart[selectedNFT.id].amount;
    const amountChange = _amount - prevAmount;
    const priveToAdd = price.mul(amountChange);
    cartInfo.cart[selectedNFT.id] = buyInfo;
    setCartInfo((prev: any) => ({
      ...prev,
      totalPrice: prev.totalPrice.add(priveToAdd),
    }));
  };
  // passnft in future?? or just nft id depending on where nft info is fetched
  return (
    <>
      <div
        className={`${styles.categoryDisplay} ${
          category?.category == currentCategory.category &&
          styles.activeCategory
        } `}
      >
        <div className={styles.selectedNFT}>
          <h1>{selectedNFT.name}</h1>
          <div className={styles.imgNft}>
            <Image
              width={200}
              height={150}
              src={selectedNFT.image}
              layout="responsive"
            ></Image>
          </div>
          <div>incart:{cartInfo?.cart[selectedNFT.id]?.amount}</div>
          <span>id:{selectedNFT.id} </span>
          <div>price:{formatEther(selectedNFT.price)}</div>
          <div>Top Speed:{selectedNFT.top_Speed}</div>
          <div>RPM:{selectedNFT.RPM}</div>
          <div>Front Suspension:{selectedNFT.FrontSuspension}</div>
          <div>MaxTorque(nm@rpm):{selectedNFT.MaxTorque}</div>
          <div>Brakes(ABS):{selectedNFT.Brakes}</div>
          <div className={styles.displayUI}>
            {cartInfo.cart[selectedNFT.id] ? (
              <div>
                <input
                  type="number"
                  min={1}
                  value={cartInfo.cart[selectedNFT.id].amount}
                  onChange={updateAmount}
                ></input>
                <button className="addtocartremove" onClick={removeFromCart}>
                  removeFromCart
                </button>
              </div>
            ) : (
              <button
                className="addtocart"
                disabled={Number(formatEther(selectedNFT.price)) == 0}
                onClick={addToCart}
              >
                addTocart
              </button>
            )}
            <button
              className="addtocart"
              disabled={Number(formatEther(selectedNFT.price)) == 0}
              onClick={showBuyNowModal}
            >
              BuyNow
            </button>
            {/* if in cart already show + = and edit amount */}
          </div>
        </div>
        <NFTList category={category} setSelectedNFT={setSelectedNFT}></NFTList>
      </div>
    </>
  );
};

// get list from constants or ssr
export default Category;

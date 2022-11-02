import styles from "../../styles/Home.module.css";
import { useWallet } from "../../context/WalletContext";
import { useState } from "react";
import { nftCategories } from "../../utils/constants";
import { motion } from "framer-motion";
import Category from "./Category";
import NFTList from "./NFTList";

type attribute = {
  trait_type: string;
  value: number | string | boolean;
  display_type?: string;
};

export interface NFT {
  id: number;
  attributes: attribute[];
  name: string;
  description: string;
  imgSrc: string;
}
type props = {
  nft: NFT;
  setSelectedNFT: Function;
};
const Display = () => {
  const [currentCategory, setCurrentCategory] = useState(nftCategories[0]);

  const { account } = useWallet();

  return (
    <>
      <div className={styles.nftDisplay}>
        <ul className={styles.categoryTabGroup} role="tablist">
          {nftCategories?.map((categorieInfo, key) => {
            return (
              <li key={key}>
                <button
                  className={`${styles.categoryTab} ${
                    currentCategory?.category == categorieInfo.category &&
                    styles.activeCategoryNav
                  }`}
                  onClick={() => setCurrentCategory(categorieInfo)}
                >
                  {categorieInfo.category}
                </button>
              </li>
            );
          })}
        </ul>

        <div>
          {nftCategories?.map((categorieInfo, key) => {
            return (
              <Category
                key={key}
                category={categorieInfo}
                currentCategory={currentCategory}
              ></Category>
            );
          })}
        </div>
      </div>
    </>
  );
};
export default Display;

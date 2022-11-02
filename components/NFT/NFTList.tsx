import styles from "../../styles/Home.module.css";
import { useWallet } from "../../context/WalletContext";
import { nftCategories } from "../../utils/constants";
import type { categoryInfo } from "../../utils/constants";

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
  category: categoryInfo;
  setSelectedNFT: Function;
};
const NFTList = ({ category, setSelectedNFT }: props) => {
  const { account } = useWallet();
  const updateSelected = async (id: string) => {
    const nft = await import(`../../data/${id}.json`);
    setSelectedNFT(nft);
  };

  // passnft in future?? or just nft id depending on where nft info is fetched
  return (
    <>
      <div className={styles.nftList}>
        {category.ids.map((id, key) => {
          return (
            <div
              key={key}
              className={styles.nftListItem}
              onClick={() => {
                updateSelected(id.toString());
              }}
            >
              {id}
            </div>
          );
        })}
      </div>
    </>
  );
};

// get list from constants or ssr
export default NFTList;

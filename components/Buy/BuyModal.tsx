import { useError } from "../../context/ErrorContext";
import { Contract, ethers, BigNumber, utils } from "ethers";
import type { Token as tokenType } from "../../utils/constants";
import styles from "../../styles/Modals.module.css";
import { useContracts } from "../../context/ContractsContext";
import type { NFT } from "../NFT/Display";
import { currency } from "../../utils/constants";
import Image from "next/image";
import { useCartInfo } from "../../context/CartInfoContext";
import { useEffect, useState, CSSProperties } from "react";
import { IERC20 } from "../../abi/abis";
import { useWallet } from "../../context/WalletContext";
import ClipLoader from "react-spinners/ClipLoader";
const { formatEther } = utils;
type props = {
  setShowBuyModal: Function;
};
type loadState = {
  loading: boolean;
  message: string;
};

const BuyModal = () => {
  const { setError } = useError();
  const { account } = useWallet();
  const { contracts } = useContracts();
  const ChainId = account?.network?.chainId as keyof typeof currency;
  const [currencyList, setCurrencyList] = useState(currency[ChainId]);
  const [selectedCurrency, setSelectedCurrency] = useState<tokenType>(
    currencyList[0]
  );
  const _token = new ethers.Contract(
    selectedCurrency.address,
    IERC20,
    account?.signer
  );
  const [currencyContract, setCurrencyContract] = useState<Contract>(_token);
  const [balance, setBalance] = useState<BigNumber>();
  const { cartInfo, setCartInfo } = useCartInfo();
  const [loadState, setLoadState] = useState<loadState>({
    loading: false,
    message: "",
  });

  const buyNow = async () => {
    if (!cartInfo.buyNow) throw Error("buyNow state is  empty");
    if (!currencyContract) throw Error("currencycontract not set");
    if (!contracts?.MintEngine) throw Error(" mint ingin contact not found");
    const allowance: BigNumber = await currencyContract.allowance(
      account?.address,
      contracts?.MintEngine?.address
    );
    const price = cartInfo.buyNow.price;
    const buyInfo = cartInfo.buyNow;
    // buy now compare allowance with price

    if (allowance.lt(price)) {
      setLoadState({
        loading: true,
        message: "waiting approval confirm",
      });
      const approve = await currencyContract.approve(
        contracts?.MintEngine?.address,
        price
      );
      setLoadState({
        loading: true,
        message: "waiting approval to finish",
      });
      await approve.wait();
      setLoadState({
        loading: true,
        message: "waiting buy tx confirm",
      });
      const buy = await contracts.MintEngine.buy(
        account?.address,
        buyInfo.id,
        buyInfo.amount,
        ethers.constants.HashZero,
        currencyContract.address
      );
      setLoadState({
        loading: true,
        message: "waiting buy tx to fimish",
      });
      await buy.wait();
      closeModal();
      // set load state
    }
  };
  const buy = async () => {
    try {
      setLoadState({
        loading: true,
        message: "",
      });
      if (cartInfo.buyNow) await buyNow();
      else await buyBatch();
    } catch (err: any) {
      setCartInfo((prev) => ({
        ...prev,
        showModal: false,
      }));
      setError({ code: 500, message: err?.message });
      setLoadState({ loading: false, message: "" });
    }
  };
  const buyBatch = async () => {
    const totalPrice = cartInfo.totalPrice;
    const allowance: BigNumber = await currencyContract.allowance(
      account?.address,
      contracts?.MintEngine?.address
    );
    if (!currencyContract) throw Error("currencycontract not set");
    if (!contracts?.MintEngine) throw Error(" mint ingin contact not found");
    let ids: number[] = [];
    let amounts: number[] = [];
    cartInfo.cart.map(async (info, key) => {
      if (info) {
        ids.push(key);
        amounts.push(info.amount);
      }
    });
    console.log(ids, "ids");
    console.log(amounts, "amounts");
    if (allowance.lt(totalPrice)) {
      setLoadState({
        loading: true,
        message: "waiting approval confirm",
      });
      const approve = await currencyContract.approve(
        contracts?.MintEngine?.address,
        totalPrice
      );
      setLoadState({
        loading: true,
        message: "waiting approval to finish",
      });
      await approve.wait();
      setLoadState({
        loading: true,
        message: "waiting buy tx confirm",
      });
      //buyBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data,address currency) external"
      const buy = await contracts.MintEngine.buyBatch(
        account?.address,
        ids,
        amounts,
        ethers.constants.HashZero,
        currencyContract.address
      );
      setLoadState({
        loading: true,
        message: "waiting buy tx to fimish",
      });
      await buy.wait();
      closeModal();
    }
  };
  const closeModal = () => {
    // reset buyNow to undefined
    setCartInfo((prev: any) => ({
      ...prev,
      showModal: false,
      buyNow: undefined,
    }));
  };
  //@dev when network changes state to be refreshed
  useEffect(() => {
    if (account?.network?.chainId) {
      const _ChainId = account?.network?.chainId as keyof typeof currency;
      setCurrencyList(currency[_ChainId]);
    }
  }, [account?.network?.chainId]);
  //@dev when signer changes state to be refreshed
  useEffect(() => {
    if (selectedCurrency && account?.signer) {
      (async () => {
        const _token = new ethers.Contract(
          selectedCurrency.address,
          IERC20,
          account?.signer
        );
        const _balance = await _token.balanceOf(account?.address);
        setCurrencyContract(_token);
        setBalance(_balance);
      })();
    }
  }, [account?.signer, selectedCurrency]);
  return (
    <>
      <div className="focusOverlay">
        <div className={`${styles.modal} ${styles.buyModal}`}>
          <div className={styles.nftcart}>
            *nft images in cart show here animate in with sacle in * with
            amounts in a tag
            {cartInfo?.buyNow ? (
              <div>
                <div> id:{cartInfo?.buyNow.id}</div>
                <div> price:{formatEther(cartInfo?.buyNow.price)}</div>
              </div>
            ) : (
              <div>
                {cartInfo.cart.map((item) => {
                  return (
                    item && (
                      <div>
                        <span>id:{item.id}</span>
                        <span>amount:{item.amount}</span>
                        <span>price:{formatEther(item.price)}</span>
                      </div>
                    )
                  );
                })}
              </div>
            )}
          </div>
          <div>
            balace: {balance && formatEther(balance).slice(0, 8)}
            total:{" "}
            {(cartInfo?.buyNow?.price &&
              formatEther(cartInfo?.buyNow?.price)) ||
              (cartInfo?.totalPrice && formatEther(cartInfo?.totalPrice))}
            $
          </div>
          <h5>payment Option</h5>
          <div className={styles.currencyList}>
            {currencyList.map((token, key) => {
              return (
                <button
                  key={key}
                  className={`${styles.currency} ${
                    selectedCurrency?.address == token.address &&
                    styles.selectedCurrency
                  } `}
                  onClick={() => setSelectedCurrency(token)}
                >
                  {token.symbol}
                  <div className={styles.currencyImg}>
                    <Image
                      src={token.logoURI}
                      layout="fill"
                      objectFit="contain"
                    ></Image>
                  </div>
                </button>
              );
            })}
          </div>
          {loadState.loading ? (
            <ClipLoader
              color={rgb(31, 222, 66)}
              loading={loading}
              cssOverride={override}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          ) : (
            // <div className="lds-spinner">
            //   <div></div>
            //   <div></div>
            //   <div></div>
            //   <div></div>
            //   <div></div>
            //   <div></div>
            //   <div></div>
            //   <div></div>
            //   <div></div>
            //   <div></div>
            //   <div></div>
            //   <div></div>
            //   <span className="msg">{loadState.message}</span>
            // </div>
            <div>
              <button
                className="addtocart"
                onClick={buy}
                disabled={currencyContract == undefined}
              >
                BuyNow
              </button>
              <button className="addtocart" onClick={closeModal}>
                cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default BuyModal;

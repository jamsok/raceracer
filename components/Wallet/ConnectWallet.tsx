import { useEffect, useState, useCallback } from "react";
import { toHex } from "../../utils/utils";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { getContractInstance } from "../../utils/utils";
import { useWallet } from "../../context/WalletContext";
import { useContracts } from "../../context/ContractsContext";
import { providerOptions } from "./providers";
import styles from "../../styles/Nav.module.css";
import { ChainId } from "../../utils/constants";
import { motion } from "framer-motion";
import { fadeIn } from "../../animations/animations";
import { useError } from "../../context/ErrorContext";

const ConnectWallet = () => {
  const { account, setAccount } = useWallet();
  const { contracts, setContracts } = useContracts();
  const [modalOpen, setModalOpen] = useState(false);
  const [provider, setProvider] = useState<any>();
  const [instance, setInstance] = useState<any>();
  const [web3Modal, setWeb3Modal] = useState<any>();
  const [wrongNetwork, setWrongNetwork] = useState(false);
  const { setError } = useError();
  let isMounted = false;

  // initialise web3 modal
  useEffect(() => {
    isMounted = true;
    if (typeof window !== "undefined") {
      const initialise = async () => {
        const _web3Modal = new Web3Modal({
          // optional
          cacheProvider: true, // optional
          providerOptions, // required
        });
        isMounted && setWeb3Modal(_web3Modal);
      };
      isMounted && initialise();
    }
    return () => {
      isMounted = false;
      setWeb3Modal(undefined);
    };
  }, []);

  //@dev on signer change re-initialise contracts
  useEffect(() => {
    (async () => {
      if (account?.signer && account?.network?.chainId) {
        // implement later
        const contract = await getContractInstance(
          account?.network?.chainId,
          account?.signer
        );
        if (contract) {
          setContracts(contract);
        } else {
          setError({
            code: 400,
            message: "no contract on this network",
          });
        }
      }
    })();
  }, [account?.signer, account?.network?.chainId]);

  const connect = async () => {
    try {
      const _instance = await web3Modal.connect();
      let _provider = new ethers.providers.Web3Provider(_instance);
      setInstance(_instance);
      setProvider(provider);
      const accounts = await _provider.listAccounts();
      const network = await _provider.getNetwork();
      const _signer = _provider.getSigner(0);
      const _account = {
        address: accounts[0],
        network: network,
        provider: _provider,
        signer: _signer,
        connected: true,
      };
      setAccount(_account);
      setModalOpen(false);
      if (
        network?.chainId != ChainId.BSC_MAIN &&
        network?.chainId != ChainId.BSC_TEST
      ) {
        await switchNetwork(_provider);
      }
    } catch (err: any) {
      setError({
        code: 400,
        message: err.message,
      });
    }
  };
  // un comment if connect on load by d
  useEffect(() => {
    isMounted = true;
    if (web3Modal) {
      if (localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER")) {
        isMounted && connect();
      }
    }
    return () => {
      isMounted = false;
    };
  }, [web3Modal]);
  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      connect();
    };
    const handleChainChange = async (chainId: string) => {
      chainId == toHex(ChainId.BSC_MAIN) || chainId == toHex(ChainId.BSC_TEST)
        ? setWrongNetwork(false)
        : setWrongNetwork(true);
      connect();
    };
    if (instance?.on) {
      instance.on("accountsChanged", handleAccountsChanged);
      instance.on("chainChanged", handleChainChange);
    }
    return () => {
      if (instance?.removeListener) {
        instance.removeListener("accountsChanged", handleAccountsChanged);
        instance.removeListener("chainChanged", handleChainChange);
      }
    };
  }, [instance?.on]);
  // switch network only oasis
  const switchNetwork = async (_provider: any) => {
    if (_provider) {
      try {
        await _provider?.provider?.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(56) }],
        });
        setWrongNetwork(false);
      } catch (switchError: any) {
        if (switchError?.code === 4902) {
          try {
            await _provider.provider.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: toHex(56),
                  chainName: "Binance Smart Chain",
                  nativeCurrency: {
                    symbol: "BNB", // 2-6 characters long
                    decimals: 18,
                  },
                  rpcUrls: ["https://bsc-dataseed.binance.org/"],
                  blockExplorerUrls: ["https://bscscan.com"],
                },
              ],
            });
          } catch (error: any) {
            setError(error);
          }
        }
      }
    }
  };
  const disconnect = useCallback(async () => {
    web3Modal && (await web3Modal.clearCachedProvider());
    setAccount((prevState: any) => ({
      ...prevState,
      address: undefined,
    }));
  }, [web3Modal?.clearCachedProvider]);
  // connect wallet
  return (
    <>
      {account?.address ? (
        <motion.button
          initial={fadeIn.hidden}
          animate={fadeIn.visible}
          exit={fadeIn.exit}
          whileHover={{
            scale: 1.1,
            color: "black",
            backgroundColor: "white",
            border: "none",
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ ease: "easeIn", duration: 0.006 }}
          className={styles.walletButton}
          onClick={disconnect}
        >
          disconnect
        </motion.button>
      ) : (
        <motion.button
          initial={fadeIn.hidden}
          animate={fadeIn.visible}
          exit={fadeIn.exit}
          whileHover={{
            scale: 1.1,
            color: "black",
            backgroundColor: "white",
            border: "none",
          }}
          whileTap={{ scale: 0.9 }}
          transition={{ ease: "easeOut", duration: 0.006 }}
          className={styles.walletButton}
          onClick={connect}
        >
          connectwallet
        </motion.button>
      )}
      {account?.address && (
        <motion.span
          initial={fadeIn.hidden}
          animate={fadeIn.visible}
          exit={fadeIn.exit}
          transition={{ ease: "easeIn", duration: 0.2 }}
          className={styles.walletAddress}
        >
          {account?.address.slice(0, 6) +
            "..." +
            account?.address.slice(-5, -1)}
        </motion.span>
      )}
      {wrongNetwork && <div>wrong network only BNB suported </div>}
    </>
  );
};
export default ConnectWallet;

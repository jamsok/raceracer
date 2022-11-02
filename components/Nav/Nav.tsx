import ConnectWallet from "../Wallet/ConnectWallet";
import styles from "../../styles/Nav.module.css";
import { useWallet } from "../../context/WalletContext";
import Image from "next/image";
import Link from "next/link";

const Nav = () => {
  const { account } = useWallet();
  return (<>
    <div className={styles.nav}>      
        <div className={styles.walletContainer}>
            <ConnectWallet></ConnectWallet>
        </div>        
    </div>
    </>);
};
export default Nav;

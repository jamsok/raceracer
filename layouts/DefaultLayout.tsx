import Nav from "../components/Nav/Nav"
import ErrorModal from "../components/Error/ErrorModal"
import { ErrorProvider } from "../context/ErrorContext"
import { WalletProvider } from "../context/WalletContext"
// import { AdminAuthProvider } from "../context/AdminAuthContext"
import { ContractsProvider } from "../context/ContractsContext"
// import { UserAuthProvider } from "../context/UserAuthContext"
// import { LoadStateProvider } from "../context/LoadingContext"
import { CartInfoProvider } from "../context/CartInfoContext"
import {ReactNode} from "react"
import {motion} from "framer-motion"
import { fadeIn } from "../animations/animations"
// import { UserProvider } from "../context/UserContext"
// import LoadingModal from "../components/AddProjectForm/Loading"
// import useSWR, { SWRConfig } from 'swr'

interface Props{
    children?:ReactNode
}
const DefaultLayout =({children}:Props)=>{
    return(
    <WalletProvider>
    <ErrorProvider>
    <CartInfoProvider> 
    <ContractsProvider>
        <motion.div  initial={fadeIn.hidden}
        animate={fadeIn.visible}
        exit={fadeIn.exit}
        transition={{ ease: "easeIn", duration: 0.3 }} 
        >
        <ErrorModal/>
        <Nav/>
        {children}
        </motion.div>
    </ContractsProvider> 
    </CartInfoProvider>
    </ErrorProvider>
    </WalletProvider>
    )
}
export default DefaultLayout
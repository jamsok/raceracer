
import { useError } from "../../context/ErrorContext"
import styles from "../../styles/Modals.module.css"
const ErrorModal = ()=>{
    const {error,setError} = useError()
    const close =()=>{
        setError(undefined)
    }
    if(!error) return (<></>)
    return(<>
    <div className="focusOverlay">
        <div className ={`${styles.modal} ${styles.errorModal}`}>
                <h3>ERROR</h3>
                <section>
                    <h4>{error?.code}</h4>
                    <p>
                        {error.message}
                    </p>
                </section>
                <button className={styles.okButton} onClick={close}>OK</button>
            </div>

    </div>
       
    </>)
}
export default ErrorModal
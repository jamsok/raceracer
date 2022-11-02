import React, { useContext,useDebugValue, useState, ReactNode } from 'react'
import { type } from 'os';
interface Props {
  children?: ReactNode
  // any props that come into the component
}
export type error ={
    code?: number,
    message: string,
    err?:any
}
export type ErrorContext = {
  error : error | undefined |null
  setError: React.Dispatch<React.SetStateAction<error | undefined>>
};
const ErrorContext = React.createContext<ErrorContext>(
    {   error:undefined,
        setError :  async (newValue) => null
    });
        
export const useError = () => {
    const { error,setError} = useContext(ErrorContext)
    useDebugValue(error, error => error?  "error" : "no error")
    return useContext(ErrorContext)
}

export const ErrorProvider = ({children}:Props) => {
  const [error, setError] = useState<error | undefined>()
  return <ErrorContext.Provider 
      value={{ error, setError }}>{children}
      </ErrorContext.Provider>
}
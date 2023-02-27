import React, { createContext, useContext, useEffect, useState } from 'react'
import axios from 'axios';
import { CoinList } from '../config/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const CryptoContext = createContext();

const ContextProvider = ({children}) => {

   const [currency, setCurrency] = useState("INR") // for default currency
   const [symbol , setSymbol] = useState("₹")  // changing the symbol/currency after selecting the option
   
   const [ coins, setCoins ] = useState([])
   const [ loading, setLoading ] = useState(false)

   const [user ,setUser] = useState("")

   useEffect(() => {
     onAuthStateChanged(auth, user => {
        if(user) setUser(user)
        else setUser("")
     })
   }, [])

   const fetchCoins = async () => {

      setLoading(true)
      const { data } = await axios.get(CoinList(currency))  // COIN LIST OF CONIS TABLE

      setCoins(data)
      setLoading(false) 
}

    useEffect(() => {
      fetchCoins()          
    },[currency])



   useEffect(() => {
      if(currency === "INR") setSymbol("₹")
      else if (currency === "USD") setSymbol("$")
   }, [currency])

     return(
         <CryptoContext.Provider value={{ 
            currency,
             symbol,
              setCurrency,
               coins,
                loading,
                user
                 }}>
                  
              {children}
         </CryptoContext.Provider> 
     ) 

}

export default ContextProvider;

export const UseCryptoValue = () => useContext(CryptoContext)
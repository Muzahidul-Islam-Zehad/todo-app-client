import { GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../Firebase/firebaseConfig";
import PropTypes from "prop-types";

export const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [isLoading, setIsloading] = useState(true);
    const [user, setUser] = useState([]);

    useEffect(() =>{
        
        const unSubscribe = onAuthStateChanged(auth, currentUser =>{
            setIsloading(true);
            if(currentUser)
            {
                setUser(currentUser);
                setIsloading(false);
            }
            else
            {
                setUser([]);
                setIsloading(false);
            }
        })

        return () => unSubscribe();
    },[]);

   // console.log(user, isLoading);

    const googleSignIn = () =>{
        setIsloading(true);
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider);
    }

    const userSignOut = () =>{
        setIsloading(true);
        return signOut(auth);
    }
    const contextValue = {
        isLoading,
        setIsloading,
        googleSignIn,
        user,
        setUser,
        userSignOut,
    }
    
    return (
        <AuthContext.Provider value={contextValue}>
            {
                children
            }
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes ={
    children: PropTypes.element
}

export default AuthProvider;
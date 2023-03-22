import React, { ReactNode, createContext, useContext } from 'react';
import {
    onAuthStateChanged,
    getAuth,
    signOut,
} from 'firebase/auth';
import app from '@/firebase/config';

import { useState } from 'react';

const auth = getAuth(app);

export const AuthContext = createContext({
    user: null,
    loading: true
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({
    children
}: {
    children?: ReactNode
}) => {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState<boolean>(true);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (userInput) => {
            if (userInput) {
                console.log('user there is')
                setUser(userInput);
            } else {
                console.log('user there is not')
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {loading ? <div>Loading...</div> : children}
        </AuthContext.Provider>
    );
};

export const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };
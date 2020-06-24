import App from 'next/app';
import firebase, { firebaseContext } from '../firebase';
import useAuth from '../hooks/useAuth';

const MyApp = props => {

    const user = useAuth();

    const { Component, pageProps } = props

    return (
        <firebaseContext.Provider
            value={{
                firebase,
                user
            }}
        >
            <Component {...pageProps} />
        </firebaseContext.Provider>
    )
}

export default MyApp;
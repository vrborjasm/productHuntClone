import React, { useState, useEffect, useContext} from 'react';
import { firebaseContext } from '../firebase';

const useProducts = order => {

    const [ products, setProducts ] = useState([]);

    const { firebase } = useContext(firebaseContext);

    useEffect(() => {
    const getProducts = () => {
        firebase.db.collection('products').orderBy(order, 'desc').onSnapshot(handleSnapshot);
    }
    getProducts();
    },[]);

    function handleSnapshot(snapshot) {
    const products = snapshot.docs.map(doc => {
        return {
        id: doc.id,
        ...doc.data()
        }
    });
    setProducts(products);
    }

    return {
        products
    }
}

export default useProducts

import React, {useEffect,useState} from 'react';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import ProductDetails from '../components/layout/ProductDetails';
import useProducts from '../hooks/useProducts';
import styled from '@emotion/styled';

const Message = styled.h1`
  margin: 4rem auto;
  text-align:center;
  font-size: 5rem;
`;

const Search = () => {

const router = useRouter();
const { query: { q } } = router;

const { products } = useProducts('createDate');
const [ result, setResult ] =  useState([]);

  useEffect(() => {
    const search = q.toLowerCase();
    const filter = products.filter(product => {
      return(
        product.name.toLowerCase().includes(search)
      )
    });
    setResult(filter);
  }, [ q, products ]);

  return (
    <div>
      <Layout>
        {result.length === 0 ? <Message>No existe coincidencia con {q}</Message> : (
        <div className="list-products">
          <div className="container">
            <ul className="bg-white">
              {result.map(product => (
                <ProductDetails 
                  key={product.id}
                  product={product}
                />
              ))}
            </ul>
          </div>
        </div>  
        )}
      </Layout>
    </div>
  )
}
 
export default Search;
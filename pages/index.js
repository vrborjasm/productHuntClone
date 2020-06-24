import React from 'react';
import Layout from '../components/layout/Layout';
import ProductDetails from '../components/layout/ProductDetails';
import useProducts from '../hooks/useProducts';
import styled from '@emotion/styled';

const Message = styled.h1`
  margin: 4rem auto;
  text-align:center;
  font-size: 5rem;
`;

const Home = () => {

  const { products } = useProducts('createDate');

  return (
    <div>
      <Layout>
        {products.length === 0 ? <Message>No existe ningun producto</Message> : (
        <div className="list-products">
          <div className="container">
            <ul className="bg-white">
              {products.map(product => (
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
 
export default Home;

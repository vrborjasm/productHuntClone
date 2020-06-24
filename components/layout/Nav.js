import React, { useContext } from 'react';
import Link from 'next/link';
import { firebaseContext } from '../../firebase';
import styled from '@emotion/styled';

const Nav = styled.nav`
    padding-left: 2rem;

    a {
        font-size: 1.8rem;
        margin-left: 2rem;
        color: var(--grey2);
        font-family: 'PT Sans', sans-serif;

        &:last-of-type {
            margin-right: 0;
        }
    }
`;

const Navi = () => {

    const { user } = useContext(firebaseContext);

    return ( 
        <Nav>
            <Link href="/"><a>Inicio</a></Link>
            <Link href="/popular"><a>Populares</a></Link>
            {user && (
                <Link href="/newproduct"><a>Nuevos Productos</a></Link>
            )}
            
        </Nav>
     );
}
 
export default Navi;
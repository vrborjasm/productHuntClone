import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import { firebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { Field, InputSubmit } from '../../components/ui/Form';
import Button from '../../components/ui/Button';

const ProductContainer = styled.div`
    @media (min-width: 768px) {
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }
`;

const ProductCreator = styled.p`
    padding: .5rem 2rem;
    background-color: #DA552F;
    color: #FFFFFF;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`;

const Product = () => {

    const [product, setProduct] = useState('');
    const [error, setError] = useState(false);
    const [comment, setComment] = useState({});
    const [requestDB, setRequestDB] = useState(true);

    const router = useRouter();
    const { query: { id } } = router;

    const { firebase, user } = useContext(firebaseContext);

    useEffect(() => {
        if (id && requestDB) {
            const getProduct = async () => {
                const productQuery = await firebase.db.collection('products').doc(id);
                const product = await productQuery.get();
                if (product.exists) {
                    setProduct(product.data())
                    setRequestDB(false);
                } else {
                    setError(true);
                    setRequestDB(false);
                }
            }
            getProduct();
        }
    }, [id]);

    if (Object.keys(product).length === 0 && !error) return 'Cargando...';

    const { voteBy, creator, business, comments, createDate, description, imgURL, name, url, votes } = product;

    const productVotes = () => {
        if(!user) {
            return router.push('/login')
        }
        const total = votes + 1;

        if(voteBy.includes(user.uid)) return;

        const newVoteBy = [...voteBy, user.uid];

        firebase.db.collection('products').doc(id).update({ votes: total, voteBy: newVoteBy});

        setProduct({
            ...product,
            votes: total
        })
        setRequestDB(true);
    }

    const commentChange = e => {
        setComment({
            ...comment,
            [e.target.name] : e.target.value
        })
    }

    const isCreator = id => {
        if(creator.id === id ) {
            return true;
        }
    }

    const addComment = e => {
        e.preventDefault();

        comment.userId = user.uid;
        comment.userName = user.displayName;

        const newComments = [...comments, comment ];

        firebase.db.collection('products').doc(id).update({ comments: newComments });

        setProduct({
            ...product,
            comments: newComments
        })
        setRequestDB(true);
    }

    const couldDelete = () => {
        if(!user) return false;

        if(creator.id === user.uid) {
            return true;
        }
    }

    const deleteProduct = async () => {
        if(!user) {
            return router.push('/login');
        }

        if(creator.id !== user.uid) {
            return router.push('/login');
        }

        try {
             await firebase.db.collection('products').doc(id).delete();
             router.push('/')   
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <Layout>
            <>
                {error ? <Error404 /> : (
                    <div className="container">
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >{name}</h1>

                    <ProductContainer>
                        <div>
                            <p>Publicado hace: {formatDistanceToNow(new Date(createDate), { locale: es })}</p>
                            <p>Por: {creator.name} de {business} </p>
                            <img src={imgURL} />
                            <p>{description}</p>

                            { user && (
                                <>
                                <h2>Agrega tu comentario</h2>
                                <form
                                    onSubmit={addComment}
                                >
                                    <Field>
                                        <input
                                            type="text"
                                            name="message"
                                            onChange={commentChange}
                                        />
                                    </Field>
                                    <InputSubmit
                                        type="submit"
                                        value="Agregar Comentario"
                                    />
                                </form>
                                </>
                            )}
                            <h2
                                css={css`
                                    margin: 2rem 0;
                                `}
                            >Comentarios</h2>

                            {comments.length === 0 ? "Aun no hay comentarios" : (
                                <ul>
                                    {comments.map((comment,i) => (
                                        <li
                                            key={`${comment.userId}-${i}`}
                                            css={css`
                                                border: 1px solid #e1e1e1;
                                                padding: 2rem;
                                            `}
                                        >
                                            <p>{comment.message}</p>
                                            <p>Escrito por: 
                                                <span
                                                    css={css`
                                                        font-weight: bold;
                                                    `}
                                                >
                                                {' '}{comment.userName}</span>
                                            </p>
                                          {isCreator(comment.userId) && <ProductCreator>Es Creador</ProductCreator>}      
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <aside>
                            <Button
                                target="_blank"
                                bgColor="true"
                                href={url}
                            >Visitar URL</Button>

                            <div css={css`
                            margin-top: 5rem;
                            `}
                            >
                                <p css={css`
                                    text-align: center;
                                `}>{votes} Votos</p>

                                { user && (
                                    <Button
                                        onClick={productVotes}
                                    >
                                        Votar
                                    </Button>
                                )}
                                
                            </div>                            
                        </aside>
                    </ProductContainer>
                    { couldDelete() &&
                        <Button
                            onClick={deleteProduct}
                        >Eliminar Producto</Button>
                    }
                </div>
                )}
            </>
        </Layout>
    );
}

export default Product;
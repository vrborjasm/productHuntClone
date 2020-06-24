import React, { useState, useContext } from 'react';
import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader';
import Layout from '../components/layout/Layout';
import { Form, Field, InputSubmit, Error } from '../components/ui/Form';  
import styled from '@emotion/styled';
import Error404 from '../components/layout/404';
import { css } from '@emotion/core';

import { firebaseContext } from '../firebase';

import useValidation from '../hooks/useValidation';
import newProductValidation from '../validation/newProductValidation';

const initialState = {
  name: '',
  business: '',
  img: '',
  url: '',
  description: ''
}

const NewProduct = () => {
  
  const [ imgName, setImgName ] = useState('');

  const [ upload, setUpload ] = useState(false);

  const [ progress, setProgress ] = useState(0);
  
  const [ imgURL, setImgURL ] = useState('');

  const [ errorNewProduct, setErrorNewProduct ] = useState(false);

  const {values,error,handleChange,handleSubmit,handleBlur} = useValidation(initialState,newProductValidation, newProduct);

  const { name, business, img, url, description } = values;

  const router = useRouter();

  const { user, firebase } = useContext(firebaseContext);

  async function newProduct() {
    if(!user) {
      return router.push('/login');
    }
    
    const product = {
      name,
      business,
      url,
      imgURL,
      description,
      votes: 0,
      comments: [],
      createDate: Date.now(),
      creator: {
        id: user.uid,
        name: user.displayName
      },
      voteBy: []
    }
    firebase.db.collection('products').add(product);
    router.push('/');
  }

  const handleUploadStart = () => { 
    setProgress(0);
    setUpload(true);
  }

  const handleProgress = progress => {
     setProgress(progress);   
  }

  const handleUploadError = error => {
    setUpload(error);
    console.error(error)
  }

  const handleUploadSuccess = filename => {
    setImgName(filename); 
    setProgress(100);
    setUpload(true);
    firebase
      .storage
      .ref("products")
      .child(filename)
      .getDownloadURL()
      .then(url => {
        console.log(url)
        setImgURL(url);
      });
  };

  return (
    <div>
      <Layout>
        { !user ? <Error404 />: (
        <>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >Nuevo Producto</h1>
        <Form
          onSubmit={handleSubmit}
          noValidate
        >
          <fieldset>
            <legend>Informacion General</legend>
            
            <Field>
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                placeholder="Nombre"
                name="name"
                value={name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            { error.name && <Error>{error.name}</Error>}

            <Field>
              <label htmlFor="business">Empresa</label>
              <input
                type="text"
                id="business"
                placeholder="Empresa"
                name="business"
                value={business}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            { error.business && <Error>{error.business}</Error>}

            <Field>
              <label htmlFor="img">Imagen</label>
              <FileUploader
              accept="image/*"
                id="img"
                name="img"
                randomizeFilename
                storageRef={firebase.storage.ref("products")}
                onUploadStart={handleUploadStart}
                onUploadError={handleUploadError}
                onUploadSuccess={handleUploadSuccess}
                onProgress={handleProgress}
              />
            </Field>


            <Field>
              <label htmlFor="url">URL</label>
              <input
                type="url"
                id="url"
                name="url"
                placeholder="URL"
                value={url}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Field>

            { error.url && <Error>{error.url}</Error>}

          </fieldset>

          <fieldset>
            <legend>Sobre tu Producto</legend>

            <Field>
              <label htmlFor="description">Descripcion</label>
              
              <textarea
                id="description"
                name="description"
                value={description}
                onChange={handleChange}
                onBlur={handleBlur}
              />

            </Field>

            { error.description && <Error>{error.description}</Error>}

          </fieldset>

          { errorNewProduct && <Error>{errorNewProduct}</Error>}

            <InputSubmit
              type="submit"
              value="Crear Producto"
            />

        </Form>
          </>
        )}
      </Layout>
    </div>
  )
}
 
export default NewProduct;

import React, { useState } from 'react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Form, Field, InputSubmit, Error } from '../components/ui/Form';  
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import firebase from '../firebase';

import useValidation from '../hooks/useValidation';
import newAccountValidation from '../validation/newAccountValidation';

const initialState = {
  name: '',
  email: '',
  password: ''
}

const NewAccount = () => {

  const [ errorNewAccount, setErrorNewAccount ] = useState(false);

  const {values,error,handleChange,handleSubmit,handleBlur} = useValidation(initialState,newAccountValidation, newAccount);

  const { name, email, password } = values;

  async function newAccount() {
    try {
      await firebase.signup(name, email, password);
      Router.push('/');
    } catch (error) {
      console.error('Hubo un error al crear el usuario', error.message);
      setErrorNewAccount(error.message);
    }
    
  }

  return (
    <div>
      <Layout>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >Crear Cuenta</h1>
        <Form
          onSubmit={handleSubmit}
          noValidate
        >

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
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="E-mail"
              name="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          { error.email && <Error>{error.email}</Error>}

          <Field>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </Field>

          { error.password && <Error>{error.password}</Error>}

          { errorNewAccount && <Error>{errorNewAccount}</Error>}

            <InputSubmit
              type="submit"
              value="Crear Cuenta"
            />

        </Form>
      </Layout>
    </div>
  )
}
 
export default NewAccount;

import React, { useState } from 'react';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Form, Field, InputSubmit, Error } from '../components/ui/Form';  
import styled from '@emotion/styled';
import { css } from '@emotion/core';

import firebase from '../firebase';

import useValidation from '../hooks/useValidation';
import loginValidation from '../validation/loginValidation';

const initialState = {
  email: '',
  password: ''
}


const Login = () => {

  const [ errorLogin, setErrorLogin ] = useState(false);

  const {values,error,handleChange,handleSubmit,handleBlur} = useValidation(initialState,loginValidation, login);

  const { email, password } = values;

  async function login() {
    try {
      await firebase.login(email, password);
      Router.push('/');
    } catch (error) {
      console.error('Hubo un error al crear el usuario', error.message);
      setErrorLogin(error.message);
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
        >Iniciar Sesion</h1>
        <Form
          onSubmit={handleSubmit}
          noValidate
        >

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

          { errorLogin && <Error>{errorLogin}</Error>}

            <InputSubmit
              type="submit"
              value="Iniciar Sesion"
            />

        </Form>
      </Layout>
    </div>
  )
}
 
export default Login;
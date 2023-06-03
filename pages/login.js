import Head from 'next/head';
import { React, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import styles from '../styles/utils.module.css';
import { useAppContext } from '../components/context';
import { useRouter } from 'next/router';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});


const Login = () => {
  const [emailInput, setEmailInput] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAppContext()
  const [valid, setValid] = useState(true)
  const router = useRouter();

  const handleEmailInput = (e) => {
    setEmailInput(e.target.value);
    setValid(true)
  };

  const handlePasswordInput = (e) => {
    setPassword(e.target.value);
    setValid(true)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    var result = await login(client, emailInput, password)
    if (result) {
      router.push('/');
    }
    else {
      setValid(false)
    }
  };

  return (
    <Layout>
      <Head>
        <title>Log In</title>
      </Head>
      <h1 className={styles.titleContainer}>Log In</h1>
      <form onSubmit={handleSubmit}>
        <div className={styles.inline}>
          <label className={styles.formLabelRequired} htmlFor="email">Email Address:</label>
          <input className={valid ? styles.textBox : styles.textBoxInvalid} required type="email" id="email" name="email" onChange={handleEmailInput} value={emailInput} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabelRequired} htmlFor="password">Password:</label>
          <div>
            <input className={valid ? styles.textBox : styles.textBoxInvalid} required type="password" id="password" name="password" onChange={handlePasswordInput} value={password} />
          </div>
        </div>
        <button className={styles.submitButton} type="submit">Submit</button>
      </form>
    </Layout>
  );
}

export default Login
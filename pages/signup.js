import Head from 'next/head';
import React from 'react';
import axios from 'axios';
import Layout from '../components/layout';
import styles from '../styles/utils.module.css';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});


export default class Signup extends React.Component {
  state = {
    first: "",
    last: "",
    email: "",
    password: ""
  };

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    client
      .post("/auth/register/", {
        firstName: this.state.first,
        lastName: this.state.last,
        email: this.state.email,
        password: this.state.password
      })
      .then((res) => {
        var val = res.data
        console.log(val)
      })
      .catch((err) => { });
  };

  delete_users = () => {
    axios
      .post("http://localhost:8000/api/deleteusers/", {})
      .then((res) => {
        var val = res.data
        console.log(val)
      })
      .catch((err) => { });
  }

  render() {
    return (
      <Layout>
        <Head>
          <title>Sign Up</title>
        </Head>
        <h1 className={styles.titleContainer}>Sign Up</h1>
        <form onSubmit={this.handleSubmit}>
          <div className={styles.inline}>
            <label className={styles.formLabelRequired} htmlFor="first">First name:</label>
            <input className={styles.textBox} required type="text" id="first" name="first" onChange={this.handleInput} value={this.state.first} />
          </div>
          <div className={styles.inline}>
            <label className={styles.formLabelRequired} htmlFor="last">Last name:</label>
            <input className={styles.textBox} required type="text" id="last" name="last" onChange={this.handleInput} value={this.state.last} />
          </div>
          <div className={styles.inline}>
            <label className={styles.formLabelRequired} htmlFor="email">Email Address:</label>
            <input className={styles.textBox} required type="email" id="email" name="email" onChange={this.handleInput} value={this.state.email} />
          </div>
          <div className={styles.inline}>
            <label className={styles.formLabelRequired} htmlFor="password">Password:</label>
            <input className={styles.textBox} required type="password" id="password" name="password" onChange={this.handleInput} value={this.state.password} />
          </div>
          <button className={styles.submitButton} type="submit">Submit</button>
        </form>
        <button className={styles.submitButton} onClick={this.delete_users}>Delete all Users</button>
      </Layout>
    );
  }
}
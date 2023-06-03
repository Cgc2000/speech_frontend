import Head from 'next/head';
import Layout from '../components/layout';
import styles from '../styles/utils.module.css';
import { useRouter } from 'next/router';

export default function Tournaments() {
  const router = useRouter();
  const handleClick = (e) => {
    e.preventDefault();
    router.push('/register');
  };
  return (
    <Layout>
      <Head>
        <title>Tournaments</title>
      </Head>
      <h1 className={styles.titleContainer}>Tournaments</h1>
      <hr></hr>
      <h3 className={styles.titleContainer}>Created Tournaments</h3>
      <button className={styles.registerLink} onClick={handleClick}>
        <p>Register a New Tournament</p>
      </button>
      <hr></hr>
      <h3 className={styles.titleContainer}>Entered Tournaments</h3>
    </Layout>
  );
}
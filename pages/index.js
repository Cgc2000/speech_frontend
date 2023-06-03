import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import styles from '../styles/utils.module.css';

export default function Home() {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div>
        <h1 className={styles.titleContainer}>Welcome to Speech Website!</h1>
      </div>
    </Layout>
  );
}
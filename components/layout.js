import Head from 'next/head';
import styles from './layout.module.css';
import Link from 'next/link';
import Navbar from './navbar';

export const siteTitle = 'Speech Website';

export default function Layout({ children, home }) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/speech.ico" />
        <meta
          name="description"
          content="Speech Tournament Website"
        />
        <meta name="og:title" content={siteTitle} />
      </Head>
      <Navbar></Navbar>
      <div className={styles.container}>
        <main>{children}</main>
        {!home && (
          <div className={styles.backToHome}>
            <Link href="/">← Back to home</Link>
          </div>
        )}
      </div>
    </div>
  );
}
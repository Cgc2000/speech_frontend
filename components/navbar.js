import React, { useEffect } from 'react'
import styles from '../styles/utils.module.css'
import Link from 'next/link'
import { useAppContext } from './context';

const Navbar = () => {
  const { firstName, isLoggedIn, setContext } = useAppContext()

  return (
    <header className={styles.navbar}>
      <nav>
        <ul className={styles.linkList}>
          <Link className={styles.links} href='/'><li>Home</li></Link>
          <Link className={styles.links} href='/tournaments'><li>Tournaments</li></Link>
        </ul>
      </nav>
      {isLoggedIn && <p className={styles.textRight}>Welcome, {firstName}!</p>}
      {!isLoggedIn &&
        <nav>
          <ul>
            <Link className={styles.linksRight} href='/login'><li>Log In</li></Link>
            <Link className={styles.linksRight} href='/signup'><li>Sign Up</li></Link>
          </ul>
        </nav>}
    </header>
  )
}

export default Navbar
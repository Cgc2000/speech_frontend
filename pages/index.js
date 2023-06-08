import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import styles from '../styles/utils.module.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [tournaments, setTournaments] = useState([])

  useEffect(() => {
    client
      .post("/tournament/get_all_tournaments/", {})
      .then((res) => {
        var data = JSON.parse(res.data)
        setTournaments(data)
        setLoading(false)
      }).catch((err) => {
        setLoading(false)
      })
  }, []);

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div>
        <h1 className={styles.titleContainer}>Welcome to Speech Website!</h1>
      </div>
      <hr></hr>
      <h2 className={styles.titleContainer}>All Tournaments</h2>
      <hr></hr>
      {loading &&
        <p className={styles.tournamentLoading}>Loading...</p>}
      {tournaments.map(tournament =>
        <div className={styles.tournament}>
          <div className={styles.tournamentBorder}>
            <p className={styles.tournamentContainerHome}>{tournament.tournamentName}</p>
          </div>
          <div className={styles.tournamentRight}>
            <p className={styles.accessCode}>{tournament.hostSchool}, {tournament.tournamentCity}, {tournament.tournamentState}</p>
          </div>
        </div>)}
    </Layout>
  );
}
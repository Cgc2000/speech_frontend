import Head from 'next/head';
import Layout from '../components/layout';
import styles from '../styles/utils.module.css';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAppContext } from '../components/context';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});


export default function Tournaments() {
  const [tournaments, setTournaments] = useState([])
  const router = useRouter();
  const { userId } = useAppContext()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (userId) {
      client
        .post("/tournament/get_user_tournaments/", {
          userId: userId
        }).then((res) => {
          var data = JSON.parse(res.data)
          setTournaments(data)
          setLoading(false)
        }).catch((err) => {
          setLoading(false)
        })
    }
    else {
      setLoading(false)
    }
  }, []);


  const handleClick = (e) => {
    e.preventDefault();
    router.push('/register');
  };
  const handleDelete = (id) => {
    console.log(id)
    client
      .post("/tournament/delete_tournament/", {
        tournamentId: id
      }).then((res) => {
        client
          .post("/tournament/get_user_tournaments/", {
            userId: userId
          }).then((res) => {
            var data = JSON.parse(res.data)
            console.log(data)
            setTournaments(data)
          }).catch((err) => {
            setTournaments([])
          })
      })
  }

  return (
    <Layout>
      <Head>
        <title>Tournaments</title>
      </Head>
      <h1 className={styles.titleContainer}>Tournaments</h1>
      <hr></hr>
      <h3 className={styles.titleContainer}>Registered Tournaments</h3>
      {loading && <p className={styles.tournamentLoading}>Loading...</p>}
      {tournaments.map(tournament => <div className={styles.tournament}><p className={styles.tournamentContainer}>{tournament.tournamentName}</p><button className={styles.deleteButton} onClick={() => handleDelete(tournament.tournamentId)}>Delete</button></div>)}
      <button className={styles.registerLink} onClick={handleClick}>
        <p>Register a New Tournament</p>
      </button>
      <hr></hr>
      <h3 className={styles.titleContainer}>Entered Tournaments</h3>
    </Layout>
  );
}
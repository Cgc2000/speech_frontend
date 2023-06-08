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
  const [enteredTournaments, setEnteredTournaments] = useState([])
  const router = useRouter();
  const { userId, isLoggedIn } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [enteredLoading, setEnteredLoading] = useState(true)
  const [signingUp, setSigningUp] = useState(false)
  const [accessCode, setAccesCode] = useState('')

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

  useEffect(() => {
    if (!isLoggedIn) {
      router.push('/login')
    }
  }, [])

  useEffect(() => {
    client
      .post("/tournament/get_user_entered/", {
        userId: userId
      }).then((res) => {
        var data = JSON.parse(res.data)
        setEnteredTournaments(data)
        setEnteredLoading(false)
      }).catch((err) => {
        setEnteredLoading(false)
      })
  }, [])


  const handleRegisterClick = (e) => {
    e.preventDefault();
    router.push('/register');
  };

  const handleDelete = (id) => {
    client
      .post("/tournament/delete_tournament/", {
        tournamentId: id
      }).then((res) => {
        client
          .post("/tournament/get_user_tournaments/", {
            userId: userId
          }).then((res) => {
            var data = JSON.parse(res.data)
            setTournaments(data)
          }).catch((err) => {
            setTournaments([])
          })
      })
  }

  const handleEnteredDelete = (id) => {
    client
      .post("/tournament/delete_competitor/", {
        tournamentId: id,
        registerUserId: userId
      }).then((res) => {
        client
          .post("/tournament/get_user_entered/", {
            userId: userId
          }).then((res) => {
            var data = JSON.parse(res.data)
            setEnteredTournaments(data)
          }).catch((err) => {
            setEnteredTournaments([])
          })
      })
  }

  const handleSignupClick = (e) => {
    setSigningUp(!signingUp)
  }

  const handleAccessCodeInput = (e) => {
    setAccesCode(e.target.value)
  }

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    client
      .post("/tournament/get_tournament_by_code/", {
        accessCode: accessCode
      }).then((res) => {
        var data = JSON.parse(res.data)
        console.log(data)
        router.push({
          pathname: '/tournamentsignup',
          query: { tournamentId: data['tournamentId'] }
        }
        )
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
      {loading &&
        <p className={styles.tournamentLoading}>Loading...</p>}
      {tournaments.map(tournament =>
        <div className={styles.tournament}>
          <div className={styles.fullWidth}>
            <div className={styles.inlineSplit}>
              <p className={styles.tournamentContainer}>{tournament.tournamentName}</p>
              <div className={styles.tournamentRight}>
                <p className={styles.accessCode}>Code: {tournament.accessCode}</p>
                <button className={styles.deleteButton} onClick={() => handleDelete(tournament.tournamentId)}>Delete</button>
              </div>
            </div>
            <p className={styles.schoolsEntered}>{tournament.schoolsEntered} schools entered</p>
          </div>
        </div>)}
      <button className={styles.registerLink} onClick={handleRegisterClick}>
        <p>Register a New Tournament</p>
      </button>
      <hr></hr>
      <h3 className={styles.titleContainer}>Entered Tournaments</h3>
      {enteredLoading &&
        <p className={styles.tournamentLoading}>Loading...</p>}
      {enteredTournaments.map(tournament =>
        <div className={styles.tournament}>
          <p className={styles.tournamentContainer}>{tournament.tournamentName}</p>
          <div className={styles.tournamentRight}>
            <button className={styles.withdrawButton} onClick={() => handleEnteredDelete(tournament.tournamentId)}>Withdraw</button>
          </div>
        </div>)}
      <button className={styles.registerLink} onClick={handleSignupClick}>
        <p>Sign Up for a Tournament</p>
      </button>
      {signingUp &&
        <div className={styles.accessCodeInput}>
          <label className={styles.formLabel} for="accessCode">Access Code:</label>
          <input className={styles.textBoxAccess} type="text" id="accessCode" name="accessCode" onChange={handleAccessCodeInput} value={accessCode} />
          <button className={styles.inlineSubmitButton} type="button" onClick={handleSignupSubmit}>Submit</button>
        </div>
      }
    </Layout>
  );
}
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
  const { userId, isLoggedIn, setContext } = useAppContext()
  const [loading, setLoading] = useState(true)
  const [enteredLoading, setEnteredLoading] = useState(true)
  const [signingUp, setSigningUp] = useState(false)
  const [accessCode, setAccesCode] = useState('')

  useEffect(() => {
    if (!isLoggedIn) {
      const data = window.sessionStorage.getItem('MY_APP_STATE');
      if (!data) {
        router.push('/login')
      }
    }
  }, [])

  useEffect(() => {
    if (userId) {
      setLoading(true)
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
  }, [userId]);

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
  }, [userId])


  const handleRegisterClick = (e) => {
    e.preventDefault();
    router.push('/register');
  };

  const handleEnteredDelete = (tournamentId, competitorId) => {
    client
      .post("/tournament/delete_competitor/", {
        tournamentId: tournamentId,
        competitorId: competitorId
      }).then((res) => {
        const newTournaments = enteredTournaments.filter(tournament => tournament.competitorId != competitorId)
        setEnteredTournaments(newTournaments)
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
        window.sessionStorage.setItem('SIGNUP_APP_STATE', JSON.stringify({ tournamentId: data['tournamentId'] }))
        router.push('/tournamentsignup')
      })
  }

  const handleAddEntries = (id) => {
    window.sessionStorage.setItem('ADD_ENTRIES_APP_STATE', JSON.stringify({ competitorId: id }))
    router.push('/entries')
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
        <Tournament tournament={...tournament} tournaments={tournaments} setTournaments={setTournaments}></Tournament>
      )}
      <button className={styles.registerLink} onClick={handleRegisterClick}>
        <p>Register a New Tournament</p>
      </button>
      <hr></hr>
      <h3 className={styles.titleContainer}>Entered Tournaments</h3>
      {enteredLoading &&
        <p className={styles.tournamentLoading}>Loading...</p>}
      {enteredTournaments.map(tournament =>
        <div className={styles.tournament}>
          <p className={styles.enteredTournamentSchool}>{tournament.competitorSchool}</p>
          <p className={styles.enteredTournamentContainer}>{tournament.tournamentName}</p>
          <div className={styles.tournamentRight}>
            <button className={styles.addEntriesButton} onClick={() => handleAddEntries(tournament.competitorId)}>Add Entries</button>
            <button className={styles.withdrawButton} onClick={() => handleEnteredDelete(tournament.tournamentId, tournament.competitorId)}>Withdraw</button>
          </div>
        </div>)}
      <button className={styles.registerLink} onClick={handleSignupClick}>
        <p>Sign Up for a Tournament</p>
      </button>
      {signingUp &&
        <form className={styles.accessCodeInput}>
          <label className={styles.formLabel} for="accessCode">Access Code:</label>
          <input className={styles.textBoxAccess} type="text" id="accessCode" name="accessCode" onChange={handleAccessCodeInput} value={accessCode} />
          <button className={styles.inlineSubmitButton} type="submit" onClick={handleSignupSubmit}>Submit</button>
        </form>
      }
    </Layout>
  );
}

export function Tournament(props) {
  const [competitors, setCompetitors] = useState([])
  const [showSchools, setShowSchools] = useState(false)
  const [loading, setLoading] = useState(false)
  const [noCompetitors, setNoCompetitors] = useState(false)
  const router = useRouter()

  const getCompetitors = () => {
    setLoading(true)
    client
      .post("/tournament/get_competitors/", {
        tournamentId: props.tournament.tournamentId
      }).then((res) => {
        var data = JSON.parse(res.data)
        setCompetitors(data)
        setShowSchools(true)
        setLoading(false)
      }).catch((err) => {
        setLoading(false)
        setShowSchools(true)
        setNoCompetitors(true)
      })
  }

  const toggleShowSchools = () => {
    if (!showSchools) {
      getCompetitors()
    }
    else {
      setShowSchools(false)
      setNoCompetitors(false)
    }
  }

  const handleDelete = (e) => {
    e.preventDefault()
    client
      .post("/tournament/delete_tournament/", {
        tournamentId: props.tournament.tournamentId
      }).then((res) => {
        const newTournaments = props.tournaments.filter(t => t.tournamentId != props.tournament.tournamentId)
        props.setTournaments(newTournaments)
      })
  }

  const handleViewEvents = (id) => {
    window.sessionStorage.setItem('EVENTS_APP_STATE', JSON.stringify({ tournamentId: id }))
    router.push('/events')
  }

  return (
    <div className={styles.tournament}>
      <div className={styles.fullWidth}>
        <div className={styles.inlineSplit}>
          <p className={styles.tournamentContainer}>{props.tournament.tournamentName}</p>
          <div className={styles.tournamentRight}>
            <p className={styles.accessCode}>Code: {props.tournament.accessCode}</p>
            <button className={styles.deleteButton} onClick={handleDelete}>Delete</button>
          </div>
        </div>
        <div className={styles.inlineSplit}>
          <div>
            <p className={styles.schoolsEnteredTitle} onClick={toggleShowSchools}>{props.tournament.schoolsEntered} schools entered:</p>
            {loading && <p className={styles.schoolsEntered}>Loading...</p>}
            {noCompetitors && <p className={styles.schoolsEntered}>No schools found.</p>}
            {showSchools && competitors.map(competitor =>
              <p className={styles.schoolsEntered}>{competitor.competitorSchool} &#40;{competitor.numEntries} events&#41;</p>
            )}
          </div>
          <button className={styles.viewEvents} onClick={() => handleViewEvents(props.tournament.tournamentId)}>View Events</button>
        </div>
      </div>
    </div>
  )
}
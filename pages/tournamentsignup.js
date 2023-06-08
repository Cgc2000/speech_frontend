import Head from 'next/head';
import Layout from '../components/layout';
import styles from '../styles/utils.module.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAppContext } from '../components/context';
import { useRouter } from 'next/router';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://localhost:8000"
});

const TournamentSignup = () => {
  const [competitorSchool, setCompetitorSchool] = useState('')
  const [coachName, setCoachName] = useState('')
  const [coachEmail, setCoachEmail] = useState('')
  const [coachPhone, setCoachPhone] = useState('')
  const [tournament, setTournament] = useState()
  const { userId } = useAppContext()
  const router = useRouter();

  const handleCompetitorSchool = (e) => {
    setCompetitorSchool(e.target.value)
  }
  const handleCoachName = (e) => {
    setCoachName(e.target.value)
  }
  const handleCoachEmail = (e) => {
    setCoachEmail(e.target.value)
  }
  const handleCoachPhone = (e) => {
    setCoachPhone(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await client
      .post("/tournament/signup/", {
        registerUserId: userId,
        tournamentId: tournament.tournamentId,
        competitorSchool: competitorSchool,
        coachName: coachName,
        coachEmail: coachEmail,
        coachPhone: coachPhone,
      })
      .then((res) => {
        router.push('/tournaments')
      })
      .catch((err) => {
        alert("Error: make sure all fields are filled in and you are logged in and try again.")
      });
  }

  useEffect(() => {
    console.log(router.query)
    client
      .post("/tournament/get_by_id/", {
        tournamentId: router.query.tournamentId
      })
      .then((res) => {
        var data = JSON.parse(res.data)
        console.log(data)
        setTournament(data)
      })
      .catch((err) => {
        console.log('Oops!')
        alert("Tournament not found, try again.")
        router.push('/tournaments')
      })
  }, [])

  return (
    <Layout>
      <Head>
        <title>Register</title>
      </Head>
      <h1 className={styles.titleContainer}>{tournament ? tournament.tournamentName : ''} Sign Up</h1>
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="competitorSchool">Competitor School:</label>
          <input className={styles.textBox} type="text" id="competitorSchool" name="competitorSchool" onChange={handleCompetitorSchool} value={competitorSchool} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="coach">Team Coach &#40;your name&#41;:</label>
          <input className={styles.textBox} type="text" id="coach" name="coach" onChange={handleCoachName} value={coachName} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="coachEmail">Team Coach email address:</label>
          <input className={styles.textBox} type="text" id="coachEmail" name="coachEmail" onChange={handleCoachEmail} value={coachEmail} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="coachPhone">Team Coach phone number:</label>
          <input className={styles.textBox} type="text" id="coachPhone" name="coachPhone" onChange={handleCoachPhone} value={coachPhone} />
        </div>
        <button className={styles.submitButton} type="submit">Submit</button>
      </form>
    </Layout>
  );
}

export default TournamentSignup
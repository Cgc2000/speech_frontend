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

const Judges = () => {
  const [competitor, setCompetitor] = useState()
  const [tournament, setTournament] = useState()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [judges, setJudges] = useState([])
  const { isLoggedIn } = useAppContext()
  const [deletePending, setDeletePending] = useState(false)
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    client
      .post('/tournament/post_judge/', {
        competitorId: competitor.competitorId,
        schoolKey: competitor.schoolKey,
        tournamentId: competitor.tournamentId,
        name: name,
        email: email
      }).then((res) => {
        const data = JSON.parse(res.data)
        setJudges(oldJudges => [...oldJudges, data])
        setName("")
        setEmail("")
      })
  }

  const handleName = (e) => {
    e.preventDefault()
    setName(e.target.value)
  }

  const handleEmail = (e) => {
    e.preventDefault()
    setEmail(e.target.value)
  }

  const handleDelete = (judgeId, competitorId) => {
    setDeletePending(true)
    if (!deletePending) {
      console.log("Hi")
      client
        .post('/tournament/delete_judge/', {
          competitorId: competitorId,
          judgeId: judgeId
        }).then((res) => {
          console.log(res)
          const newJudges = judges.filter(judge => judge.judgeId != judgeId)
          setDeletePending(false)
          setJudges(newJudges)
        })
    }
  }


  useEffect(() => {
    if (!isLoggedIn) {
      const data = window.sessionStorage.getItem('MY_APP_STATE');
      if (!data) {
        router.push('/login')
      }
    }
  }, [])

  useEffect(() => {
    const stateData = JSON.parse(window.sessionStorage.getItem('ADD_ENTRIES_APP_STATE'))
    if (stateData) {
      client
        .post('/tournament/get_competitor_by_id/', {
          competitorId: stateData.competitorId
        }).then((res) => {
          const data = JSON.parse(res.data)
          setCompetitor(data)
          client
            .post('/tournament/get_by_id/', {
              tournamentId: data.tournamentId
            }).then((res) => {
              const data = JSON.parse(res.data)
              setTournament(data)
            })
        })
    } else {
      router.push("/tournaments")
    }
  }, [])

  useEffect(() => {
    const stateData = JSON.parse(window.sessionStorage.getItem('ADD_ENTRIES_APP_STATE'))
    if (stateData) {
      console.log(stateData.competitorId)
      client
        .post('/tournament/get_judges/', {
          competitorId: stateData.competitorId
        }).then((res) => {
          const data = JSON.parse(res.data)
          console.log(data)
          setJudges(data)
        }).catch((err) => {
        })
    }
  }, [])

  return (
    <Layout>
      <Head>
        <title>Judges</title>
      </Head>
      {tournament && <h1 className={styles.titleContainer}>Add Judges - {tournament.tournamentName}</h1>}
      {!tournament && <h1 className={styles.titleContainer}>Add Judges</h1>}
      <hr></hr>
      {competitor && <h2 className={styles.titleContainer}>{competitor.competitorSchool}</h2>}
      <form onSubmit={handleSubmit}>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="name">Judge name:</label>
          <input className={styles.textBox} type="text" id="name" name="name" onChange={handleName} value={name} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="email">Judge email:</label>
          <input className={styles.textBox} type="text" id="email" name="email" onChange={handleEmail} value={email} />
        </div>
        <button className={styles.submitButton} type="submit">Submit</button>
      </form>
      <hr></hr>
      {competitor && <h2 className={styles.titleContainer}>{competitor.competitorSchool} Judges</h2>}
      {judges.length == 0 &&
        <p className={styles.titleContainer}>No Judges Found</p>}
      {judges.length > 0 &&
        <table className={styles.entriesTable}>
          <tbody>
            <tr>
              <th className={styles.entriesHeader}>Judge Code</th>
              <th className={styles.entriesHeader}>Judge Name</th>
              <th className={styles.entriesHeader}>Options</th>
            </tr>
            {judges && judges.map((judge) =>
              <tr>
                <td className={styles.entriesRow}>{judge.schoolKey}{judge.judgeCode}</td>
                <td className={styles.entriesRow}>{judge.name}</td>
                <td className={styles.entriesRow}>
                  <button className={styles.deleteButtonEntries} onClick={() => handleDelete(judge.judgeId, judge.competitorId)}>Delete</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>}
    </Layout>
  );
}

export default Judges
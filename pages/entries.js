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

const Entries = () => {
  const [competitor, setCompetitor] = useState()
  const [tournament, setTournament] = useState()
  const [name, setName] = useState('')
  const [event, setEvent] = useState('')
  const [entries, setEntries] = useState([])
  const [entriesLoading, setEntriesLoading] = useState(true)
  const [tournamentLoading, setTournamentLoading] = useState(true)
  const { userId } = useAppContext()
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    client
      .post('/tournament/post_entry/', {
        tournamentId: competitor.tournamentId,
        competitorId: competitor.competitorId,
        schoolKey: competitor.schoolKey,
        name: name,
        event: event
      }).then((res) => {
        const data = res.data
        console.log(data)
        setEntries(oldEntries => [...oldEntries, data])
        console.log(entries)
      }
      )
  }

  const handleName = (e) => {
    setName(e.target.value)
  }

  const handleEvent = (e) => {
    setEvent(e.target.value)
  }

  useEffect(() => {
    if (!userId) {
      router.push('/login')
    }
  })

  useEffect(() => {
    if (router.query.competitorId) {
      client
        .post('/tournament/get_competitor_by_id/', {
          competitorId: router.query.competitorId
        }).then((res) => {
          const data = JSON.parse(res.data)
          setCompetitor(data)
          client
            .post('/tournament/get_by_id/', {
              tournamentId: data.tournamentId
            }).then((res) => {
              const data = JSON.parse(res.data)
              setTournament(data)
              setTournamentLoading(false)
              setEvent(data.events[0])
            })
        })
    }
  }, [])

  useEffect(() => {
    if (router.query.competitorId) {
      client
        .post('/tournament/get_entries/', {
          competitorId: router.query.competitorId
        }).then((res) => {
          const data = JSON.parse(res.data)
          console.log(data)
          setEntriesLoading(false)
          setEntries(data)
        }).catch((err) => {
          setEntriesLoading(false)
        })
    }
  }, [])

  return (
    <Layout>
      <Head>
        <title>Entries</title>
      </Head>
      <h1 className={styles.titleContainer}>Add Entries</h1>
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="name">Competitor name:</label>
          <input className={styles.textBox} type="text" id="name" name="name" onChange={handleName} value={name} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="event">Event Type:</label>
          <select className={styles.dropdown} name="event" id="event" onChange={handleEvent} value={event}>
            {tournamentLoading && <option value='loading'>Loading...</option>}
            {tournament && tournament.events.map((event) =>
              <option value={event}>{event}</option>
            )}
          </select>
        </div>
        <button className={styles.submitButton} type="submit">Submit</button>
      </form>
      <hr></hr>
      <table className={styles.entriesTable}>
        <tbody>
          <tr>
            <th className={styles.entriesHeader}>Competitor Code</th>
            <th className={styles.entriesHeader}>Competitor Name</th>
            <th className={styles.entriesHeader}>Event</th>
          </tr>
          {entriesLoading &&
            <tr>
              <td className={styles.entriesRow}>Loading...</td>
              <td className={styles.entriesRow}>Loading...</td>
              <td className={styles.entriesRow}>Loading...</td>
            </tr>
          }
          {entries && entries.map((entry) =>
            <tr>
              <td className={styles.entriesRow}>{entry.schoolKey}{entry.studentId}</td>
              <td className={styles.entriesRow}>{entry.name}</td>
              <td className={styles.entriesRow}>{entry.event}</td>
            </tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
}

export default Entries
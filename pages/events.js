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

const Events = () => {
  const [tournament, setTournament] = useState()
  const [eventEntries, setEventEntries] = useState([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const { isLoggedIn } = useAppContext()
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      const data = window.sessionStorage.getItem('MY_APP_STATE');
      if (!data) {
        router.push('/login')
      }
    }
  }, [])

  useEffect(() => {
    const stateData = JSON.parse(window.sessionStorage.getItem('EVENTS_APP_STATE'))
    if (stateData) {
      client
        .post('/tournament/get_by_id/', {
          tournamentId: stateData.tournamentId
        }).then((res) => {
          const data = JSON.parse(res.data)
          setTournament(data)
          client
            .post('/tournament/get_events/', {
              tournamentId: stateData.tournamentId,
              events: data.events
            }).then((res) => {
              const data = JSON.parse(res.data)
              setEventEntries(data)
              setEventsLoading(false)
              console.log(data)
            })
        })
    }
  }, [])

  return (
    <Layout>
      <Head>
        <title>Events</title>
      </Head>
      {tournament && <h1 className={styles.titleContainer}>Events - {tournament.tournamentName}</h1>}
      {!tournament && <h1 className={styles.titleContainer}>Events</h1>}
      <hr></hr>
      <h2 className={styles.titleContainer}>Event Entries</h2>
      {eventsLoading && <h3 className={styles.titleContainer}>Loading...</h3>}
      {eventEntries.map(eventEntry =>
        <div>
          <hr></hr>
          <h3 className={styles.titleContainer}>{eventEntry[0]}</h3>
          {eventEntry[1].length == 0 &&
            <p className={styles.titleContainer}>No Entries Found</p>}
          <table className={styles.entriesTable}>
            <tbody>
              {eventEntry[1].length > 0 &&
                <tr>
                  <th className={styles.entriesHeader}>Competitor Code</th>
                  <th className={styles.entriesHeader}>Competitor Name</th>
                  <th className={styles.entriesHeader}>Additional Competitors</th>
                </tr>}
              {eventEntry[1].map(entry =>
                <tr>
                  <td className={styles.entriesRow}>{entry.schoolKey}{entry.studentId}</td>
                  <td className={styles.entriesRow}>{entry.name}</td>
                  <td className={styles.entriesRow}>{entry.additionalNames.join(", ")}</td>
                </tr>)}
            </tbody>
          </table>
        </div>)}
    </Layout>
  );
}

export default Events
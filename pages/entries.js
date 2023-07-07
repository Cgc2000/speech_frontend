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
  const [additionalNames, setAdditionalNames] = useState('')
  const [event, setEvent] = useState('')
  const [entries, setEntries] = useState([])
  const [tournamentLoading, setTournamentLoading] = useState(true)
  const [deletePending, setDeletePending] = useState(false)
  const { isLoggedIn } = useAppContext()
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const additionalNamesArrayRaw = additionalNames.split(",")
    const additionalNamesArray = additionalNamesArrayRaw.map(names => names.trim())
    client
      .post('/tournament/post_entry/', {
        tournamentId: competitor.tournamentId,
        competitorId: competitor.competitorId,
        schoolKey: competitor.schoolKey,
        name: name,
        event: event,
        additionalNames: additionalNamesArray
      }).then((res) => {
        const data = JSON.parse(res.data)
        setEntries(oldEntries => [...oldEntries, data])
      }
      )
  }

  const handleName = (e) => {
    e.preventDefault()
    setName(e.target.value)
  }

  const handleAdditionalNames = (e) => {
    e.preventDefault()
    const namesArrayRaw = e.target.value.split(",")
    const namesArray = namesArrayRaw.map(names => names.trim())
    console.log(namesArray)
    setAdditionalNames(e.target.value)
  }

  const handleEvent = (e) => {
    e.preventDefault()
    setEvent(e.target.value)
  }

  const handleDelete = (entryId, competitorId) => {
    setDeletePending(true)
    if (!deletePending) {
      client
        .post('/tournament/delete_entry/', {
          competitorId: competitorId,
          entryId: entryId
        }).then((res) => {
          const newEntries = entries.filter(entry => entry.entryId != entryId)
          setDeletePending(false)
          setEntries(newEntries)
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
              setTournamentLoading(false)
              setEvent(data.events[0])
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
        .post('/tournament/get_entries/', {
          competitorId: stateData.competitorId
        }).then((res) => {
          const data = JSON.parse(res.data)
          console.log(data)
          setEntries(data)
        }).catch((err) => {
        })
    }
  }, [])

  return (
    <Layout>
      <Head>
        <title>Entries</title>
      </Head>
      {tournament && <h1 className={styles.titleContainer}>Add Entries - {tournament.tournamentName}</h1>}
      {!tournament && <h1 className={styles.titleContainer}>Add Entries</h1>}
      <hr></hr>
      {competitor && <h2 className={styles.titleContainer}>{competitor.competitorSchool}</h2>}
      <form onSubmit={handleSubmit}>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="name">Competitor name:</label>
          <input className={styles.textBox} type="text" id="name" name="name" onChange={handleName} value={name} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="additionalNames">&#40;optional&#41; Additional competitor name&#40;s&#41;:</label>
          <input className={styles.textBox} type="text" id="additionalNames" name="additionalNames" onChange={handleAdditionalNames} value={additionalNames} />
        </div>
        <p className={styles.descriptionUnderline}>Do not include the first competitor listed above's name.</p>
        <p className={styles.description}>For events with multiple students competing together such as Duo or debate.  Please write names separated by a comma, for example, George Washington,John Adams,Thomas Jefferson,....</p>
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
      {competitor && <h2 className={styles.titleContainer}>{competitor.competitorSchool} Entries</h2>}
      {entries.length == 0 &&
        <p className={styles.titleContainer}>No Entries Found</p>}
      {entries.length > 0 &&
        <table className={styles.entriesTable}>
          <tbody>
            <tr>
              <th className={styles.entriesHeader}>Competitor Code</th>
              <th className={styles.entriesHeader}>Competitor Name</th>
              <th className={styles.entriesHeader}>Additional Competitors</th>
              <th className={styles.entriesHeader}>Event</th>
              <th className={styles.entriesHeader}>Options</th>
            </tr>
            {entries && entries.map((entry) =>
              <tr>
                <td className={styles.entriesRow}>{entry.schoolKey}{entry.studentId}</td>
                <td className={styles.entriesRow}>{entry.name}</td>
                {entry.additionalNames && <td className={styles.entriesRow}>{entry.additionalNames.join(", ")}</td>}
                <td className={styles.entriesRow}>{entry.event}</td>
                <td className={styles.entriesRow}>
                  <button className={styles.deleteButtonEntries} onClick={() => handleDelete(entry.entryId, entry.competitorId)}>Delete</button>
                </td>
              </tr>
            )}
          </tbody>
        </table>}
    </Layout>
  );
}

export default Entries
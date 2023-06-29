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

const Register = () => {
  const [tournamentName, setTournamentName] = useState('')
  const [tournamentLevel, setTournamentLevel] = useState('elementary')
  const [hostSchool, setHostSchool] = useState('')
  const [managerName, setManagerName] = useState('')
  const [managerEmail, setManagerEmail] = useState('')
  const [managerPhone, setManagerPhone] = useState('')
  const [tournamentCity, setTournamentCity] = useState('')
  const [tournamentState, setTournamentState] = useState('AL')
  const [newEvent, setNewEvent] = useState('')
  const [newRoom, setNewRoom] = useState('')
  const [checkedEventList, setCheckedEventList] = useState([])
  const [rooms, setRooms] = useState([])
  const [checkAll, setCheckAll] = useState(false)
  const { userId, isLoggedIn } = useAppContext()
  const router = useRouter();
  const [eventList, setEventList] = useState([
    { value: "Prose" },
    { value: "Poetry" },
    { value: "Dramatic Interpretation (DI)" },
    { value: "Programmed Oral Interpretation (POI)" },
    { value: "Duo" },
    { value: "Informative" },
    { value: "Persuasive" },
    { value: "Communications Analysis (CA)" },
    { value: "After Dinner Speaking (ADS)" },
    { value: "Impromptu" },
    { value: "Extemporaneous" },
    { value: "International Public Debate Association (IPDA)" },
    { value: "Parliamentary Debate" }
  ])

  const handleTournamentName = (e) => {
    setTournamentName(e.target.value);
  };
  const handleTournamentLevel = (e) => {
    setTournamentLevel(e.target.value);
  };
  const handleHostSchool = (e) => {
    setHostSchool(e.target.value)
  }
  const handleManagerName = (e) => {
    setManagerName(e.target.value)
  }
  const handleManagerEmail = (e) => {
    setManagerEmail(e.target.value)
  }
  const handleManagerPhone = (e) => {
    setManagerPhone(e.target.value)
  }
  const handleTournamentCity = (e) => {
    setTournamentCity(e.target.value)
  }
  const handleTournamentState = (e) => {
    setTournamentState(e.target.value)
  }
  const handleNewEvent = (e) => {
    setNewEvent(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let is_valid = true
    await client
      .post("/tournament/register/", {
        registerUserId: userId,
        tournamentName: tournamentName,
        tournamentLevel: tournamentLevel,
        hostSchool: hostSchool,
        managerName: managerName,
        managerEmail: managerEmail,
        managerPhone: managerPhone,
        tournamentCity: tournamentCity,
        tournamentState: tournamentState,
        events: checkedEventList,
        rooms: rooms
      })
      .then((res) => {
        router.push('/tournaments')
      })
      .catch((err) => {
        alert("Error: make sure all fields are filled in and you are logged in and try again.")
        is_valid = false
      });
  }

  const handleSelect = (e) => {
    const value = e.target.value;
    const isChecked = e.target.checked;

    if (isChecked) {
      setCheckedEventList([...checkedEventList, value]);
      console.log([...checkedEventList, value])
    } else {
      const filteredList = checkedEventList.filter((item) => item !== value);
      console.log(filteredList)
      setCheckedEventList(filteredList);
      if (checkAll) {
        setCheckAll(false)
      }
    }
  };

  const handleSelectAll = e => {
    setCheckAll(!checkAll);
    setCheckedEventList(eventList.map(li => li.value));
    if (checkAll) {
      setCheckedEventList([]);
    }
  };

  const handleAddEvent = e => {
    setEventList([...eventList, { value: newEvent }]);
    setNewEvent('')
  }

  const handleNewRoom = e => {
    setNewRoom(e.target.value)
  }
  const handleAddRoom = e => {
    setRooms([...rooms, newRoom])
    setNewRoom('')
    console.log(rooms)
  }

  useEffect(() => {
    if (!isLoggedIn) {
      const data = window.sessionStorage.getItem('MY_APP_STATE');
      if (!data) {
        router.push('/login')
      }
    }
  }, [])

  return (
    <Layout>
      <Head>
        <title>Register</title>
      </Head>
      <h1 className={styles.titleContainer}>Register</h1>
      <hr></hr>
      <form onSubmit={handleSubmit}>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="tournamentName">Tournament name:</label>
          <input className={styles.textBox} type="text" id="tournamentName" name="tournamentName" onChange={handleTournamentName} value={tournamentName} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="tournamentLevel">Tournament level:</label>
          <select className={styles.dropdown} name="tournamentLevel" id="tournamentLevel" onChange={handleTournamentLevel} value={tournamentLevel}>
            <option value="elementary">Elementary School</option>
            <option value="middle">Middle School</option>
            <option value="high">High School</option>
            <option value="college">College</option>
          </select>
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="hostSchool">Host school:</label>
          <input className={styles.textBox} type="text" id="hostSchool" name="hostSchool" onChange={handleHostSchool} value={hostSchool} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="manager">Tournament Manager &#40;your name&#41;:</label>
          <input className={styles.textBox} type="text" id="manager" name="manager" onChange={handleManagerName} value={managerName} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="managerEmail">Manager email address:</label>
          <input className={styles.textBox} type="text" id="managerEmail" name="managerEmail" onChange={handleManagerEmail} value={managerEmail} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="managerPhone">Manager phone number:</label>
          <input className={styles.textBox} type="text" id="managerPhone" name="managerPhone" onChange={handleManagerPhone} value={managerPhone} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="tournamentCity">Tournament City:</label>
          <input className={styles.textBox} type="text" id="tournamentCity" name="tournamentCity" onChange={handleTournamentCity} value={tournamentCity} />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="tournamentState">Tournament State:</label>
          <select className={styles.dropdown} name="tournamentState" id="tournamentState" onChange={handleTournamentState} value={tournamentState}>
            <option value="AL">Alabama</option>
            <option value="AK">Alaska</option>
            <option value="AZ">Arizona</option>
            <option value="AR">Arkansas</option>
            <option value="CA">California</option>
            <option value="CO">Colorado</option>
            <option value="CT">Connecticut</option>
            <option value="DE">Delaware</option>
            <option value="DC">District Of Columbia</option>
            <option value="FL">Florida</option>
            <option value="GA">Georgia</option>
            <option value="HI">Hawaii</option>
            <option value="ID">Idaho</option>
            <option value="IL">Illinois</option>
            <option value="IN">Indiana</option>
            <option value="IA">Iowa</option>
            <option value="KS">Kansas</option>
            <option value="KY">Kentucky</option>
            <option value="LA">Louisiana</option>
            <option value="ME">Maine</option>
            <option value="MD">Maryland</option>
            <option value="MA">Massachusetts</option>
            <option value="MI">Michigan</option>
            <option value="MN">Minnesota</option>
            <option value="MS">Mississippi</option>
            <option value="MO">Missouri</option>
            <option value="MT">Montana</option>
            <option value="NE">Nebraska</option>
            <option value="NV">Nevada</option>
            <option value="NH">New Hampshire</option>
            <option value="NJ">New Jersey</option>
            <option value="NM">New Mexico</option>
            <option value="NY">New York</option>
            <option value="NC">North Carolina</option>
            <option value="ND">North Dakota</option>
            <option value="OH">Ohio</option>
            <option value="OK">Oklahoma</option>
            <option value="OR">Oregon</option>
            <option value="PA">Pennsylvania</option>
            <option value="RI">Rhode Island</option>
            <option value="SC">South Carolina</option>
            <option value="SD">South Dakota</option>
            <option value="TN">Tennessee</option>
            <option value="TX">Texas</option>
            <option value="UT">Utah</option>
            <option value="VT">Vermont</option>
            <option value="VA">Virginia</option>
            <option value="WA">Washington</option>
            <option value="WV">West Virginia</option>
            <option value="WI">Wisconsin</option>
            <option value="WY">Wyoming</option>
          </select>
        </div>
        <hr></hr>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="rooms">Rooms:</label>
          {rooms.length == 0 && <p className={styles.inlineMessageItalics}>No rooms added.</p>}
          {rooms.length > 0 && <p className={styles.inlineMessage}>{rooms.join(", ")}</p>}
        </div>
        <div className={styles.centerAddRooms}>
          <label className={styles.addEventsLabel} for="addRooms">Add rooms:</label>
          <input type="text" id="addRooms" name="addRooms" onChange={handleNewRoom} value={newRoom} />
          <button onClick={handleAddRoom} className={styles.inlineSubmitButton} type="button">Add</button>
        </div>
        <hr></hr>
        <div className={styles.inline}>
          <label className={styles.formLabelChecklist} for="eventsSelected">Events:</label>
          <p className={styles.selectAll} onClick={handleSelectAll}>Select all events</p>
        </div>
        {eventList.map((event) =>
          <div class={styles.center}>
            <input
              type="checkbox"
              name="languages"
              value={event.value}
              onChange={handleSelect}
              checked={checkedEventList.includes(event.value)}
            />
            <label className={styles.checkboxLabel} for="managerPhone">{event.value}</label>
          </div>)}
        <div class={styles.centerAddEvents}>
          <label className={styles.addEventsLabel} for="addEvents">Add events:</label>
          <input
            type="text"
            name="addEvents"
            value={newEvent}
            onChange={handleNewEvent}
            id="addEvents"
          />
          <button onClick={handleAddEvent} className={styles.inlineSubmitButton} type="button">Add</button>
        </div>
        <button className={styles.submitButton} type="submit">Submit</button>
      </form>
    </Layout >
  );
}

export default Register
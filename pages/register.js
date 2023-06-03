import Head from 'next/head';
import Layout from '../components/layout';
import styles from '../styles/utils.module.css';

export default function Register() {
  return (
    <Layout>
      <Head>
        <title>Register</title>
      </Head>
      <h1 className={styles.titleContainer}>Register</h1>
      <hr></hr>
      <form action="/api/form" method="post">
        <div className={styles.inline}>
          <label className={styles.formLabel} for="tournamentName">Tournament name:</label>
          <input className={styles.textBox} type="text" id="tournamentName" name="tournamentName" />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="tournamentLevel">Tournament level:</label>
          <select className={styles.dropdown} name="tournamentLevel" id="tournamentLevel">
            <option value="elementary">Elementary School</option>
            <option value="middle">Middle School</option>
            <option value="high">High School</option>
            <option value="college">College</option>
          </select>
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="hostSchool">Host school:</label>
          <input className={styles.textBox} type="text" id="hostSchool" name="hostSchool" />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="manager">Tournament Manager &#40;your name&#41;:</label>
          <input className={styles.textBox} type="text" id="manager" name="manager" />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="managerEmail">Manager email address:</label>
          <input className={styles.textBox} type="text" id="managerEmail" name="managerEmail" />
        </div>
        <div className={styles.inline}>
          <label className={styles.formLabel} for="managerPhone">Manager phone number:</label>
          <input className={styles.textBox} type="text" id="managerPhone" name="managerPhone" />
        </div>
        <button className={styles.submitButton} type="submit">Submit</button>
      </form>
    </Layout>
  );
}
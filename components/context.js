import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [userId, setUserId] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  async function login(client, email, password) {
    let is_valid = true
    await client
      .post("/auth/login/", {
        email: email,
        password: password
      })
      .then((res) => {
        var data = JSON.parse(res.data)
        setFirstName(data['firstName'])
        setLastName(data['lastName'])
        setEmail(data['email'])
        setUserId(data['id'])
        setIsLoggedIn(true)
        window.sessionStorage.setItem('MY_APP_STATE', JSON.stringify(data))
      })
      .catch((err) => {
        alert("Invalid email or password, try again with valid credentials.")
        is_valid = false
      });
    return is_valid

  }

  useEffect(() => {
    if (!isLoggedIn) {
      const data = window.sessionStorage.getItem('MY_APP_STATE');
      if (data) {
        setContext(data)
      }
    }
  }, [])

  function setContext(inputData) {
    const data = JSON.parse(inputData)
    setFirstName(data["firstName"])
    setLastName(data['lastName'])
    setEmail(data['email'])
    setUserId(data['id'])
    setIsLoggedIn(true)
  }

  let sharedState = {
    firstName,
    lastName,
    email,
    isLoggedIn,
    userId,
    login,
    setContext
  }

  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
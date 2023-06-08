import { createContext, useContext, useState } from 'react';

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
      })
      .catch((err) => {
        alert("Invalid email or password, try again with valid credentials.")
        is_valid = false
      });
    return is_valid

  }

  let sharedState = {
    firstName,
    lastName,
    email,
    isLoggedIn,
    userId,
    login
  }

  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);
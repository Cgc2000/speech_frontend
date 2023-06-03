import { createContext, useContext, useState } from 'react';
import { useRouter } from 'next/router';

const AppContext = createContext();

export function AppWrapper({ children }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [id, setId] = useState()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  async function login(client, email, password) {
    let is_valid = true
    await client
      .post("/api/login/", {
        email: email,
        password: password
      })
      .then((res) => {
        var data = JSON.parse(res.data)
        setFirstName(data['firstName'])
        setLastName(data['lastName'])
        setEmail(data['email'])
        setId(data['id'])
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
    login
  }

  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => useContext(AppContext);

function useLogin(client, email, password) {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useLogin must be used within an AppContext')
  }
  client
    .post("/api/login/", {
      email: email,
      password: password
    })
    .then((res) => {
      var val = res.data
      console.log(val)
    })
    .catch((err) => { });
}

export default useLogin
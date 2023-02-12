import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../../firebase';
import { api } from '../lib/api';

export interface AuthContextProps {
  signOutNow?: () => Promise<void>;
  signIn?: (email: string, password: string) => Promise<UserCredential>;
  createUser?: (email: string, password: string) => Promise<UserCredential>;
  reloadUser?: () => void;
  user?: UserProps;
}

interface UserProps {
  id: string;
  email: string;
  color: ColorsProps;
}

interface ColorsProps {
  id: string;
  color_1: string;
  color_2: string;
  color_3: string;
  color_4: string;
  color_5: string;
}

export const AuthContext = createContext<AuthContextProps>({});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    if (auth.currentUser) {
      getUser(auth.currentUser.email)
    }
  }, [auth.currentUser])

  async function signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function getUser(email: string | null) {
    api.get(`/users/${email}`).then(response => {
      setUser(response.data);
    })
  }

  async function signOutNow() {
    return signOut(auth).then(() => {
      setUser(null);
    })
  }

  async function createUser(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function reloadUser() {
    getUser(auth.currentUser!.email);
  }

  return (
    <AuthContext.Provider value={{
      signIn, 
      signOutNow,
      createUser,
      user,
      reloadUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}
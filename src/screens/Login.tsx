import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Subtitle from '../assets/Subtitle';
import Input from '../components/Input';
import { SaveButton } from '../components/SaveButton';

import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/Auth';
import { isValidEmail } from '../utils/stringUtils';
import { ScreenThemeContext } from '../contexts/ScreenTheme';
import clsx from 'clsx';

export default function Login() {

  const { navigate } = useNavigation<any>();
  const { signIn } = useContext(AuthContext);
  const { dark } = useContext(ScreenThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined)

  const [logging, setLogging] = useState(false);
  const [redirecting, setRedirecting] = useState(false); 
  const [error, setError] = useState<string | undefined>(undefined);

  function handleEmail(text: string) {
    if (!isValidEmail(text)) {
      setEmailError('Invalid e-mail');
    } else {
      setEmailError(undefined);
    }

    setEmail(text);
    setError(undefined)
  }

  function handlePassword(text: string) {
    setError(undefined);
    setPassword(text);
  }

  function doLogin() {
    setLogging(true);

    signIn?.(email, password).then(user => {
      setRedirecting(true);
      setTimeout(() => {
        navigate('home', { reload: true });
        setRedirecting(false);
      }, 2500)
    })
    .catch(err => {
      if (err.code === 'auth/user-not-found') {
        setError("User not found!")
      }

      if (err.code === 'auth/wrong-password') {
        setError("Incorrect password!")
      }
    })
    .finally(() => {
      setLogging(false)
    });
  }

  function goRegister() {
    navigate('register');
    setError(undefined);
    setEmail("");
    setPassword("");
  }

  return (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingBottom: 100,
      }}  
      className={clsx("flex-1 bg-slate-50 px-8 pt-16", {
        'bg-background': dark
      })}
    >
      <View className="w-full items-center justify-center mt-20">
        <Text className=
      {clsx("text-zinc-900 text-6xl font-semibold mb-6", {
          'text-white': dark
        })}>
          Step-by
        </Text>

        <Subtitle width={232} height={32}/>
      </View>

      {
        redirecting && (
          <View className="w-full items-center justify-center mt-6">
            <Text className="text-green-500 text-xs font-semibold">
              Success Login! Redirecting...
            </Text>
          </View>
        )
      }

      <View className="flex-1 w-full mt-12">
        <Text className={clsx("text-zinc-900 text-base font-semibold ml-1", {
          'text-white': dark
        })}>
          E-mail
        </Text>

        <Input 
          placeholder="Type your e-mail"
          setText={handleEmail}
          text={email}
        />

        {
          emailError && (
            <Text className="text-red-400 text font-semibold text-xs mt-2 ml-2">
              {emailError}
            </Text>
          )
        } 

        <Text className={clsx("text-zinc-900 text-base font-semibold ml-1 mt-6", {
          'text-white': dark
        })}>
          Password
        </Text>

        <Input 
          placeholder="Type your password"
          setText={handlePassword}
          text={password}
          secureTextEntry={true}
        />

        {
          error && (
            <View className="w-full items-center justify-center mt-6">
              <Text className="text-red-400 text-sm font-semibold">
                {error}
              </Text>
            </View>
          )
        }

        <View className="mt-6">
          <SaveButton 
            save={doLogin}
            saving={logging}
            isDisabled={!email || !password || !!emailError}
            text="Entrar"
            height={12}
          />
        </View>
      </View>

      <View className="w-full items-center justify-center mt-4">
        <Text className="text-zinc-400 font-semibold">
          Don't have an account?
        </Text>

        <TouchableOpacity onPress={goRegister}>          
          <Text className={clsx("text-zinc-900 mt-2 underline font-semibold", {
            'text-white': dark
          })}>
            Register
          </Text>   
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
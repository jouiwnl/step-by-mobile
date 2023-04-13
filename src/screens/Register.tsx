import { View, Text, ScrollView } from 'react-native';
import Subtitle from '../assets/Subtitle';
import Input from '../components/Input';
import { SaveButton } from '../components/SaveButton';

import { useContext, useState } from 'react';
import { BackButton } from '../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import { isValidEmail } from '../utils/stringUtils';
import { AuthContext } from '../contexts/Auth';
import { api } from '../lib/api';
import clsx from 'clsx';
import { ScreenThemeContext } from '../contexts/ScreenTheme';

export default function Register() {

  const { goBack } = useNavigation();
  const { createUser } = useContext(AuthContext);
  const { dark } = useContext(ScreenThemeContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isPasswordEquals, setIsPasswordEquals] = useState(true);
  const [emailError, setEmailError] = useState<string | undefined>(undefined);

  const [logging, setLogging] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  function handlePassword(text: string) {
    setIsPasswordEquals(text === confirmPassword);
    setPassword(text);
  }

  function handleConfirmationPassword(text: string) {
    setIsPasswordEquals(text === password);
    setConfirmPassword(text);
  }

  function handleEmail(text: string) {
    if (!isValidEmail(text)) {
      setEmailError('E-mail inválido!');
    } else {
      setEmailError(undefined);
    }

    setEmail(text);
  }

  function isRegistrable() {
    return email &&
     password &&
     confirmPassword &&
     isPasswordEquals &&
     !emailError
  }

  function createAccount() {
    setLogging(true);
    createUser?.(email, password).then(async () => {
      return api.post('/users', { email }).then(() => {
        setRedirecting(true);
        setTimeout(() => {
          goBack();
        }, 2500)
      })
    })
    .then(() => setLogging(false))
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
      <BackButton />

      <View className="w-full items-center justify-center mt-10">
        <Text className={clsx("text-zinc-900 text-6xl font-semibold mb-6", {
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
              Register success! Redirecting...
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
          keyboardType="email-address"
        />

        {
          emailError && (
            <Text className="text-red-400 font-semibold text-xs mt-2 ml-2">
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

        <Input 
          placeholder="Confirm your password"
          setText={handleConfirmationPassword}
          text={confirmPassword}
          secureTextEntry={true}
        />

        {
          !isPasswordEquals && (
            <Text className="text-red-400 font-semibold text-xs mt-2 ml-2">
              Passwords don't match!
            </Text>
          )
        }

        <View className="mt-6">
          <SaveButton 
            save={createAccount}
            saving={logging}
            isDisabled={!isRegistrable()}
            text="Register"
            height={12}
          />
        </View>
      </View>
    </ScrollView>
  )
}
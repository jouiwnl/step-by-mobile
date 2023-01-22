import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Subtitle from '../assets/Subtitle';
import Input from '../components/Input';
import { SaveButton } from '../components/SaveButton';

import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../contexts/Auth';
import { isValidEmail } from '../utils/stringUtils';

export default function Login() {

  const { navigate } = useNavigation<any>();
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined)

  const [logging, setLogging] = useState(false);
  const [redirecting, setRedirecting] = useState(false); 
  const [error, setError] = useState<string | undefined>(undefined);

  function handleEmail(text: string) {
    if (!isValidEmail(text)) {
      setEmailError('E-mail inválido');
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
        setError("Usuário não encontrado!")
      }

      if (err.code === 'auth/wrong-password') {
        setError("Senha incorreta!")
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
      className="flex-1 bg-background px-8 pt-16"
    >
      <View className="w-full items-center justify-center mt-20">
        <Text className="text-white text-6xl font-semibold mb-6">
          Step-by
        </Text>

        <Subtitle width={232} height={32}/>
      </View>

      {
        redirecting && (
          <View className="w-full items-center justify-center mt-6">
            <Text className="text-green-300 text-xs font-semibold">
              Logado com sucesso! Redirecionando...
            </Text>
          </View>
        )
      }

      <View className="flex-1 w-full mt-12">
        <Text className="text-white text-base font-semibold ml-1">
          E-mail
        </Text>

        <Input 
          placeholder="Digite seu e-mail"
          setText={handleEmail}
          text={email}
        />

        {
          emailError && (
            <Text className="text-red-400 font-semibold text-xs mt-2 ml-2">
              {emailError}
            </Text>
          )
        } 

        <Text className="text-white text-base font-semibold ml-1 mt-6">
          Senha
        </Text>

        <Input 
          placeholder="Digite sua senha"
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
          Não possui uma conta?
        </Text>

        <TouchableOpacity onPress={goRegister}>          
          <Text className="text-white mt-2 underline font-semibold">
            Cadastrar
          </Text>   
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}
import { useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import { useContext, useState } from "react";
import { ScrollView, Text, TextInput } from "react-native";
import colors from "tailwindcss/colors";
import { BackButton } from "../components/BackButton";
import { SaveButton } from "../components/SaveButton";
import { AuthContext } from "../contexts/Auth";
import { api } from "../lib/api";

interface ErrorAxios {
  statusCode: number;
  message: string;
}

export function NewYear() {

  const { navigate } = useNavigation<any>();

  const { user } = useContext(AuthContext);

  const [year, setYear] = useState<string>();
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<ErrorAxios>();

  function save() {
    setSaving(true);
    api.post('/years', { year_number: Number(year), user_id: user?.id })
    .then(() => {
      navigate('home', { reload: true })
    })
    .catch(err => {
      setError(err.response.data);
    })
    .finally(() => setSaving(false))
  }

  return (
    <ScrollView className='flex-1 bg-background px-8 pt-16'>
      <BackButton />

      <Text className="mt-6 text-white font-extrabold text-3xl">
        Novo ano
      </Text>

      <Text className="mt-6 text-white font-semibold text-base">
        Qual o ano?
      </Text>

      <TextInput 
        className={clsx("h-12 pl-4 rounded-lg mt-3 bg-zinc-80 text-white border-2 border-zinc-400 focus:border-blue-600", {
          'border-red-400': !!error
        })}
        placeholder='2023, 2022, 1990...'
        placeholderTextColor={colors.zinc[400]}
        onChangeText={text => {
          setError(undefined);
          setYear(text);
        }}
        keyboardType="number-pad"
        maxLength={4}
        value={year}
      />
      {
        error && (
          <Text className="text-red-400 text-xs mt-2 ml-2">
            {error.message}
          </Text>
        )
      }

      <SaveButton 
        save={save}
        saving={saving}
        isDisabled={!year}
      />

    </ScrollView>
  )
}
import { useEffect, useState, useRef } from 'react';
import { Text, ScrollView, TextInput, KeyboardAvoidingView, View } from 'react-native';
import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';
import colors from 'tailwindcss/colors';
import { api } from '../lib/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Loading } from '../components/Loading';
import { SaveButton } from '../components/SaveButton';

const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']

interface RouteParams {
  habit_id?: string; 
  reload?: () => void;
}

interface HabitResponse {
  id: string;
  title: string;
  weekDays: any[]
}

interface HabitRequest {
  title: string;
  weekDays: Number[];
  created_at?: string;
}

export function New() {
  const { goBack } = useNavigation();
  const { params } = useRoute();
  const { habit_id, reload } = params as RouteParams;

  const today = dayjs().startOf('day').tz('America/Sao_Paulo');

  const [weekDays, setWeekDays] = useState<Number[]>([]);
  const [title, setTitle] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false); 
  const [loading, setLoading] = useState<boolean>(false);

  function handleWeekDay(index: Number) {
    if (weekDays.includes(index)) {
      setWeekDays(state => state.filter(day => day !== index))
    } else {
      setWeekDays(state => [...state, index])
    } 
  }

  function loadHabit() {
    setLoading(true);

    api.get<HabitResponse>(`/habits/${habit_id}`).then(response => {
      setWeekDays(() => {
        return response.data.weekDays.map(weekDay => {
          return weekDay.week_day
        })
      })

      setTitle(response.data.title);
    })
    .finally(() => setLoading(false))
  }

  function save() {
    setSaving(true);

    const habit: HabitRequest = {
      title,
      weekDays,
      created_at: today.toISOString()
    }

    if (habit_id) {
      delete habit.created_at;

      api.put(`/habits/${habit_id}`, habit)
        .then(goBack)
        .finally(() => setSaving(false));

      return;
    }

    api.post('/habits', habit)
      .then(goBack)
      .finally(() => setSaving(false));
  }

  useEffect(() => {
    if (habit_id) {
      loadHabit();
    }
  }, [])

  return (
    <KeyboardAvoidingView behavior='padding' className="flex-1 bg-background px-8 pt-16">
      <View className="w-full items-center justify-start flex-row">
        {
          saving ? (
            <Loading align='flex-start'/>
          ) : (
            <BackButton />
          )
        }
      </View> 

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100
        }}
      >
        {
          loading ? (
            <Loading />
          ) : (
            <>
              <Text className="mt-6 text-white font-extrabold text-3xl">
                {habit_id ? 'Editar' : 'Criar'} hábito
              </Text>

              <Text className="mt-6 text-white font-semibold text-base">
                Qual seu comprometimento?
              </Text>

              <TextInput 
                className="h-12 pl-4 rounded-lg mt-3 bg-zinc-80 text-white border-2 border-zinc-400 focus:border-blue-600"
                placeholder='Exercícios, Dormir bem e etc...'
                placeholderTextColor={colors.zinc[400]}
                onChangeText={setTitle}
                value={title}
              />

              <Text className="font-semibold mt-4 mb-3 text-white text-base">
                Qual a recorrência?
              </Text>

              {dias.map((day, index) => {
                return (
                  <Checkbox 
                    key={index}
                    title={day}
                    checked={weekDays.includes(index)}
                    onPress={() => handleWeekDay(index)}
                    disabled={false}
                  />
                )
              })}

              <SaveButton 
                save={save}
                saving={saving}
                title={title}
              />
            </>
          )
        }
      </ScrollView>
    </KeyboardAvoidingView>
  )
} 
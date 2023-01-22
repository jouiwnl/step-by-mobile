import { useEffect, useState, useContext } from 'react';
import { Text, ScrollView, KeyboardAvoidingView, View, Platform } from 'react-native';
import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';
import { api } from '../lib/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import dayjs from 'dayjs';
import { Loading } from '../components/Loading';
import { SaveButton } from '../components/SaveButton';
import Input from '../components/Input';
import { AuthContext } from '../contexts/Auth';

const dias = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
const isAndroid = Platform.OS === 'android';

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
  user_id?: string;
}

export function New() {
  const { navigate } = useNavigation<any>();
  const { params } = useRoute();
  const { habit_id } = params as RouteParams;

  const today = dayjs().startOf('day').tz('America/Sao_Paulo');

  const { user } = useContext(AuthContext)

  const [weekDays, setWeekDays] = useState<Number[]>([]);
  const [title, setTitle] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false); 
  const [loading, setLoading] = useState<boolean>(false);

  const routeReload = { 
    reload: true, 
    year: today.get('year') 
  };

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
      created_at: today.toISOString(),
      user_id: user?.id
    }

    if (habit_id) {
      delete habit.created_at;

      api.put(`/habits/${habit_id}`, habit)
        .then(() => navigate('habits', routeReload))
        .finally(() => setSaving(false));

      return;
    }

    api.post('/habits', habit)
      .then(() => navigate('habits', routeReload))
      .finally(() => setSaving(false));
  }

  useEffect(() => {
    if (habit_id) {
      loadHabit();
    }
  }, [])

  return (
    <KeyboardAvoidingView behavior={isAndroid ? 'height' : 'padding'} className="flex-1 bg-background px-8 pt-16">
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

              <Input 
                placeholder='Exercícios, Dormir bem, etc...'
                setText={setTitle}
                text={title}
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
                isDisabled={!title}
              />
            </>
          )
        }
      </ScrollView>
    </KeyboardAvoidingView>
  )
} 
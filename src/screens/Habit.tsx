import { useNavigation, useRoute } from '@react-navigation/native';
import { Text, View, ScrollView } from 'react-native';
import { BackButton } from '../components/BackButton';
import { Progressbar } from '../components/Progressbar';
import { Checkbox } from '../components/Checkbox';
import { capitalizeFirstLetter } from '../utils/stringUtils';
import { useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { calculateProgress } from '../utils/mathUtils';
import { Loading } from '../components/Loading';
import { AuthContext } from '../contexts/Auth';
import moment from 'moment-timezone';
import { ScreenThemeContext } from '../contexts/ScreenTheme';
import clsx from 'clsx';

interface RouteParams {
  date: string;
  amount: number;
  completed: number;
}

interface HabitResponse {
  id: string;
  title: string;
  checked?: boolean;
}

interface DayResponse {
  id: string;
  date: string;
  possibleHabits: HabitResponse[];
  completedHabits: string[];
}

export function Habit() {
  const route = useRoute();
  const { setOptions } = useNavigation();
  const { date } = route.params as RouteParams;

  const parsedDate = moment(date).utcOffset(-3);

  const dayOfWeek = parsedDate.format('dddd');
  const dayAndMonth = parsedDate.format('DD/MM');

  const today = moment(new Date()).utcOffset(-3);
  const editable = today.isSame(parsedDate, 'D');

  const { user } = useContext(AuthContext);
  const { dark } = useContext(ScreenThemeContext);

  const [habits, setHabits] = useState<HabitResponse[]>([]); 
  const [progress, setProgress] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  console.log(progress)

  function toggleHabit(habit: HabitResponse) {
    setSaving(true);

    const newHabits = habits.map(habito => {
      if (habito.id === habit.id) {
        habito.checked = !habito.checked
      }

      return habito;
    })

    setHabits(newHabits);
    setProgress(calculateProgress(newHabits.length, newHabits.filter(habito => habito.checked).length))
    
    api.patch(`/habits/${habit.id}/toggle`, {
      date: parsedDate.toISOString(),
      user_id: user?.id
    }).finally(() => setSaving(false));
  }

  function fetchData(hideloading: boolean) {
    if (!hideloading) {
      setLoading(true);
    }

    api.get<DayResponse>(`/day?date=${parsedDate.toISOString()}&user_id=${user?.id}`).then(response => {
      const habits = response.data.possibleHabits;
      const completed = response.data.completedHabits ?? [];

      const finalHabits = habits.map(habito => {
        if (completed.includes(habito.id)) {
          habito.checked = true;
        }

        return habito;
      })
      
      setHabits(finalHabits);
      setProgress(calculateProgress(habits.length, completed.length));
    })
    .catch(err => console.log(err.response))
    .finally(() => {
     setLoading(false); 
    })
  }

  useEffect(() => {
    fetchData(false);
  }, [])

  useEffect(() => {
    setOptions({
      gestureEnabled: !saving
    })
  }, [saving])

  return (
    <View className={clsx("flex-1 bg-slate-50 px-8 pt-16", {
      'bg-background': dark
    })}>
      <View className="w-full items-center justify-start flex-row">
        {
          saving ? (
            <Loading align='flex-start'/>
          ) : (
            <BackButton />
          )
        }
      </View> 

      {
        loading ? (
          <Loading />
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            <Text className="mt-6 text-zinc-400 font-semibold text-base">
              {capitalizeFirstLetter(dayOfWeek)}
            </Text>

            <Text className={clsx("text-zinc-900 font-extrabold text-3xl", {
              'text-white': dark
            })}>
              {dayAndMonth}
            </Text>

            <Progressbar progress={progress ?? 0}/>

            <View className="mt-6">
              {habits.length ? (
                habits.map(habit => (
                  <Checkbox 
                    title={habit.title}
                    key={habit.id}
                    checked={habit.checked}
                    onPress={() => toggleHabit(habit)}
                    disabled={!editable}
                    dark={dark}
                  />
                ))
              ) : (
                <Text className={clsx("text-zinc-900 text-base font-extrabold", {
                  'text-white': dark
                })}>
                  Nenhum hábito por aqui!
                </Text>
              )}
            </View>
          </ScrollView>
        )
      }
    </View>
  )
} 
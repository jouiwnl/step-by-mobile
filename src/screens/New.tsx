import { useEffect, useState, useContext } from 'react';
import { Text, ScrollView, KeyboardAvoidingView, View, Platform } from 'react-native';
import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';
import { api } from '../lib/api';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Loading } from '../components/Loading';
import { SaveButton } from '../components/SaveButton';
import Input from '../components/Input';
import { AuthContext } from '../contexts/Auth';
import { week } from '../utils/dateUtils';
import DateTimePicker from '@react-native-community/datetimepicker';

import moment from 'moment-timezone';
import clsx from 'clsx';
import { ScreenThemeContext } from '../contexts/ScreenTheme';

const isAndroid = Platform.OS === 'android';

const HABIT_TYPES: { id: "SPECIFIC_DATE" | "WEEKLY" | undefined, description: string }[] = [
  {
    id: "SPECIFIC_DATE",
    description: "Specific Date" 
  },
  {
    id: "WEEKLY",
    description: "Weekly"
  }
]

interface RouteParams {
  habit_id?: string; 
  reload?: () => void;
}

interface HabitResponse {
  id: string;
  title: string;
  weekDays: any[];
  type: "SPECIFIC_DATE" | "WEEKLY" | undefined;
  habit_date: string;
}

interface HabitRequest {
  title: string;
  weekDays: Number[];
  created_at?: string;
  user_id?: string;
  type: "SPECIFIC_DATE" | "WEEKLY" | undefined;
  habit_date: string | undefined;
}

export function New() {
  const { navigate } = useNavigation<any>();
  const { params } = useRoute();
  const { habit_id } = params as RouteParams;

  const today = moment().format('YYYY-MM-DD');
  const year = moment().year();

  const { user } = useContext(AuthContext);
  const { dark } = useContext(ScreenThemeContext);

  const [weekDays, setWeekDays] = useState<Number[]>([]);
  const [title, setTitle] = useState<string>("");
  const [habitType, setHabitType] = useState<"WEEKLY" | "SPECIFIC_DATE" | undefined>();
  const [habitDate, setHabitDate] = useState<string>(today);
  const [saving, setSaving] = useState<boolean>(false); 
  const [loading, setLoading] = useState<boolean>(false);

  const routeReload = { 
    reload: true, 
    year: year
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
      setHabitType(response.data.type);
      setHabitDate(response.data.habit_date);
    })
    .finally(() => setLoading(false))
  }

  function save() {
    setSaving(true);

    const habit: HabitRequest = {
      title,
      weekDays,
      created_at: today + "T03:00:00.000z",
      user_id: user?.id,
      type: habitType,
      habit_date: habitType === 'WEEKLY' ? undefined : moment(habitDate).format('YYYY-MM-DD') + "T03:00:00.000z"
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
    <KeyboardAvoidingView behavior={isAndroid ? 'height' : 'padding'} className={clsx("flex-1 bg-slate-50 px-8 pt-16", {
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
              <Text className={clsx("mt-6 text-zinc-900 font-extrabold text-3xl", {
                'text-white': dark
              })}>
                {habit_id ? 'Edit' : 'Create'} habit
              </Text>

              <Text className={clsx("mt-6 text-zinc-900 font-semibold text-base", {
                'text-white': dark
              })}>
                What is your commitment?
              </Text>

              <Input 
                placeholder='Exercises, sleep well, and more...'
                setText={setTitle}
                text={title}
              />

              <View className="flex-row justify-between mt-6">
                {
                  HABIT_TYPES.map((type, index) => (
                    <Checkbox 
                      key={index}
                      title={type.description}
                      checked={type.id === habitType}
                      onPress={() => setHabitType(type.id)}
                      dark={dark}
                      disabled={false}
                    />
                  ))
                }
              </View>

              {
                habitType === 'SPECIFIC_DATE' ? (
                  <View>
                    <DateTimePicker 
                      value={new Date(habitDate)} 
                      onChange={(_, date) => { setHabitDate(moment(date).format('YYYY-MM-DD')) }}
                      mode='date'
                      display="spinner"
                      minimumDate={new Date()}
                      maximumDate={moment(new Date()).endOf('year').toDate()}
                      themeVariant={dark ? 'dark' : 'light'}
                    />
                  </View>
                ) : (
                  <>
                    <Text className={clsx("font-semibold mt-4 mb-3 text-zinc-900 text-base", {
                      'text-white': dark
                    })}>
                      What is the recurrence?
                    </Text>

                    {week.map((day, index) => {
                      return (
                        <Checkbox 
                          key={index}
                          title={day.description}
                          checked={weekDays.includes(index)}
                          onPress={() => handleWeekDay(index)}
                          dark={dark}
                          disabled={false}
                        />
                      )
                    })}
                  </>
                )
              }

              <SaveButton 
                save={save}
                saving={saving}
                isDisabled={!title || !habitType}
              />
            </>
          )
        }
      </ScrollView>
    </KeyboardAvoidingView>
  )
} 
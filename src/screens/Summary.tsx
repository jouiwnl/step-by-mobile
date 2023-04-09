import moment from 'moment-timezone';
import _ from 'lodash';
import clsx from 'clsx';

import { Text, View, ScrollView } from 'react-native';
import { JSXElementConstructor, useCallback, useContext } from 'react';

import { generateRangeDatesFromYearStart } from '../utils/dateUtils';

import { Header } from '../components/Header';
import { HabitDay, DAY_SIZE } from '../components/HabitDay';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useState, useMemo } from 'react';
import { api } from '../lib/api';
import { AuthContext } from '../contexts/Auth';
import { ScreenThemeContext } from '../contexts/ScreenTheme';
import { timezone } from '../lib/localization';
import { useFrameCallback } from 'react-native-reanimated';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface WeekDaysHabitsResponse {
  id: string;
  date: Date;
  completed?: number;
  amount?: number;
  date_parsed?: string;
}

interface SummaryRoute {
  year: number;
}

export function Summary() {
  const { navigate } = useNavigation<any>();
  const { params } = useRoute();
  const { year } = params as SummaryRoute;

  const { user, reloadUser } = useContext(AuthContext);
  const { dark } = useContext(ScreenThemeContext);

  const [weekDaysHabits, setWeekDaysHabits] = useState<WeekDaysHabitsResponse[]>([]);
  //const [datesFromYearStart, setDatesFromYearStart] = useState<{ month: string; days: any[] }[]>([]);

  const today = moment();

  const datesFromYearStart = useMemo(() => {
    const fromYearStart = generateRangeDatesFromYearStart(year);

    return Object.entries(_.groupBy(fromYearStart, c => c.month)).map(entry => {
      const key = entry[0];
      const values = entry[1];
      
      return {
        month: key,
        days: values.map(day => {
          return {
            id: day.id,
            date: day.date,
            day_of_week: day.day_of_week,
            month:  day.month,
            disabled: day.disabled,
            parsed_date: day.parsed_date,
            passed_or_today: moment(day.date).isAfter(today)
          }
        })
      }
    });
  }, [year]);

  function defineHabitdayParams(weekDay: WeekDaysHabitsResponse) {
    const amount = weekDay.amount ?? 0;
    const completed = weekDay.completed ?? 0;

    return { 
      date: moment(weekDay.date).toISOString(),
      amount,
      completed
    }
  }

  function fetchData() {
    reloadUser?.();

    api.get(`/summary?year=${year}&user_id=${user?.id}`).then(response => {
      setWeekDaysHabits(response.data);
      console.log(response.data);
    })
  }

  useFocusEffect(useCallback(() => {
    fetchData();
  }, []));

  return (
    <View className={clsx("flex-1 bg-slate-50 px-8 pt-16", {
      'bg-background': dark
    })}>
      <Header year={year} dark={dark} />

      <View className="flex-row mt-6 mb-2">
        {
          weekDays.map((weekDay, i) => (
            <Text 
              key={`${weekDay}-${i}`}
              className="text-zinc-400 text-xl font-bold text-center mx-1"
              style={{ width: DAY_SIZE }}
            >
              {weekDay}
            </Text>
          ))
        }
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className='flex-row flex-wrap'>
          {
            datesFromYearStart.map(month => {
                return (
                  <View key={month.month} className='w-full'>
                    <Text className={clsx("text-xl text-zinc-900 font-bold mt-2 mb-2", {
                      'text-white': dark
                    })}>
                      {month.month}
                    </Text>

                    <View className='flex-row flex-wrap'>
                      {
                        month.days.map(date => {
                          const dayHabit = weekDaysHabits.find(dia => dia.date_parsed === date.parsed_date)
                  
                          return (
                            <HabitDay 
                              key={String(Math.random())} 
                              amount={dayHabit?.amount ?? 0}
                              completed={dayHabit?.completed ?? 0}
                              date={date.date.toISOString()}
                              disabled={date.disabled || date.passed_or_today}
                              dark={dark}
                              onPress={() => navigate('habit', defineHabitdayParams(dayHabit ?? date))}
                            />
                          )
                        })
                      }
                    </View>
                  </View>
                );
              }
            )
          }
        </View>
      </ScrollView>

    </View>
  )
} 
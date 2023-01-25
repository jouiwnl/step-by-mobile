import { Text, View, ScrollView } from 'react-native';
import { useCallback, useContext } from 'react';

import { generateRangeDatesFromYearStart } from '../utils/dateUtils';

import { Header } from '../components/Header';
import { HabitDay, DAY_SIZE } from '../components/HabitDay';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { useState } from 'react';
import { api } from '../lib/api';
import { isBissexto } from '../utils/dateUtils';
import { AuthContext } from '../contexts/Auth';

import moment from 'moment-timezone';

import _ from 'lodash';

const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

interface WeekDaysHabitsResponse {
  id: string;
  date: Date;
  completed?: number;
  amount?: number;
}

interface SummaryRoute {
  year: number;
}

export function Summary() {
  const { navigate } = useNavigation<any>();
  const { params } = useRoute();
  const { year } = params as SummaryRoute;

  const { user } = useContext(AuthContext);

  const [weekDaysHabits, setWeekDaysHabits] = useState<WeekDaysHabitsResponse[]>([]);
  const [datesFromYearStart, setDatesFromYearStart] = useState<any[]>([]);
  const [amountOfDaysToFill, setAmountOfDaysToFill] = useState<number>(0);

  const minimunSummaryDatesSizes = isBissexto(year) ? 366 : 365;

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
    const fromYearStart = generateRangeDatesFromYearStart(year);

    setDatesFromYearStart(fromYearStart);
    setAmountOfDaysToFill(minimunSummaryDatesSizes - fromYearStart.length)

    api.get(`/summary?year=${year}&user_id=${user?.id}`).then(response => {
      setWeekDaysHabits(response.data);
    })
  }

  useFocusEffect(useCallback(() => {
    fetchData();
  }, []));

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <Header year={year} />

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
            datesFromYearStart.map(date => {
              const dayHabit = weekDaysHabits.find(dia => {
                const parsed = moment(dia.date).utcOffset(-3).format('YYYYMMDD');
                const dateParsed = moment(date.date).utcOffset(-3).format('YYYYMMDD');

                return parsed === dateParsed;
              })

              return (
                <HabitDay 
                  key={date.date} 
                  amount={dayHabit?.amount ?? 0}
                  completed={dayHabit?.completed ?? 0}
                  date={date.date}
                  disabled={date.disabled}
                  onPress={() => navigate('habit', defineHabitdayParams(dayHabit ?? date))}
                />
              )
            })
          }

          {
            amountOfDaysToFill > 0 && Array
            .from({ length: amountOfDaysToFill })
            .map((__, index) => {
              return (
                <View 
                  key={index}
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                />
              )
            })
          }
        </View>
      </ScrollView>

    </View>
  )
} 
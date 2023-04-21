import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ScreenThemeContext } from "../contexts/ScreenTheme";

import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { api } from "../lib/api";
import { DayResponse } from "./Habit";
import { timezone } from "../lib/localization";
import { AuthContext } from "../contexts/Auth";
import { AxiosError } from "axios";

import { Feather } from '@expo/vector-icons';
import { registerForPushNotification } from "../notification/notification";
import { Loading } from "../components/Loading";

import colors from "tailwindcss/colors";
import moment from "moment-timezone";
import clsx from "clsx";

interface YearResponse {
  id: string;
  year_number: number;
}

export function Home() {
  const [years, setYears] = useState<YearResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasCompletedToday, setHasCompletedToday] = useState(false);
  const [hasHabits, setHasHabits] = useState(false);

  const navigation = useNavigation<any>();
  const { navigate } = navigation;
  const { params }: any = useRoute();

  const currentYear = moment().year();

  const { dark, handleDarkMode } = useContext(ScreenThemeContext);
  const { user, signOutNow } = useContext(AuthContext);
  const today = moment().startOf('day').tz(timezone);

  function defineHabitdayParams() {
    return { 
      date: today.toISOString()
    }
  }

  function handleSignOut() {
    signOutNow?.().then(() => {
      navigate('login')
    })
  }

  async function fetchToday() {
    return api.get<DayResponse>(`/day?date=${today.toISOString()}&user_id=${user?.id}`).then(response => {
      const habits = response.data.possibleHabits;
      const completed = response.data.completedHabits ?? [];

      setHasCompletedToday(habits.length === completed.length);
      setHasHabits(!!habits.length);
    })
    .catch((err: AxiosError) => console.log(err.response));
  }

  async function fetchYears() {
    return api.get<YearResponse[]>(`/years?user_id=${user?.id}`).then(response => {
      const years = response.data;
      const hasCurrentYear = years.find(y => y.year_number === currentYear);

      if (!hasCurrentYear) {
        createYearIfNotExists();
      }

      setYears(response.data);
    })
    .then(() => {
      registerForPushNotification().then(token => {
        if (!token) {
          return;
        }

        api.get(`/token?token=${token}`).then(response => {
          const findedToken = response.data;

          if (!findedToken) {
            api.post('/token', { token: token, user_id: user?.id });
          }
        })
      })
    });
  }

  async function fetchData() {
    setLoading(true);

    const promises = [fetchToday(), fetchYears()];

    await Promise.all(promises).finally(() => setLoading(false))
  }

  function createYearIfNotExists() { 
    api.post('/years', { year_number: currentYear, user_id: user?.id })
      .then(fetchData)
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
    });
  }, [navigation]);

  useEffect(() => {
    if (user?.id) {
      fetchData();
    }
  }, [user?.id])

  useFocusEffect(useCallback(() => {
    if (user?.id) {
      fetchToday();
    }

    if (!params?.reload) {
      return;
    }

    params.reload = false;

    fetchData()
  }, [params?.reload, user?.id]))

  return (
    <View className={clsx("flex-1 bg-slate-50 px-8 pt-16", { 
      'bg-background': dark 
    })}>
      <View className="flex-row items-center justify-between">
        <Text className={clsx("text-zinc-900 text-3xl font-extrabold", {
          'text-white': dark 
        })}>
          Years
        </Text>

        <View className="flex-row items-center justify-between">
          <TouchableOpacity 
            className="flex-row h-11 px-4 items-center"
            onPress={() => navigate('customColor')}
          >
            <Image 
              className="w-7 h-7"
              source={require('../assets/color_picker.png')}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7}
            className="flex-row h-11 px-4 items-center" 
            onPress={handleDarkMode}
          >
            {
              dark ? (
                <Feather 
                  name="moon"
                  color={colors.zinc[100]}
                  size={24}
                />
              ) : (
                <Feather 
                  name="sun"
                  color={colors.zinc[900]}
                  size={24}
                />
              )
            }
          </TouchableOpacity>

          <TouchableOpacity 
            activeOpacity={0.7}
            className="flex-row h-11 px-4 items-center" 
            onPress={handleSignOut}
          >
            <Feather 
              name="log-out"
              color={colors.zinc[500]}
              size={20}
            />
          </TouchableOpacity>
        </View>
      </View>

      { hasHabits && (
        <View className="w-full mt-5 items-center">
          { hasCompletedToday ? (
            <Text className="text-green-400 font-semibold">
              ✓ You've completed all habits today!
            </Text>
          ) : (
            <TouchableOpacity 
              onPress={() => navigate('habit', defineHabitdayParams())}
            >
              <Text className="text-zinc-400 font-semibold">
                ⚠️ {`Complete your habits today ->`}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) }

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 20 }}
      >
        {
          loading ? (
            <Loading />
          ) : (
            <>
              {
                years.map(year => (
                  <TouchableOpacity 
                    className="flex-1 flex-row items-center justify-between py-3 mb-6"
                    onPress={() => navigate('summary', { year: year.year_number })}
                    key={year.id}
                  >
                    <Text className={clsx("text-zinc-900 font-bold text-xl", {
                      'text-white': dark
                    })}>
                      {year.year_number}
                    </Text>
      
                    <Feather 
                      name="arrow-right"
                      size={20}
                      color={colors.zinc[400]}
                    />
                  </TouchableOpacity>
                ))
              }
            </>
          )
        }
      </ScrollView>
    </View>
  )
}
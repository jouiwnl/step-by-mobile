import colors from "tailwindcss/colors";
import moment from 'moment';

import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { useState, useEffect, useContext, useCallback } from "react";
import { api } from "../lib/api";
import { Loading } from "../components/Loading";
import { AuthContext } from "../contexts/Auth";
import { registerForPushNotification } from "../notification/notification";
import { ScreenThemeContext } from "../contexts/ScreenTheme";
import clsx from "clsx";

interface YearResponse {
  id: string;
  year_number: number;
}

export function Home() {

  const navigation = useNavigation<any>();
  const { navigate } = navigation;
  const { params }: any = useRoute();

  const currentYear = moment().year();

  const { signOutNow, user } = useContext(AuthContext);
  const { dark, handleDarkMode } = useContext(ScreenThemeContext);

  const [years, setYears] = useState<YearResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  function fetchData() {
    setLoading(true);

    api.get(`/years?user_id=${user?.id}`).then(response => {
      setYears(response.data);
      setLoading(false);
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

  function createYearIfNotExists() {
    api.post('/years', { year_number: currentYear, user_id: user?.id })
    .catch(err => {
      //
    })
    .finally(fetchData)
  }

  function handleSignOut() {
    signOutNow?.().then(() => {
      navigate('login')
    })
  }

  useEffect(() => {
    navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
    });
  }, [navigation]);

  useEffect(() => {
    if (user?.id) {
      createYearIfNotExists();
    }
  }, [user])

  useFocusEffect(useCallback(() => {
    if (!params?.reload) {
      return;
    }

    params.reload = false;

    fetchData()
  }, [params?.reload]))

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100, paddingTop: 30 }}
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
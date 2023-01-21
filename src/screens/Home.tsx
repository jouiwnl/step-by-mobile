import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import { useFocusEffect, useIsFocused, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { api } from "../lib/api";
import { Loading } from "../components/Loading";
import dayjs from "dayjs";

interface YearResponse {
  id: string;
  year_number: number;
}

export function Home() {

  const { navigate } = useNavigation<any>();

  const currentYear = dayjs().startOf('year').get('year');

  const [years, setYears] = useState<YearResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  function fetchData() {
    setLoading(true);
    api.get('/years').then(response => {
      setYears(response.data);
    })
    .finally(() => setLoading(false));
  }

  function createYearIfNotExists() {
    api.post('/years', { year_number: currentYear })
    .catch(err => {
      //
    })
    .finally(fetchData)
  }

  useFocusEffect(useCallback(() => {
    createYearIfNotExists();
  }, []))

  return (
    <View className="flex-1 bg-background px-8 pt-16">

      <View className="flex-row items-center justify-between">
        <Text className="text-white text-3xl font-extrabold">
          Anos
        </Text>

        <TouchableOpacity 
					activeOpacity={0.7}
					className="flex-row h-11 px-4 border border-blue-500 rounded-lg items-center mr-2" 
					onPress={() => navigate('newyear')}
				>
					<Feather 
						name="plus"
						color={colors.blue[500]}
						size={20}
					/>

					<Text className="text-white ml-3 font-semibold text-base">
						Novo
					</Text>
				</TouchableOpacity>
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
                    className="flex-1 flex-row items-center justify-between border-b border-zinc-400 py-3 mb-6"
                    onPress={() => navigate('summary', { year: year.year_number })}
                    key={year.id}
                  >
                    <Text className="text-white font-bold text-xl">
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
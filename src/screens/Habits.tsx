import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { BackButton } from '../components/BackButton';
import { useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Loading } from '../components/Loading';
import { dayjs } from '../lib/dayjs';
import clsx from 'clsx';
import { week } from '../utils/dateUtils';
import { AuthContext } from '../contexts/Auth';

interface HabitResponse {
	id: string;
	title: string;
  weekdays: string;
}

interface HabitRoute {
	year?: number;
  reload?: boolean;
}

export function Habits() {
	const { navigate } = useNavigation<any>();
	const { params } = useRoute();
	const { year, reload } = params as HabitRoute;

	const currentYear = dayjs().startOf('year').tz('America/Sao_paulo', true).get('year');
	const isNotCurrentYear = currentYear !== year;

  const { user } = useContext(AuthContext);

	const [habits, setHabits] = useState<HabitResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	function fetchData() {
		setLoading(true);

		api.get<HabitResponse[]>(`/habits?year=${year}&user_id=${user?.id}`).then(response => {
			setHabits(response.data);
		})
    .finally(() => setLoading(false))
	}

	function handleDelete(habit: HabitResponse) {
		Alert.alert("Hábito", `Deseja parar de ${habit.title}?`, [
			{ text: 'Confirmar', onPress: () => doDelete(habit.id) },
			{ text: 'Cancelar', onPress: () => { } }
		])
	}

	function doDelete(id: string) {
    setLoading(true);
		api.delete(`/habits/${id}`)
			.then(fetchData)
	}

  useEffect(() => {
    fetchData();
  }, [])

	useEffect(() => {
    if (!reload) {
      return;
    }

    fetchData();
  }, [reload])

	return (
		<View className="flex-1 bg-background px-8 pt-16">

			<BackButton />

			<View className="flex-row items-center justify-between">
				<Text className="mt-6 text-white font-extrabold text-3xl">
					Hábitos
				</Text>

				<TouchableOpacity 
					activeOpacity={0.7}
					className={clsx("flex-row h-11 px-4 border border-blue-500 rounded-lg items-center mr-2 mt-6", {
						'opacity-30': isNotCurrentYear
					})} 
					onPress={() => navigate('new', {})}
					disabled={isNotCurrentYear}
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

			{
				loading ? (
					<Loading />
				) : (
					<>
						{
							habits.length ? (
								<ScrollView
									showsVerticalScrollIndicator={false}
									contentContainerStyle={{
										paddingBottom: 100,
										paddingTop: 30
									}}
								>
									{habits.map(habit => (
										<View key={habit.id} 
											className={clsx("w-full justify-between items-center flex-row py-4", {
												'opacity-30': isNotCurrentYear
											})}
										>
											<TouchableOpacity disabled={isNotCurrentYear} onPress={() => navigate('new', { habit_id: habit.id })} className="flex-1">
												<Text className="text-white font-semibold text-xl">
													{habit.title}
												</Text>

                        <View className="flex-row items-center flex-wrap">
                          {
                            week.filter(dia => habit.weekdays?.split(',').includes(String(dia.id)))
                              .map((dia, index, { length }) => (
                                <Text key={dia.id} className="text-white text-xs font-normal mt-2 opacity-70">
                                  {dia.description}{  index + 1 === length ? '.' : ', '}
                                </Text>
                              ))
                          }
                        </View>
											</TouchableOpacity>

											<TouchableOpacity onPress={() => handleDelete(habit)} className="px-4">
												<Feather
													name="trash"
													size={20}
													color={colors.zinc[400]}
												/>
											</TouchableOpacity>
										</View>
									))}
								</ScrollView>
							) : (
								<Text className="text-white mt-6 text-base font-bold">
									Nenhum hábito por aqui!
								</Text>
							)
						}
					</>
				)
			}
		</View>
	)
} 
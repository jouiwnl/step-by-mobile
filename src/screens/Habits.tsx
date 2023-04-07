import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { BackButton } from '../components/BackButton';
import { useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';

import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Loading } from '../components/Loading';
import clsx from 'clsx';
import { week } from '../utils/dateUtils';
import { AuthContext } from '../contexts/Auth';

import moment from 'moment-timezone';
import { ScreenThemeContext } from '../contexts/ScreenTheme';
import { defaultColors } from '../utils/themeUtils';

interface HabitResponse {
	id: string;
	title: string;
  weekdays: string;
  activation_date: Date;
  deactivation_date: Date;
  disabled: string;
}

interface HabitRoute {
	year?: number;
  reload?: boolean;
}

export function Habits() {
	const { navigate } = useNavigation<any>();
	const { params } = useRoute();
	const { year, reload } = params as HabitRoute;

  const today = moment();
	const currentYear = today.year();
	const isNotCurrentYear = currentYear !== year;

  const { user } = useContext(AuthContext);
  const { dark } = useContext(ScreenThemeContext);

	const [habits, setHabits] = useState<HabitResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	const newButtonBackgroundColor = !!user!.color ? `#${user!.color.color_3}` : defaultColors.blue500;

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

  function handleActive(habit: HabitResponse) {
		Alert.alert("Hábito", `Deseja continuar ${habit.title}?`, [
			{ text: 'Confirmar', onPress: () => doActive(habit.id) },
			{ text: 'Cancelar', onPress: () => { } }
		])
	}

	function doDelete(id: string) {
    setLoading(true);
    
		api.patch(`/habits/${id}/DEACTIVE`)
			.then(fetchData)
	}

  function doActive(id: string) {
    setLoading(true);
    
		api.patch(`/habits/${id}/ACTIVE`)
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
		<View className={clsx("flex-1 bg-slate-50 px-8 pt-16", {
      'bg-background': dark
    })}>

			<BackButton />

			<View className="flex-row items-center justify-between">
				<Text className={clsx("mt-6 text-zinc-900 font-extrabold text-3xl", {
          'text-white': dark
        })}>
					Habits
				</Text>

				<TouchableOpacity 
					activeOpacity={0.7}
					className={clsx("flex-row h-11 px-4 border rounded-lg items-center mr-2 mt-6", {
						'opacity-30': isNotCurrentYear
					})} 
					onPress={() => navigate('new', {})}
					disabled={isNotCurrentYear}
					style={{
						borderColor: newButtonBackgroundColor
					}}
				>
					<Feather 
						name="plus"
						color={newButtonBackgroundColor}
						size={20}
					/>

					<Text className={clsx("text-zinc-900 ml-3 font-semibold text-base", {
            'text-white': dark
          })}>
						New
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
												'opacity-30': isNotCurrentYear || habit.disabled === 'yes'
											})}
										>
											<TouchableOpacity disabled={isNotCurrentYear} onPress={() => {habit.disabled === 'yes' ? handleActive(habit) : navigate('new', { habit_id: habit.id })}} className="flex-1">
												<Text className={clsx("text-zinc-900 font-semibold text-xl", {
                          'text-white': dark
                        })}>
													{habit.title}
												</Text>

                        <View className="flex-row items-center flex-wrap">
                          {
                            week.filter(dia => habit.weekdays?.split(',').includes(String(dia.id)))
                              .map((dia, index, { length }) => (
                                <Text key={dia.id} className={clsx("text-zinc-900 text-xs font-normal mt-2 opacity-70", {
                                  'text-white': dark
                                })}>
                                  {dia.description}{  index + 1 === length ? '.' : ', '}
                                </Text>
                              ))
                          }
                        </View>
											</TouchableOpacity>

											<TouchableOpacity disabled={habit.disabled === 'yes'} onPress={() => handleDelete(habit)} className="px-4">
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
								<Text className={clsx("text-zinc-900 mt-6 text-base font-bold", {
                  'text-white': dark
                })}>
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
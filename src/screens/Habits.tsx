import { Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { BackButton } from '../components/BackButton';
import { useEffect, useState } from 'react';
import { api } from '../lib/api';

import { Feather } from '@expo/vector-icons'
import colors from 'tailwindcss/colors';
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Loading } from '../components/Loading';
import dayjs from 'dayjs';
import clsx from 'clsx';

interface HabitResponse {
	id: string;
	title: string;
}

interface HabitRoute {
	year?: number;
}

export function Habits() {
	const { navigate } = useNavigation<any>();
	const { params } = useRoute();
	const { year } = params as HabitRoute;

	const currentYear = dayjs().startOf('year').get('year');
	const isNotCurrentYear = currentYear !== year;

	const [habits, setHabits] = useState<HabitResponse[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	function fetchData() {
		setLoading(true);

		api.get(`/habits/by-year/${year}`).then(response => {
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
		api.delete(`/habits/${id}`)
			.then(fetchData)
	}

	useEffect(() => {
    fetchData();
  }, [])

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
											className={clsx("w-full justify-between items-center flex-row py-4 border-b border-zinc-400", {
												'opacity-30': isNotCurrentYear
											})}
										>
											<TouchableOpacity disabled={isNotCurrentYear} onPress={() => navigate('new', { habit_id: habit.id })} className="flex-1">
												<Text className="text-white font-semibold text-xl ml-3">
													{habit.title}
												</Text>
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
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Summary } from '../screens/Summary';
import { New } from '../screens/New';
import { Habit } from '../screens/Habit';
import { Habits } from '../screens/Habits';
import { Home } from '../screens/Home';
import { NewYear } from '../screens/NewYear';

import { enableScreens } from 'react-native-screens';

const { Screen, Navigator } = createNativeStackNavigator();

export function AppRoutes() {

  enableScreens();

	return (
		<Navigator
			screenOptions={{
				headerShown: false,
				freezeOnBlur: true
			}}
		>
			<Screen
				name='home'
				component={Home}
			/>

			<Screen
				name='summary'
				component={Summary}
			/>

			<Screen
				name='new'
				component={New}
			/>

			<Screen
				name='newyear'
				component={NewYear}
			/>

			<Screen
				name='habit'
				component={Habit}
			/>

			<Screen
				name='habits'
				component={Habits}
			/>
		</Navigator>
	)
}
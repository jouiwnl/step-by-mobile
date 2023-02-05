import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Summary } from '../screens/Summary';
import { New } from '../screens/New';
import { Habit } from '../screens/Habit';
import { Habits } from '../screens/Habits';
import { Home } from '../screens/Home';
import { NewYear } from '../screens/NewYear';

import Login from '../screens/Login';
import Register from '../screens/Register';
import { auth } from '../../firebase';
import CustomColor from '../screens/CustomColor';

const { Screen, Navigator } = createNativeStackNavigator();

export function AppRoutes() {
	return (
		<Navigator
			screenOptions={{
				headerShown: false,
				freezeOnBlur: true
			}}
      initialRouteName={auth.currentUser ? 'home' : 'login'}
		>
      <Screen
        name='login'
        component={Login}
      />

      <Screen
        name='register'
        component={Register}
      />

			<Screen
				name='home'
				component={Home}
        options={{
          gestureEnabled: false
        }}
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

			<Screen
				name='customColor'
				component={CustomColor}
			/>
		</Navigator>
	)
}
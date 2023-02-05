import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import clsx from "clsx";
import Animated, { RotateInDownLeft, RotateInDownRight } from "react-native-reanimated";
import { useContext } from "react";
import { AuthContext } from "../contexts/Auth";


interface props {
	checked?: boolean;
	title?: string;
	onPress?: () => void;
	disabled: boolean;
  dark?: boolean;
}

export function Checkbox({ checked = false, title, onPress, disabled, dark }: props) {

	const { user } = useContext(AuthContext);
	const backgroundColor = !!user!.color ? `#${user!.color.color_3}` : '#3b82f6';

	return (
		<TouchableOpacity
			activeOpacity={0.7}
			className="flex-row mb-2 items-center"
			onPress={onPress}
			disabled={disabled}
		>
			{checked ? (
				<Animated.View 
          className={`h-8 w-8 rounded-lg items-center justify-center`}
          entering={RotateInDownLeft}
          exiting={RotateInDownLeft}
					style={{
						backgroundColor
					}}
        >
					<Feather
						name="check"
						size={20}
						color={colors.white}
					/>
				</Animated.View>
			) : (
				<View className={clsx("w-8 h-8 bg-zinc-300 rounded-lg", {
					'bg-zinc-500': disabled,
          'bg-zinc-900': dark
				})} />
			)}

			<Text className={clsx("text-zinc-900 font-semibold text-base ml-3", {
        'text-white': dark
      })}>
				{title}
			</Text>
		</TouchableOpacity>
	)
}
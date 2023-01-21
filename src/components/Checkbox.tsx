import { Text, TouchableOpacity, View } from "react-native";
import { Feather } from '@expo/vector-icons'
import colors from "tailwindcss/colors";
import clsx from "clsx";
import Animated, { RotateInDownLeft, RotateInDownRight } from "react-native-reanimated";


interface props {
	checked?: boolean;
	title?: string;
	onPress?: () => void;
	disabled: boolean;
}

export function Checkbox({ checked = false, title, onPress, disabled }: props) {
	return (
		<TouchableOpacity
			activeOpacity={0.7}
			className="flex-row mb-2 items-center"
			onPress={onPress}
			disabled={disabled}
		>
			{checked ? (
				<Animated.View 
          className="h-8 w-8 bg-blue-500 rounded-lg items-center justify-center"
          entering={RotateInDownLeft}
          exiting={RotateInDownLeft}
        >
					<Feather
						name="check"
						size={20}
						color={colors.white}
					/>
				</Animated.View>
			) : (
				<View className={clsx("w-8 h-8 bg-zinc-900 rounded-lg", {
					'bg-zinc-500': disabled
				})} />
			)}

			<Text className="text-white font-semibold text-base ml-3">
				{title}
			</Text>
		</TouchableOpacity>
	)
}
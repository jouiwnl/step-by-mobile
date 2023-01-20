import { View } from "react-native";

interface props {
	progress?: number;
}

export function Progressbar({ progress = 0 }: props) {
	return (
		<View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
			<View
				className="h-3 rounded-xl bg-blue-600"
				style={{
					width: `${progress}%`
				}}
			/>
		</View>
	)
}
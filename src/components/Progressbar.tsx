import { useContext, useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { AuthContext } from "../contexts/Auth";

interface props {
	progress?: number;
}

export function Progressbar({ progress = 0 }: props) {
  const sharedProgress = useSharedValue(progress);
  const { user } = useContext(AuthContext);
  const backgroundColor = !!user!.color ? `#${user!.color.color_3}` : '#3b82f6';

  const style = useAnimatedStyle(() => {
    return {
      width: `${sharedProgress.value}%`,
      backgroundColor
    }
  });

  useEffect(() => {
    sharedProgress.value = withTiming(progress);
  }, [progress])

	return (
		<View className="w-full h-3 rounded-xl bg-zinc-700 mt-4">
			<Animated.View
				className="h-3 rounded-xl"
				style={style}
			/>
		</View>
	)
}
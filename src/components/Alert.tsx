import { View, Text } from "react-native";

interface props {
  title: string;
  description: string;
}

export default function Alert(props: props) {
  return (
    <View className="border-2 border-yellow-600 bg-yellow-500 rounded-md p-3">
      <Text className="text-zinc-900 text-base font-bold mb-2">
        {props.title}
      </Text>

      <Text className="text-zinc-700 text-xs font-semibold">
        {props.description}
      </Text>
    </View>
  )
}
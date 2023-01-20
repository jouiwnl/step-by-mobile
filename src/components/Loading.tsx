import { ActivityIndicator, FlexAlignType, View, ViewStyle } from "react-native";

interface LoadingProps {
  align?: FlexAlignType;
}

export function Loading({ align }: LoadingProps) {

  const style: ViewStyle = {
    justifyContent: 'center',
    flex: 1,
    alignItems: align ?? 'center',
  }

  return (
    <View style={style}>
      <ActivityIndicator size={32} color="#fff"/>
    </View>
  )
}
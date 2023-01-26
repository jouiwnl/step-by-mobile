import { useContext } from "react";
import { ActivityIndicator, FlexAlignType, View, ViewStyle } from "react-native";
import { ScreenThemeContext } from "../contexts/ScreenTheme";

interface LoadingProps {
  align?: FlexAlignType;
}

export function Loading({ align }: LoadingProps) {

  const { dark } = useContext(ScreenThemeContext);

  const style: ViewStyle = {
    justifyContent: 'center',
    flex: 1,
    alignItems: align ?? 'center',
  }

  return (
    <View style={style}>
      <ActivityIndicator size={32} color={dark ? '#fff' : '#000'}/>
    </View>
  )
}
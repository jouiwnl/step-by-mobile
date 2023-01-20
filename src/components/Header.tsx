import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import { Logo } from '../assets/Logo';
import { useNavigation } from "@react-navigation/native";

interface HeaderProps {
  year?: number;
}

export function Header(props: HeaderProps) {

  const { navigate } = useNavigation();

  return (
    <View className="w-full flex-row items-center justify-between">
      <Logo />
      
      <View className="flex-row items-center">
        <TouchableOpacity 
          activeOpacity={0.7}
          className="flex-row h-11 px-4 border border-zinc-500 rounded-lg items-center"  
          onPress={() => navigate('habits', { year: props.year })}
        >
          <Feather 
            name="menu"
            color={colors.zinc[500]}
            size={20}
          />

          <Text className="text-white text-base font-semibold ml-3">
            Hábitos
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
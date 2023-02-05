import { View, TouchableOpacity, Text } from "react-native";
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import { Subtitle } from '../assets/Subtitle';
import { useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import { useContext } from "react";
import { AuthContext } from "../contexts/Auth";

interface HeaderProps {
  year?: number;
  dark?: boolean;
}

export function Header(props: HeaderProps) {

  const { navigate } = useNavigation<any>();
  const { user } = useContext(AuthContext);

  return (
    <View className="w-full flex-row items-center justify-between">
      <View className={clsx("w-2", { 'flex-1': !!user!.color })}>
        {!!user!.color ? (
          <Text className={clsx("text-zinc-900 text-base font-semibold ml-3", {
            'text-white': props.dark
          })}>
            Custom color
          </Text>
        ) : (
          <Subtitle />
        )}
      </View>

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

          <Text className={clsx("text-zinc-900 text-base font-semibold ml-3", {
            'text-white': props.dark
          })}>
            Habits
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
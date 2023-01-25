import clsx from "clsx";
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import colors from "tailwindcss/colors";
import { Loading } from "./Loading";
import { Feather } from '@expo/vector-icons';

interface SaveButtonProps {
  save: () => void;
  saving: boolean;
  isDisabled: boolean;
  text?: string;
  height?: number;
}

export function SaveButton({ isDisabled, save, saving, text, height }: SaveButtonProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      className={clsx(`mt-6 w-full h-14 flex-row items-center justify-center bg-blue-600 rounded-md ${height && `h-${height}`}`, {
        'opacity-30': isDisabled
      })}
      disabled={isDisabled}
      onPress={save}
    >
      {
        saving ? (
          <Loading />
        ) : (
          <>
            <Feather 
              name="check"
              size={20}
              color={colors.white}
            />

            <Text className="font-semibold text-base text-white ml-2">
              {text ?? 'Confirm'}
            </Text>
          </>
        )
      }
    </TouchableOpacity>
  )
}
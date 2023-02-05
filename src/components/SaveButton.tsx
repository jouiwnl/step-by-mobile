import clsx from "clsx";
import React, { useContext } from "react";
import { Text, TouchableOpacity } from "react-native";
import colors from "tailwindcss/colors";
import { Loading } from "./Loading";
import { Feather } from '@expo/vector-icons';
import { AuthContext } from "../contexts/Auth";

interface SaveButtonProps {
  save: () => void;
  saving: boolean;
  isDisabled: boolean;
  text?: string;
  height?: number;
}

export function SaveButton({ isDisabled, save, saving, text, height }: SaveButtonProps) {
  const { user } = useContext(AuthContext);

	function defineBackgroudColor() {
		return !!user?.color ? `#${user!.color.color_3}` : '#3b82f6'
	}

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      className={clsx(`mt-6 w-full h-14 flex-row items-center justify-center rounded-md ${height && `h-${height}`}`, {
        'opacity-30': isDisabled
      })}
      disabled={isDisabled}
      onPress={save}
      style={{
        backgroundColor: defineBackgroudColor()
      }}
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
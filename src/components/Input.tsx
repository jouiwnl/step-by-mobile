import clsx from "clsx";
import { useContext } from "react";
import { TextInput, TextInputProps } from "react-native";
import colors from "tailwindcss/colors";
import { ScreenThemeContext } from "../contexts/ScreenTheme";

interface InputProps extends TextInputProps {
  text: string;
  setText: (text: string) => void;
  placeholder: string;
}

export default function Input({ setText, text, placeholder, ...rest }: InputProps) {

  const { dark } = useContext(ScreenThemeContext);

  return (
    <TextInput 
      className={clsx("h-12 pl-4 rounded-lg mt-3 bg-slate-100 text-zinc-900 border-2 border-zinc-400 focus:border-blue-600", {
        'bg-zinc-900 text-white': dark
      })}
      placeholder={placeholder}
      placeholderTextColor={colors.zinc[400]}
      onChangeText={setText}
      value={text}
      {...rest}
    />
  )
}
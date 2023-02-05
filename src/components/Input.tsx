import clsx from "clsx";
import { useContext, useState } from "react";
import { TextInput, TextInputProps } from "react-native";
import colors from "tailwindcss/colors";
import { AuthContext } from "../contexts/Auth";
import { ScreenThemeContext } from "../contexts/ScreenTheme";
import { defaultColors } from "../utils/themeUtils";

interface InputProps extends TextInputProps {
  text: string;
  setText: (text: string) => void;
  placeholder: string;
}

export default function Input({ setText, text, placeholder, ...rest }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const { dark } = useContext(ScreenThemeContext);
  const { user } = useContext(AuthContext);

  const borderColor = !!user?.color ? `#${user!.color.color_3}` : defaultColors.blue500;

  return (
    <TextInput 
      className={clsx("h-12 pl-4 rounded-lg mt-3 bg-slate-100 text-zinc-900 border-2", {
        'bg-zinc-900 text-white': dark
      })}
      placeholder={placeholder}
      placeholderTextColor={colors.zinc[400]}
      onChangeText={setText}
      value={text}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        borderColor: isFocused ? borderColor : defaultColors.zinc400
      }}
      {...rest}
    />
  )
}
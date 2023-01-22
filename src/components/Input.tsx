import { TextInput, TextInputProps } from "react-native";
import colors from "tailwindcss/colors";

interface InputProps extends TextInputProps {
  text: string;
  setText: (text: string) => void;
  placeholder: string;
}

export default function Input({ setText, text, placeholder, ...rest }: InputProps) {
  return (
    <TextInput 
      className="h-12 pl-4 rounded-lg mt-3 bg-zinc-80 text-white border-2 border-zinc-400 focus:border-blue-600"
      placeholder={placeholder}
      placeholderTextColor={colors.zinc[400]}
      onChangeText={setText}
      value={text}
      {...rest}
    />
  )
}
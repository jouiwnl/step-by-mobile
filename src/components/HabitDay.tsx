import { Dimensions, TouchableOpacity } from "react-native";
import clsx from 'clsx';
import { dayjs } from "../lib/dayjs";

const WEEK_DAYS = 7;
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5;

export const DAY_MARGIN_BETWEEN = 8;
export const DAY_SIZE = (Dimensions.get('screen').width / WEEK_DAYS) - (SCREEN_HORIZONTAL_PADDING + 5);

interface props {
  onPress?: () => void;
  amount: number;
  completed: number;
  date: string;
  disabled: boolean;
}

export function HabitDay(props: props) {

  const progress = Math.round((props.completed/props.amount) * 100);
  const today = dayjs().startOf('day').tz('America/Sao_Paulo', true)
  const isCurrentDay = dayjs(props.date).isSame(today);

  return (
    <TouchableOpacity 
      className={clsx("bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800", {
        'bg-blue-300 border-blue-400': progress > 0 && progress <= 20,
        'bg-blue-400 border-blue-500': progress > 20 && progress <= 40,
        'bg-blue-500 border-blue-600': progress > 40 && progress <= 60,
        'bg-blue-600 border-blue-700': progress > 60 && progress <= 80,
        'bg-blue-700 border-blue-800': progress >= 80,
        'border-white border-4': isCurrentDay,
        'opacity-30': props.disabled
      })}
      disabled={props.disabled}
      style={{ width: DAY_SIZE, height: DAY_SIZE }}
      activeOpacity={0.7}
      onPress={props.onPress}
    />
  )
}
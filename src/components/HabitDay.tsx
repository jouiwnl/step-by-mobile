import { Dimensions, TouchableOpacity, StyleSheet } from "react-native";
import clsx from 'clsx';
import moment from 'moment';
import { useContext } from "react";
import { AuthContext } from "../contexts/Auth";
import { defaultColors } from "../utils/themeUtils";

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
  dark?: boolean;
}

export function HabitDay(props: props) {

  const { user } = useContext(AuthContext);

  const progress = Math.round((props.completed/props.amount) * 100);
  const today = moment().startOf('D');
  const isCurrentDay = moment(props.date).startOf('D').isSame(today);

  const haveCustomColors = !!user!.color;

  const color_1 = haveCustomColors ? `#${user!.color.color_1}` : defaultColors.blue100;
  const color_2 = haveCustomColors ? `#${user!.color.color_2}` : defaultColors.blue300;
  const color_3 = haveCustomColors ? `#${user!.color.color_3}` : defaultColors.blue500;
  const color_4 = haveCustomColors ? `#${user!.color.color_4}` : defaultColors.blue600;
  const color_5 = haveCustomColors ? `#${user!.color.color_5}` : defaultColors.blue900;

  function defineStyles() {

    let habitDay = {
      width: DAY_SIZE, 
      height: DAY_SIZE,
      borderRadius: 8,
      margin: 4,
      borderWidth: 0,
      borderColor: 'rgba(161, 161, 165, 0)',
      backgroundColor: defaultColors.zinc900,
      opacity: 1
    }
    
    if (isCurrentDay) {
      habitDay.borderWidth = 4;
      habitDay.borderColor = defaultColors.zinc400;
    }

    if (progress > 0 && progress <= 20) {
      habitDay.backgroundColor = color_1;
    }

    if (progress > 20 && progress <= 40) {
      habitDay.backgroundColor = color_2;
    }

    if (progress > 40 && progress <= 60) {
      habitDay.backgroundColor = color_3;
    }

    if (progress > 60 && progress <= 80) {
      habitDay.backgroundColor = color_4;
    }

    if (progress >= 80) {
      habitDay.backgroundColor = color_5;
    }

    if (!props.completed && !props.dark) {
      habitDay.opacity = 0.4;
    }

    if (props.disabled) {
      habitDay.opacity = 0.3;
    }

    return StyleSheet.create({
      habitDay
    }).habitDay;
  }

  return (
    <TouchableOpacity 
      className="bg-zinc-900"
      disabled={props.disabled}
      style={defineStyles()}
      activeOpacity={0.7}
      onPress={props.onPress}
    />
  )
}
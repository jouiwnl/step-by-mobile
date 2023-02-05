import { useNavigation } from "@react-navigation/native";
import clsx from "clsx";
import { useContext, useState } from "react";
import { ScrollView, View, Text, KeyboardAvoidingView } from "react-native";
import Alert from "../components/Alert";
import { BackButton } from "../components/BackButton";
import Input from "../components/Input";
import { SaveButton } from "../components/SaveButton";
import { AuthContext } from "../contexts/Auth";
import { ScreenThemeContext } from "../contexts/ScreenTheme";
import { api } from "../lib/api";

interface BodyRequest {
  id?: string;
  color_1: string;
  color_2: string;
  color_3: string;
  color_4: string;
  color_5: string;
  user_id?: string;
}

export default function CustomColor() {

  const { goBack } = useNavigation();

  const { dark } = useContext(ScreenThemeContext);
  const { user } = useContext(AuthContext);

  const [color1, setColor1] = useState(user!.color.color_1 ?? "");
  const [color2, setColor2] = useState(user!.color.color_2 ?? "");
  const [color3, setColor3] = useState(user!.color.color_3 ?? "");
  const [color4, setColor4] = useState(user!.color.color_4 ?? "");
  const [color5, setColor5] = useState(user!.color.color_5 ?? "");
  const [saving, setSaving] = useState(false);

  function handleColor(text: string, colorNumber: number) {
    switch (colorNumber) {
      case 1:
        setColor1(text)
        break;
      case 2:
        setColor2(text)
        break;
      case 3:
        setColor3(text)
        break;
      case 4:
        setColor4(text)
        break;
      case 5:
        setColor5(text)
        break;
    }
  }

  function handleSave() {
    setSaving(true);

    let body: BodyRequest = {
      color_1: color1,
      color_2: color2,
      color_3: color3,
      color_4: color4,
      color_5: color5,
      user_id: user!.id
    }

    if (user!.color.id) {
      body.id = user!.color.id;

      api.put(`/colors/${body.id}`, body).then(() => {
        setSaving(false);
        goBack();
      })

      return;
    }

    delete body.id;

    api.post('/colors', body).then(() => {
      setSaving(false);
      goBack();
    })
  }

  return (
    <KeyboardAvoidingView behavior="padding" className={clsx("flex-1 bg-slate-50 px-8 pt-16", {
      'bg-background': dark
    })}>

      <BackButton />

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100
        }}
      >
        <Text className={clsx("mt-6 text-zinc-900 font-extrabold text-3xl mb-4", {
          'text-white': dark
        })}>
          Custom colors
        </Text>

        <Alert 
          title="Warning ⚠" 
          description="Colors must be in hexadecimal pattern without '#'!" 
        />

        {ColorInput(color1, handleColor, 1, dark)}

        {ColorInput(color2, handleColor, 2, dark)}

        {ColorInput(color3, handleColor, 3, dark)}

        {ColorInput(color4, handleColor, 4, dark)}

        {ColorInput(color5, handleColor, 5, dark)}
      
        <SaveButton 
          save={handleSave}
          saving={saving}
          isDisabled={false}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export function ColorInput(text: string, handleColor: any, colorNumber: number, dark?: boolean) {
  return (
    <View className="flex-1 flex-row justify-between items-center">
      <View className="flex-1">
        <Text className={clsx("text-zinc-900 text-base font-semibold ml-1 mt-4", {
          'text-white': dark
        })}>
          Color {colorNumber}
        </Text>

        <Input 
          placeholder="000123"
          setText={text => handleColor(text, colorNumber)}
          text={text}
          maxLength={6}
        />
      </View>
      <View style={{
        width: 40,
        height: 40,
        backgroundColor: `#${text}`,
        marginTop: 55,
        marginLeft: 16
      }} />
    </View>
  )
}
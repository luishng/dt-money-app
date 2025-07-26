import { Text, TouchableOpacity, View } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"

import { PublicStackParamsList } from "@/routes/PublicRoutes"
import { TextInput } from "react-native-gesture-handler"
import { DismissKeyboardView } from "@/components/DismissKeyboardView"
import { LoginForm } from "./LoginForm"

export const Login = () => {
  const navigation = useNavigation<StackNavigationProp<PublicStackParamsList>>()

  return (
    <DismissKeyboardView>
      <View className="flex-1 w-[82%] self-center">
        <LoginForm />
      </View>
    </DismissKeyboardView>
  )
}
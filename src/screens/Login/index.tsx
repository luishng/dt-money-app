import { Text, TouchableOpacity, View } from "react-native"

import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"

import { PublicStackParamsList } from "@/routes/PublicRoutes"
import { TextInput } from "react-native-gesture-handler"
import { DismissKeyboardView } from "@/components/DismissKeyboardView"

export const Login = () => {
  const navigation = useNavigation<StackNavigationProp<PublicStackParamsList>>()

  return (
    <DismissKeyboardView>
      <Text>Tela de login</Text>
      <TextInput className="bg-gray-500 w-full" />
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text>Registrar</Text>
      </TouchableOpacity>
    </DismissKeyboardView>
  )
}
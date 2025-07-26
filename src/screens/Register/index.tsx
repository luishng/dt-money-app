import { DismissKeyboardView } from "@/components/DismissKeyboardView";
import { RegisterForm } from "./RegisterForm";
import { View } from "react-native";
import { AuthHeader } from "@/components/AuthHeader";

export const Register = () => {
  return (
    <DismissKeyboardView>
      <View className="flex-1 w-[82%] self-center">
        <AuthHeader />
        <RegisterForm />
      </View>
    </DismissKeyboardView>
  );
};

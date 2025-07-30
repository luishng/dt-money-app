import { useAuth } from "@/context/auth.context";
import { Text, View, TouchableOpacity } from "react-native";

export const Home = () => {
  const { handleLogout } = useAuth();

  return (
    <View className="flex-1 items-center justify-center">
      <Text>Home Screen</Text>
      <TouchableOpacity onPress={handleLogout}>
        <Text>Sair</Text>
      </TouchableOpacity>
    </View>
  );
};

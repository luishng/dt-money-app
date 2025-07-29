import { useAuth } from "@/context/auth.context";
import { colors } from "@/shared/colors";
import { FC, useEffect } from "react";
import { ActivityIndicator, Image, SafeAreaView } from "react-native";

interface Props {
  setLoading: (value: boolean) => void;
}

export const Loading: FC<Props> = ({ setLoading }) => {
  const { restoreUserSession, handleLogout } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const user = await restoreUserSession();

        if (!user) {
          await handleLogout();
        }
      } catch (error) {
        await handleLogout();
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <SafeAreaView className="flex-1 bg-background-primary items-center justify-center">
      <>
        <Image
          className="h-[48px] w-[255px]"
          source={require("@/assets/Logo.png")}
        />
        <ActivityIndicator color={colors.white} className="mt-20" />
      </>
    </SafeAreaView>
  );
};

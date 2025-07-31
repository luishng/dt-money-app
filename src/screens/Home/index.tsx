import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/context/auth.context";
import { useTransaction } from "@/context/transaction.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useEffect } from "react";
import { FlatList, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListHeader } from "./ListHeader";

export const Home = () => {
  const { handleLogout } = useAuth();
  const { fetchCategories, fetchTransactions } = useTransaction();
  const { handleError } = useErrorHandler();

  const handleFetchCategories = async () => {
    try {
      await fetchCategories();
    } catch (error) {
      handleError(error, "Falha ao buscar as categorias");
    }
  };

  useEffect(() => {
    (async () => {
      await handleFetchCategories();
      await fetchTransactions();
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-secondary">
      <FlatList
        data={[]}
        ListHeaderComponent={ListHeader}
        renderItem={() => <></>}
      />
    </SafeAreaView>
  );
};

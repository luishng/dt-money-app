import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/context/auth.context";
import { useTransaction } from "@/context/transaction.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useEffect } from "react";
import { FlatList, RefreshControl, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ListHeader } from "./ListHeader";
import { TransactionCard } from "./TransactionCard";

export const Home = () => {
  const { handleLogout } = useAuth();
  const {
    fetchCategories,
    fetchTransactions,
    transactions,
    refreshTransactions,
    loading,
    loadMoreTrasactions,
  } = useTransaction();
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
      await Promise.all([
        handleFetchCategories(),
        fetchTransactions({ page: 1 }),
      ]);
    })();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background-primary">
      <FlatList
        className="bg-background-secondary"
        keyExtractor={({ id }) => `transaction-${id}`}
        data={transactions}
        ListHeaderComponent={ListHeader}
        renderItem={({ item }) => <TransactionCard transaction={item} />}
        onEndReached={loadMoreTrasactions}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={refreshTransactions}
          />
        }
      />
    </SafeAreaView>
  );
};

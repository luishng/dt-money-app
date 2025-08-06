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
    loadMoreTrasactions,
    handleLoadings,
    loadings,
  } = useTransaction();
  const { handleError } = useErrorHandler();

  const handleFetchCategories = async () => {
    try {
      handleLoadings({
        key: "initial",
        value: true,
      });
      await fetchCategories();
    } catch (error) {
      handleError(error, "Falha ao buscar as categorias");
    } finally {
      handleLoadings({
        key: "initial",
        value: false,
      });
    }
  };

  const handleFetchInitialTransactions = async () => {
    try {
      handleLoadings({
        key: "initial",
        value: true,
      });
      await fetchTransactions({ page: 1 });
    } catch (error) {
      handleError(error, "Falha ao buscar transações");
    } finally {
      handleLoadings({
        key: "initial",
        value: false,
      });
    }
  };

  const handleLoadMoreTransactions = async () => {
    try {
      handleLoadings({
        key: "loadMore",
        value: true,
      });
      await loadMoreTrasactions();
    } catch (error) {
      handleError(error, "Falha ao carregar novas transações");
    } finally {
      handleLoadings({
        key: "loadMore",
        value: false,
      });
    }
  };

  const handleRefreshTransactions = async () => {
    try {
      handleLoadings({
        key: "refresh",
        value: true,
      });
      await refreshTransactions();
    } catch (error) {
      handleError(error, "Falha ao recarregar as transações");
    } finally {
      handleLoadings({
        key: "refresh",
        value: false,
      });
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([
        handleFetchCategories(),
        handleFetchInitialTransactions(),
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
        onEndReached={handleLoadMoreTransactions}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={loadings.refresh}
            onRefresh={handleRefreshTransactions}
          />
        }
      />
    </SafeAreaView>
  );
};

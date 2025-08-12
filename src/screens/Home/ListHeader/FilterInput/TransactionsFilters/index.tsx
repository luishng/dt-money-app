import { Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/shared/colors";
import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { DateFilter } from "./DateFilter";
import { CategoryFilter } from "./CategoryFilter";
import { TypeFilter } from "./TypeFilter";
import { AppButton } from "@/components/AppButton";
import { useTransaction } from "@/context/transaction.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";

export const TransactionsFilters = () => {
  const { closeBottomSheet } = useBottomSheetContext();
  const { fetchTransactions, handleLoadings, resetFilters } = useTransaction();
  const { handleError } = useErrorHandler();

  const handleFetchTransactions = async () => {
    try {
      handleLoadings({ key: "refresh", value: true });
      await fetchTransactions({ page: 1 });
    } catch (error) {
      handleError(error, "Falha ao aplicar filtros");
    } finally {
      handleLoadings({ key: "refresh", value: false });
      closeBottomSheet();
    }
  };

  const handleResetFilters = async () => {
    try {
      handleLoadings({ key: "refresh", value: true });
      await resetFilters();
    } catch (error) {
      handleError(error, "Falha ao limpar filtros");
    } finally {
      handleLoadings({ key: "refresh", value: false });
      closeBottomSheet();
    }
  };

  return (
    <View className="flex-1 bg-gray[1000] p-6">
      <View className="flex-row justify-between">
        <Text className="text-white font-bold mb-5 text-xl">
          Filtrar Transações
        </Text>
        <TouchableOpacity onPress={closeBottomSheet}>
          <MaterialIcons name="close" size={20} color={colors.gray[600]} />
        </TouchableOpacity>
      </View>

      <DateFilter />
      <CategoryFilter />
      <TypeFilter />

      <View className="flex-row gap-4 mt-8">
        <AppButton
          onPress={handleResetFilters}
          className="flex-1"
          widthFull={false}
          mode="outline"
        >
          Limpar Filtros
        </AppButton>
        <AppButton
          onPress={handleFetchTransactions}
          className="flex-1"
          widthFull={false}
        >
          Filtrar
        </AppButton>
      </View>
    </View>
  );
};

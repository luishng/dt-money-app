import { FC, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/shared/colors";
import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { TextInput } from "react-native-gesture-handler";
import CurrencyInput from "react-native-currency-input";
import * as Yup from "yup";
import { useTransaction } from "@/context/transaction.context";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { ErrorMessage } from "@/components/ErrorMessage";
import { SelectCategoryModal } from "@/components/SelectCategoryModal";
import { TransactionTypeSelector } from "@/components/SelectType";
import { AppButton } from "@/components/AppButton";
import { transactionSchema } from "./schema";
import { Transaction } from "@/shared/interfaces/transaction";
import { UpdateTransactionInterface } from "@/shared/interfaces/https/update-transaction-request";
import { updateTransaction } from "@/shared/services/dt-money/transaction.service";

type ValidationErrosTypes = Record<keyof UpdateTransactionInterface, string>;

interface Params {
  transaction: Transaction;
}

export const EditTransactionForm: FC<Params> = ({
  transaction: transactionToUpdate,
}) => {
  const { closeBottomSheet } = useBottomSheetContext();
  const { updateTransaction } = useTransaction();
  const { handleError } = useErrorHandler();

  const [transaction, setTransaction] = useState<UpdateTransactionInterface>({
    categoryId: transactionToUpdate.categoryId,
    id: transactionToUpdate.id,
    description: transactionToUpdate.description,
    typeId: transactionToUpdate.typeId,
    value: transactionToUpdate.value,
  });
  const [validationErros, setValidationErros] =
    useState<ValidationErrosTypes>();
  const [loading, setLoading] = useState(false);

  const handleUpdateTransaction = async () => {
    try {
      setLoading(true);
      await transactionSchema.validate(transaction, {
        abortEarly: false,
      });

      await updateTransaction(transaction);
      closeBottomSheet();
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        const errors = {} as ValidationErrosTypes;

        error.inner.forEach((err) => {
          if (err.path) {
            errors[err.path as keyof UpdateTransactionInterface] = err.message;
          }
        });

        setValidationErros(errors);
      } else {
        handleError(error, "Falha ao atualizar transação");
      }
    } finally {
      setLoading(false);
    }
  };

  const setTransactionData = (
    key: keyof UpdateTransactionInterface,
    value: string | number
  ) => {
    setTransaction((prevData) => ({ ...prevData, [key]: value }));
  };

  return (
    <View className="px-8 py-5">
      <TouchableOpacity
        onPress={closeBottomSheet}
        className="w-full flex-row items-center justify-between"
      >
        <Text className="text-white text-xl font-bold">Editar Transação</Text>
        <MaterialIcons name="close" color={colors.gray[700]} size={20} />
      </TouchableOpacity>

      <View className="flex-1 mt-8 mb-8">
        <TextInput
          placeholder="Descrição"
          placeholderTextColor={colors.gray[700]}
          value={transaction.description}
          onChangeText={(text) => setTransactionData("description", text)}
          className="text-white text-lg h-[50px] bg-background-primary my-2 rounded-[6] pl-4"
        />
        {validationErros?.description && (
          <ErrorMessage>{validationErros.description}</ErrorMessage>
        )}
        <CurrencyInput
          className="text-white text-lg h-[50px] bg-background-primary my-2 rounded-[6] pl-4"
          value={transaction.value}
          prefix="R$ "
          delimiter="."
          separator=","
          precision={2}
          minValue={0}
          onChangeValue={(value) => setTransactionData("value", value ?? 0)}
        />
        {validationErros?.value && (
          <ErrorMessage>{validationErros.value}</ErrorMessage>
        )}

        <SelectCategoryModal
          selectedCategory={transaction.categoryId}
          onSelect={(categoryId) =>
            setTransactionData("categoryId", categoryId)
          }
        />

        {validationErros?.categoryId && (
          <ErrorMessage>{validationErros.categoryId}</ErrorMessage>
        )}
        <TransactionTypeSelector
          typeId={transaction.typeId}
          setTransactionType={(typeId) => setTransactionData("typeId", typeId)}
        />

        {validationErros?.typeId && (
          <ErrorMessage>{validationErros.typeId}</ErrorMessage>
        )}

        <View className="my-4">
          <AppButton disabled={loading} onPress={handleUpdateTransaction}>
            {loading ? <ActivityIndicator color={colors.white} /> : "Atualizar"}
          </AppButton>
        </View>
      </View>
    </View>
  );
};

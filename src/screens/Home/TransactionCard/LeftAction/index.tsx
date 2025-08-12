import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/shared/colors";
import { FC, useState } from "react";
import * as transactionService from "@/shared/services/dt-money/transaction.service";
import { useErrorHandler } from "@/shared/hooks/useErrorHandler";
import { useSnackbarContext } from "@/context/snackbar.context";
import { Transaction } from "@/shared/interfaces/transaction";
import { useBottomSheetContext } from "@/context/bottomsheet.context";
import { EditTransactionForm } from "./EditTransactionForm";

interface Params {
  transaction: Transaction;
}

export const LeftAction: FC<Params> = ({ transaction }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const { handleError } = useErrorHandler();
  const { notify } = useSnackbarContext();
  const { openBottomSheet } = useBottomSheetContext();

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.8}
        className="h-[140] bg-accent-blue-dark w-[80] rounded-l-[6] items-center justify-center"
        onPress={() =>
          openBottomSheet(<EditTransactionForm transaction={transaction} />, 0)
        }
      >
        <MaterialIcons name="edit" color={colors.white} size={30} />
      </TouchableOpacity>
    </>
  );
};

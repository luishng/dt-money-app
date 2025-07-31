import { TransactionCategory } from "@/shared/interfaces/https/transaction-category";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import * as transactionService from "@/shared/services/dt-money/transaction.service";

export type TransactionContextType = {
  fetchCategories: () => Promise<void>;
  categories: TransactionCategory[];
};

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const fetchCategories = async () => {
    const categoriesResponse =
      await transactionService.getTransactionCategories();

    setCategories(categoriesResponse);
  };

  return (
    <TransactionContext.Provider value={{ fetchCategories, categories }}>
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  return useContext(TransactionContext);
};

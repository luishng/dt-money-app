import { TransactionCategory } from "@/shared/interfaces/https/transaction-category";
import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import * as transactionService from "@/shared/services/dt-money/transaction.service";
import { CreateTrasactionInterface } from "@/shared/interfaces/https/create-transaction-request";
import { Transaction } from "@/shared/interfaces/transaction";
import { TotalTransactions } from "@/shared/interfaces/total-transactions";
import { UpdateTransactionInterface } from "@/shared/interfaces/https/update-transaction-request";

export type TransactionContextType = {
  fetchCategories: () => Promise<void>;
  createTransaction: (transaction: CreateTrasactionInterface) => Promise<void>;
  updateTransaction: (transaction: UpdateTransactionInterface) => Promise<void>;
  categories: TransactionCategory[];
  fetchTransactions: () => Promise<void>;
  totalTransactions: TotalTransactions;
  transactions: Transaction[];
  refreshTransactions: () => Promise<void>;
  loading: boolean;
};

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<TotalTransactions>(
    {
      expense: 0,
      revenue: 0,
      total: 0,
    }
  );

  const refreshTransactions = async () => {
    setLoading(true);
    const transactionResponse = await transactionService.getTrasactions({
      page: 1,
      perPage: 10,
    });

    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const categoriesResponse =
      await transactionService.getTransactionCategories();

    setCategories(categoriesResponse);
  };

  const createTransaction = async (transaction: CreateTrasactionInterface) => {
    await transactionService.createTrasaction(transaction);
    await refreshTransactions();
  };

  const updateTransaction = async (transaction: UpdateTransactionInterface) => {
    await transactionService.updateTransaction(transaction);
    await refreshTransactions();
  };

  const fetchTransactions = useCallback(async () => {
    const transactionResponse = await transactionService.getTrasactions({
      page: 1,
      perPage: 10,
    });

    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions);
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        loading,
        fetchCategories,
        categories,
        transactions,
        createTransaction,
        updateTransaction,
        fetchTransactions,
        totalTransactions,
        refreshTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  return useContext(TransactionContext);
};

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
import { Pagination } from "@/shared/interfaces/https/get-trasaction-request";

interface FetchTrasactionsParams {
  page: number;
}

interface Loadings {
  initial: boolean;
  refresh: boolean;
  loadMore: boolean;
}

interface HandleLoadingsParams {
  key: keyof Loadings;
  value: boolean;
}

export type TransactionContextType = {
  fetchCategories: () => Promise<void>;
  createTransaction: (transaction: CreateTrasactionInterface) => Promise<void>;
  updateTransaction: (transaction: UpdateTransactionInterface) => Promise<void>;
  categories: TransactionCategory[];
  fetchTransactions: (params: FetchTrasactionsParams) => Promise<void>;
  totalTransactions: TotalTransactions;
  transactions: Transaction[];
  refreshTransactions: () => Promise<void>;
  loadings: Loadings;
  loadMoreTrasactions: () => Promise<void>;
  handleLoadings: (params: HandleLoadingsParams) => void;
};

export const TransactionContext = createContext({} as TransactionContextType);

export const TransactionContextProvider: FC<PropsWithChildren> = ({
  children,
}) => {
  const [loadings, setLoadings] = useState<Loadings>({
    initial: false,
    refresh: false,
    loadMore: false,
  });
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalTransactions, setTotalTransactions] = useState<TotalTransactions>(
    {
      expense: 0,
      revenue: 0,
      total: 0,
    }
  );

  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    perPage: 15,
    totalRows: 0,
    totalPages: 0,
  });

  const handleLoadings = ({ key, value }: HandleLoadingsParams) => {
    setLoadings((prevValue) => ({ ...prevValue, [key]: value }));
  };

  const refreshTransactions = useCallback(async () => {
    const { page, perPage } = pagination;

    const transactionResponse = await transactionService.getTrasactions({
      page: 1,
      perPage: page * perPage,
    });

    setTransactions(transactionResponse.data);
    setTotalTransactions(transactionResponse.totalTransactions);
    setPagination({
      ...pagination,
      page,
      totalPages: transactionResponse.totalPages,
      totalRows: transactionResponse.totalRows,
    });
  }, [pagination]);

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

  const fetchTransactions = useCallback(
    async ({ page = 1 }: FetchTrasactionsParams) => {
      const transactionResponse = await transactionService.getTrasactions({
        page,
        perPage: pagination.perPage,
      });

      if (page === 1) {
        setTransactions(transactionResponse.data);
      } else {
        setTransactions((prevState) => [
          ...prevState,
          ...transactionResponse.data,
        ]);
      }

      setTotalTransactions(transactionResponse.totalTransactions);
      setPagination({
        ...pagination,
        page,
        totalRows: transactionResponse.totalRows,
        totalPages: transactionResponse.totalPages,
      });
    },
    [pagination]
  );

  const loadMoreTrasactions = useCallback(async () => {
    if (loadings.loadMore || pagination.page >= pagination.totalPages) return;

    fetchTransactions({ page: pagination.page + 1 });
  }, [loadings.loadMore, pagination]);

  return (
    <TransactionContext.Provider
      value={{
        loadings,
        handleLoadings,
        fetchCategories,
        categories,
        transactions,
        createTransaction,
        updateTransaction,
        fetchTransactions,
        totalTransactions,
        refreshTransactions,
        loadMoreTrasactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransaction = () => {
  return useContext(TransactionContext);
};

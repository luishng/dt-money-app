import { dtMoneyApi } from "@/shared/api/dt-money";
import { CreateTrasactionInterface } from "@/shared/interfaces/https/create-transaction-request";
import {
  GetTransactionParams,
  GetTrasactionResponse,
} from "@/shared/interfaces/https/get-trasaction-request";
import { TransactionCategory } from "@/shared/interfaces/https/transaction-category";
import qs from "qs";
export const getTransactionCategories = async (): Promise<
  TransactionCategory[]
> => {
  const { data } = await dtMoneyApi.get<TransactionCategory[]>(
    "/transaction/categories"
  );

  return data;
};

export const createTrasaction = async (
  transaction: CreateTrasactionInterface
) => {
  await dtMoneyApi.post("/transaction", transaction);
};

export const getTrasactions = async (
  params: GetTransactionParams
): Promise<GetTrasactionResponse> => {
  const { data } = await dtMoneyApi.get("/transaction", {
    params,
    paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat" }),
    /*
      Axios format the params like: [1,2,3]
      axios: categoryId[]=1categoryId[]=2categoryId[]=3
      With qs lib: categoryId=1&categoryId=2&categoryId=3
    */
  });

  return data;
};

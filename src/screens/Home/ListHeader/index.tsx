import { AppHeader } from "@/components/AppHeader";
import { ScrollView, View } from "react-native";
import { TransactionCard } from "./TransactionCard";
import { TransactionTypes } from "@/shared/enums/transaction-types";
import { useTransaction } from "@/context/transaction.context";
import { FilterInput } from "./FilterInput";

export const ListHeader = () => {
  const { totalTransactions } = useTransaction();
  return (
    <>
      <AppHeader />
      <View className="h-[150] w-full">
        <View className="h-[50] bg-background-primary" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="absolute pl-6 h-[141]"
        >
          <TransactionCard
            type={TransactionTypes.EXPENSE}
            amount={totalTransactions.expense}
          />
          <TransactionCard
            type={TransactionTypes.REVENUE}
            amount={totalTransactions.revenue}
          />
          <TransactionCard type={"total"} amount={totalTransactions.total} />
        </ScrollView>
      </View>
      <FilterInput />
    </>
  );
};

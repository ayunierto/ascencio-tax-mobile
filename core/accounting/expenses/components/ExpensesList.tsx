import React, { useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { FlatList, RefreshControl } from 'react-native';

import { ExpenseResponse } from '@/core/accounting/expenses/interfaces';
import { EmptyContent } from '@/core/components';
import ExpenseCard from './ExpenseCard';

interface ExpenseListProps {
  expenses: ExpenseResponse[];
  loadNextPage: () => void;
}

const ExpensesList = ({ expenses, loadNextPage }: ExpenseListProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();

  const onPullToRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 200));

    queryClient.invalidateQueries({
      queryKey: ['expenses', 'infinite'],
    });
    setIsRefreshing(false);
  };

  return (
    <FlatList
      data={expenses}
      numColumns={1}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ExpenseCard expense={item} />}
      onEndReached={loadNextPage}
      onEndReachedThreshold={0.8}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          style={{}}
          refreshing={isRefreshing}
          onRefresh={onPullToRefresh}
          title="Pull to refresh"
          tintColor="#fff"
          titleColor="#fff"
        />
      }
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={
        <EmptyContent
          title="No expenses found."
          subtitle="Add a new expense to get started"
        />
      }
    />
  );
};

export default ExpensesList;

import { api } from "@/core/api/api";
import { ExpenseResponse } from "../interfaces";

export const getExpenses = async (
  limit = 20,
  offset = 0
): Promise<ExpenseResponse[]> => {
  const { data } = await api.get<ExpenseResponse[]>(
    `expenses?limit=${limit}&offset=${offset}`
  );
  return data;
};

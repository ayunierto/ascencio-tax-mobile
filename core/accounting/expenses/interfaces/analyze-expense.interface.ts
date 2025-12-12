export interface AnalyzedExpense {
  merchant: string;
  date: string;
  total: number;
  tax: number;
  categoryId: string;
  subcategoryId: string;
}

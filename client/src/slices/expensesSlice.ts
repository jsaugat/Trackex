import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: [] };

const expensesSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    //? ADD all fetched expenses.
    addFetchedExpenses: (state, action) => {
      state.data = action.payload;
    },
    //? ADD a new expense.
    addExpenseLocally: (state, action) => {
      const newExpense = action.payload;
      state.data?.push(newExpense);
    },
    //? REMOVE an expense.
    removeExpenseLocally: (state, action) => {
      const idToRemove = action.payload;
      state.data = state.data?.filter((expense) => expense.id !== idToRemove);
    },
    //? UPDATE an expense.
    updateExpenseLocally: (state, action) => {
      const updatedExpense = action.payload;
      const index = state.data.findIndex(
        (expense) => expense.id === updatedExpense.id
      );
      // if index found
      if (index !== -1) {
        state.data[index] = updatedExpense;
      }
    },
  },
});

export const {
  addExpenseLocally,
  removeExpenseLocally,
  updateExpenseLocally,
  addFetchedExpenses,
} = expensesSlice.actions;

export default expensesSlice.reducer;

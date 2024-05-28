import { createSlice } from "@reduxjs/toolkit";

const initialState = { data: [] };

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    //? ADD all fetched users
    addFetchedUsers: (state, action) => {
      state.data = action.payload;
    },
    //? ADD a user
    addUserLocally: (state, action) => {
      const newUser = action.payload;
      state.data?.push(newUser);
    },
    //? REMOVE a user
    removeUserLocally: (state, action) => {
      const idToRemove = action.payload;
      state.data = state.data?.filter((user) => user.id !== idToRemove);
    },
    //? UPDATE a user
    updateUserLocally: (state, action) => {
      const updatedUser = action.payload;
      console.log(updatedUser)
      const index = state.data.findIndex((user) => user.id === updatedUser.id);
      // if index found
      if (index !== -1) {
        state.data[index] = updatedUser;
      }
    },
  },
});

export const {
  addFetchedUsers,
  addUserLocally,
  removeUserLocally,
  updateUserLocally,
} = usersSlice.actions;

export default usersSlice.reducer;

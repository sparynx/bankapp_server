import { configureStore } from "@reduxjs/toolkit";
import  {bankApi}  from "./features/bankApi"; // Import the bank API slice
import { setupListeners } from "@reduxjs/toolkit/query";

const store = configureStore({
  reducer: {
    [bankApi.reducerPath]: bankApi.reducer, // Add the bank API slice
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(bankApi.middleware),
});

// Enables automatic refetching of data when needed
setupListeners(store.dispatch);

export default store;

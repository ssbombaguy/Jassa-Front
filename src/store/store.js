import { configureStore } from "@reduxjs/toolkit";
import leaguesReducer from "./slices/leaguesSlice";
import clubsReducer from "./slices/clubsSlice";
import jerseysReducer from "./slices/jerseysSlice";
import cartReducer from "./slices/cartSlice";
import ordersReducer from "./slices/ordersSlice";

const store = configureStore({
  reducer: {
    leagues: leaguesReducer,
    clubs: clubsReducer,
    jerseys: jerseysReducer,
    cart: cartReducer,
    orders: ordersReducer,
  },
  devTools: import.meta.env.DEV,
});

export default store;

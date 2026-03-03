import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProducts } from "../../api/productsApi";
import { defaultSizes } from "../../constants/productFilters";

const mapSortToApi = (sortBy) => {
  switch (sortBy) {
    case "price-asc":
      return { sort: "price", order: "asc" };
    case "price-desc":
      return { sort: "price", order: "desc" };
    case "rating":
      return { sort: "rating", order: "desc" };
    case "name-asc":
      return { sort: "name", order: "asc" };
    default:
      return {};
  }
};

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    const state = getState().products;
    const sortQuery = mapSortToApi(state.sortBy);

    const params = {
      page: state.page,
      limit: state.limit,
      ...sortQuery,
    };

    if (state.selectedBrand !== "All") params.brand = state.selectedBrand;
    if (state.selectedSize !== "All") params.size = state.selectedSize;
    if (state.searchQuery.trim()) params.search = state.searchQuery.trim();

    try {
      return await getProducts(params);
    } catch (error) {
      return rejectWithValue({
        message: error.message || "Failed to load products.",
        errors: error.errors || [],
      });
    }
  }
);

const initialState = {
  filteredProducts: [],
  selectedBrand: "All",
  selectedSize: "All",
  sortBy: "default",
  searchQuery: "",
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 1,
  availableBrands: ["All"],
  availableSizes: defaultSizes,
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setBrandFilter: (state, action) => {
      state.selectedBrand = action.payload;
      state.page = 1;
    },
    setSizeFilter: (state, action) => {
      state.selectedSize = action.payload;
      state.page = 1;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
      state.page = 1;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetFilters: (state) => {
      state.selectedBrand = "All";
      state.selectedSize = "All";
      state.sortBy = "default";
      state.searchQuery = "";
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        const { products, pagination } = action.payload;
        const foundBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))].sort();
        const foundSizes = [...new Set(products.flatMap((p) => p.sizes || []))];

        state.loading = false;
        state.filteredProducts = products;
        state.total = pagination.total || products.length;
        state.page = pagination.page || 1;
        state.limit = pagination.limit || state.limit;
        state.totalPages = pagination.totalPages || 1;
        state.availableBrands = ["All", ...foundBrands];
        state.availableSizes = foundSizes.length > 0 ? foundSizes : defaultSizes;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message || "Failed to load products.";
      });
  },
});

export const {
  setBrandFilter,
  setSizeFilter,
  setSortBy,
  setSearchQuery,
  setPage,
  resetFilters,
} = productsSlice.actions;

export default productsSlice.reducer;

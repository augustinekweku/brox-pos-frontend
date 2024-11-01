import axios from "axios";
import { AxiosClient } from "./utils/clients";

import { store } from "./store";
import AuthService from "./services/apis/auth-service";
import { storeAuthActions } from "./store/auth-reducer";
import OrganizationService from "./services/apis/organization-service";
import SalesService from "./services/apis/sales-service";
import ProductService from "./services/apis/product-service";
import CategoryService from "./services/apis/category-service";
import StockService from "./services/apis/stock-service";
import SupplierService from "./services/apis/supplier-service";
import UserService from "./services/apis/user-service";

export const serverSideClient = new AxiosClient(axios, {
  headers: {
    "Content-Type": "application/json",
  },
});

// services
const authService = new AuthService(store, storeAuthActions);
const organizationService = new OrganizationService(store, storeAuthActions);
const saleService = new SalesService(store, storeAuthActions);
const productService = new ProductService(store, storeAuthActions);
const categoryService = new CategoryService(store, storeAuthActions);
const stockService = new StockService(store, storeAuthActions);
const supplierService = new SupplierService(store, storeAuthActions);
const userService = new UserService(store, storeAuthActions);

const DI = {
  authService,
  organizationService,
  saleService,
  productService,
  categoryService,
  stockService,
  supplierService,
  userService,
};

export default DI;


import axios from "axios";
import type {
  Vehicle,
  VehicleCreate,
  VehicleUpdate,
  Customer,
  CustomerCreate,
  CustomerUpdate,
  RecommendRequest,
  RecommendResponse,
  ChatRequest,
  ChatResponse,
  CompareRequest,
  CompareResponse,
  DashboardStats,
  SuccessResponse,
} from "../types";

// ─────────────────────────────────────────
// Axios 实例
// ─────────────────────────────────────────

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8003",
  timeout: 120000, // Agent 链较长，给 60s
  headers: {
    "Content-Type": "application/json",
  },
});

// 统一错误处理
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || err.message || "请求失败";
    console.error("[AutoLens API Error]", message);
    return Promise.reject(new Error(message));
  },
);

// ─────────────────────────────────────────
// 车型管理
// ─────────────────────────────────────────

export const getVehicles = async (): Promise<Vehicle[]> => {
  const res = await api.get("/api/vehicles");
  return res.data;
};

export const getVehicle = async (id: number): Promise<Vehicle> => {
  const res = await api.get(`/api/vehicles/${id}`);
  return res.data;
};

export const createVehicle = async (data: VehicleCreate): Promise<Vehicle> => {
  const res = await api.post("/api/vehicles", data);
  return res.data;
};

export const updateVehicle = async (
  id: number,
  data: VehicleUpdate,
): Promise<Vehicle> => {
  const res = await api.put(`/api/vehicles/${id}`, data);
  return res.data;
};

export const deleteVehicle = async (id: number): Promise<SuccessResponse> => {
  const res = await api.delete(`/api/vehicles/${id}`);
  return res.data;
};

// ─────────────────────────────────────────
// 客户管理
// ─────────────────────────────────────────

export const getCustomers = async (): Promise<Customer[]> => {
  const res = await api.get("/api/customers");
  return res.data;
};

export const getCustomer = async (id: number): Promise<Customer> => {
  const res = await api.get(`/api/customers/${id}`);
  return res.data;
};

export const createCustomer = async (
  data: CustomerCreate,
): Promise<Customer> => {
  const res = await api.post("/api/customers", data);
  return res.data;
};

export const updateCustomer = async (
  id: number,
  data: CustomerUpdate,
): Promise<Customer> => {
  const res = await api.put(`/api/customers/${id}`, data);
  return res.data;
};

export const updateCustomerNotes = async (
  id: number,
  notes: string,
): Promise<Customer> => {
  const res = await api.put(`/api/customers/${id}/notes`, { notes });
  return res.data;
};

// ─────────────────────────────────────────
// 智能推荐
// ─────────────────────────────────────────

export const recommend = async (
  data: RecommendRequest,
): Promise<RecommendResponse> => {
  const res = await api.post("/api/recommend", data);
  return res.data;
};

// ─────────────────────────────────────────
// 智能客服
// ─────────────────────────────────────────

export const chat = async (data: ChatRequest): Promise<ChatResponse> => {
  const res = await api.post("/api/chat", data);
  return res.data;
};

// ─────────────────────────────────────────
// 竞品对比
// ─────────────────────────────────────────

export const compare = async (
  data: CompareRequest,
): Promise<CompareResponse> => {
  const res = await api.post("/api/compare", data);
  return res.data;
};

// ─────────────────────────────────────────
// 数据总览
// ─────────────────────────────────────────

export const getDashboard = async (): Promise<DashboardStats> => {
  const res = await api.get("/api/dashboard");
  return res.data;
};

// ─────────────────────────────────────────
// 枚举
// ─────────────────────────────────────────

export type EnergyType = "纯电" | "插混" | "增程" | "不限";
export type BodyType = "SUV" | "轿车" | "MPV" | "跑车" | "不限";
export type FocusPoint =
  | "续航"
  | "空间"
  | "智驾"
  | "安全"
  | "性价比"
  | "补能"
  | "保值";
export type CommuteDistance = "50km以内" | "50-100km" | "100km以上";
export type ChargingAvailable = "有" | "无" | "不确定";
export type RecommendScene = "豪华社交" | "家庭通勤" | "通用";
export type RouterIntent = "推荐" | "对比" | "销售" | "知识";
export type CustomerStage =
  | "新线索"
  | "已联系"
  | "有意向"
  | "谈判中"
  | "已成交"
  | "已流失";

// ─────────────────────────────────────────
// 车型
// ─────────────────────────────────────────

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  energy_type: EnergyType;
  body_type: BodyType;
  price_min: number;
  price_max: number;
  range_km?: number;
  autopilot_level?: string;
  seats: number;
  cargo_liters?: number;
  charge_time_ac?: number;
  charge_time_dc?: number;
  highlights: string[];
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleCreate {
  brand: string;
  model: string;
  energy_type: EnergyType;
  body_type: BodyType;
  price_min: number;
  price_max: number;
  range_km?: number;
  autopilot_level?: string;
  seats?: number;
  cargo_liters?: number;
  charge_time_ac?: number;
  charge_time_dc?: number;
  highlights?: string[];
  image_url?: string;
}

export interface VehicleUpdate extends Partial<VehicleCreate> {}

// ─────────────────────────────────────────
// 用户画像
// ─────────────────────────────────────────

export interface UserProfile {
  budget_min?: number;
  budget_max?: number;
  family_size?: number;
  commute_distance?: CommuteDistance;
  charging_available?: ChargingAvailable;
  preferred_body?: BodyType[];
  preferred_energy?: EnergyType[];
  focus_points?: FocusPoint[];
  city?: string;
  extra_notes?: string;
}

// ─────────────────────────────────────────
// 推荐
// ─────────────────────────────────────────

export interface RecommendRequest {
  profile: UserProfile;
  top_n?: number;
  enable_deep_search?: boolean;
}

export interface VehicleScore {
  vehicle_id: number;
  vehicle_name: string;
  total_score: number;
  price_score: number;
  range_score: number;
  space_score: number;
  autopilot_score: number;
  value_score: number;
  within_budget: boolean;
  price_gap?: number;
}

export interface RecommendEvidence {
  source: string;
  content: string;
  relevance: number;
}

export interface RecommendResult {
  rank: number;
  vehicle: Vehicle;
  score: VehicleScore;
  scene: RecommendScene;
  sales_pitch: string;
  evidence: RecommendEvidence[];
  deep_search_used: boolean;
}

export interface RecommendResponse {
  session_id: string;
  profile: UserProfile;
  scene: RecommendScene;
  results: RecommendResult[];
  report_md: string;
  created_at: string;
}

// ─────────────────────────────────────────
// 客服对话
// ─────────────────────────────────────────

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  created_at: string;
}

export interface ChatRequest {
  session_id?: string;
  customer_id?: number;
  message: string;
  enable_web_search?: boolean;
}

export interface ChatResponse {
  session_id: string;
  intent: RouterIntent;
  answer: string;
  evidence: RecommendEvidence[];
  history: ChatMessage[];
  created_at: string;
}

// ─────────────────────────────────────────
// 竞品对比
// ─────────────────────────────────────────

export interface CompareRequest {
  vehicle_ids: number[];
  user_profile?: UserProfile;
  enable_web_search?: boolean;
}

export interface CompareItem {
  vehicle: Vehicle;
  price_range: string;
  range_display: string;
  autopilot: string;
  space_rating: "小" | "中" | "大" | "超大";
  charge_speed: string;
  value_rating: "一般" | "较高" | "很高";
  pros: string[];
  cons: string[];
}

export interface CompareResponse {
  items: CompareItem[];
  recommendation?: string;
  report_md: string;
  created_at: string;
}

// ─────────────────────────────────────────
// 客户管理
// ─────────────────────────────────────────

export interface Customer {
  id: number;
  name: string;
  phone?: string;
  city?: string;
  stage: CustomerStage;
  profile?: UserProfile;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerCreate {
  name: string;
  phone?: string;
  city?: string;
  stage?: CustomerStage;
  profile?: UserProfile;
  notes?: string;
}

export interface CustomerUpdate extends Partial<CustomerCreate> {}

// ─────────────────────────────────────────
// 数据总览
// ─────────────────────────────────────────

export interface DashboardStats {
  total_customers: number;
  new_customers_7d: number;
  total_recommendations: number;
  recommendations_7d: number;
  total_chats: number;
  chats_7d: number;
  top_recommended_models: { name: string; count: number }[];
  customer_stage_dist: Record<CustomerStage, number>;
  daily_activity_14d: { date: string; recommend: number; chat: number }[];
}

// ─────────────────────────────────────────
// 通用
// ─────────────────────────────────────────

export interface SuccessResponse {
  success: boolean;
  message: string;
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  detail?: string;
}

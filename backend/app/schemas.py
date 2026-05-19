
from pydantic import BaseModel, Field
from typing import Optional, List, Literal
from datetime import datetime
from enum import Enum


# ─────────────────────────────────────────
# 枚举类型
# ─────────────────────────────────────────

class EnergyType(str, Enum):
    """能源类型"""
    BEV       = "纯电"
    PHEV      = "插混"
    EREV      = "增程"
    ANY       = "不限"


class BodyType(str, Enum):
    """车身类型"""
    SUV       = "SUV"
    SEDAN     = "轿车"
    MPV       = "MPV"
    SPORTS    = "跑车"
    ANY       = "不限"


class FocusPoint(str, Enum):
    """用户关注点"""
    RANGE     = "续航"
    SPACE     = "空间"
    AUTOPILOT = "智驾"
    SAFETY    = "安全"
    VALUE     = "性价比"
    CHARGING  = "补能"
    RETENTION = "保值"


class CommuteDistance(str, Enum):
    """通勤距离"""
    SHORT     = "50km以内"
    MEDIUM    = "50-100km"
    LONG      = "100km以上"


class ChargingAvailable(str, Enum):
    """是否有家充"""
    YES       = "有"
    NO        = "无"
    UNSURE    = "不确定"


class RecommendScene(str, Enum):
    """推荐场景"""
    LUXURY    = "豪华社交"
    FAMILY    = "家庭通勤"
    GENERAL   = "通用"


class RouterIntent(str, Enum):
    """Router Agent 识别的用户意图"""
    RECOMMEND = "推荐"
    COMPARE   = "对比"
    SALES     = "销售"
    KNOWLEDGE = "知识"


class CustomerStage(str, Enum):
    """客户跟进阶段"""
    NEW       = "新线索"
    CONTACTED = "已联系"
    INTERESTED= "有意向"
    NEGOTIATING = "谈判中"
    CLOSED    = "已成交"
    LOST      = "已流失"


# ─────────────────────────────────────────
# 车型相关
# ─────────────────────────────────────────

class VehicleBase(BaseModel):
    """车型基础字段"""
    brand:           str            = Field(..., description="品牌，如比亚迪")
    model:           str            = Field(..., description="车型名，如海豹")
    energy_type:     EnergyType     = Field(..., description="能源类型")
    body_type:       BodyType       = Field(..., description="车身类型")
    price_min:       float          = Field(..., description="最低价格（万元）")
    price_max:       float          = Field(..., description="最高价格（万元）")
    range_km:        Optional[int]  = Field(None, description="CLTC续航里程（km）")
    autopilot_level: Optional[str]  = Field(None, description="智驾等级，如L2+")
    seats:           int            = Field(5,    description="座位数")
    cargo_liters:    Optional[int]  = Field(None, description="后备厢容积（L）")
    charge_time_ac:  Optional[float]= Field(None, description="慢充时间（h）")
    charge_time_dc:  Optional[float]= Field(None, description="快充至80%时间（min）")
    highlights:      List[str]      = Field(default_factory=list, description="卖点标签")
    image_url:       Optional[str]  = Field(None, description="车型图片URL")
    weaknesses: List[str] = Field(default_factory=list, description="短板")
    safety_score: Optional[float] = Field(None, description="安全评分")


class VehicleCreate(VehicleBase):
    """新增车型"""
    pass


class VehicleUpdate(BaseModel):
    """更新车型（所有字段可选）"""
    brand:           Optional[str]         = None
    model:           Optional[str]         = None
    energy_type:     Optional[EnergyType]  = None
    body_type:       Optional[BodyType]    = None
    price_min:       Optional[float]       = None
    price_max:       Optional[float]       = None
    range_km:        Optional[int]         = None
    autopilot_level: Optional[str]         = None
    seats:           Optional[int]         = None
    cargo_liters:    Optional[int]         = None
    charge_time_ac:  Optional[float]       = None
    charge_time_dc:  Optional[float]       = None
    highlights:      Optional[List[str]]   = None
    image_url:       Optional[str]         = None


class Vehicle(VehicleBase):
    """车型完整信息（含数据库ID）"""
    id:         int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# ─────────────────────────────────────────
# 用户画像（表单 & ProfileAgent 共用）
# ─────────────────────────────────────────

class UserProfile(BaseModel):
    """
    用户购车画像。
    推荐页：表单直接填写，所有字段有值。
    客服页：ProfileAgent 从自然语言提取，部分字段可能为 None。
    """
    budget_min:         Optional[float]              = Field(None, description="预算下限（万元）")
    budget_max:         Optional[float]              = Field(None, description="预算上限（万元）")
    family_size:        Optional[int]                = Field(None, description="家庭人数")
    commute_distance:   Optional[CommuteDistance]    = Field(None, description="通勤距离")
    charging_available: Optional[ChargingAvailable]  = Field(None, description="有无家充")
    preferred_body:     Optional[List[BodyType]]     = Field(None, description="偏好车身类型")
    preferred_energy:   Optional[List[EnergyType]]   = Field(None, description="偏好能源类型")
    focus_points:       Optional[List[FocusPoint]]   = Field(None, description="关注点（多选）")
    city:               Optional[str]                = Field(None, description="所在城市")
    extra_notes:        Optional[str]                = Field(None, description="其他补充说明")


# ─────────────────────────────────────────
# 推荐相关
# ─────────────────────────────────────────

class RecommendRequest(BaseModel):
    """推荐页表单提交"""
    profile:     UserProfile
    top_n:       int  = Field(3, ge=1, le=5, description="返回推荐数量")
    enable_deep_search: bool = Field(False, description="是否启用联网搜索")


class VehicleScore(BaseModel):
    """单个车型的评分详情"""
    vehicle_id:       int
    vehicle_name:     str           = Field(..., description="品牌+车型，如比亚迪海豹")
    total_score:      float         = Field(..., description="综合评分 0-100")
    price_score:      float         = Field(..., description="价格匹配分")
    range_score:      float         = Field(..., description="续航匹配分")
    space_score:      float         = Field(..., description="空间匹配分")
    autopilot_score:  float         = Field(..., description="智驾匹配分")
    value_score:      float         = Field(..., description="性价比评分")
    within_budget:    bool          = Field(..., description="是否在预算内")
    price_gap:        Optional[float] = Field(None, description="超预算金额（万元），None表示在预算内")


class RecommendEvidence(BaseModel):
    """推荐依据（RAG检索结果）"""
    source:    str   = Field(..., description="来源，如知识库/联网")
    content:   str   = Field(..., description="证据内容摘要")
    relevance: float = Field(..., description="相关度 0-1")


class RecommendResult(BaseModel):
    """单个推荐结果"""
    rank:          int
    vehicle:       Vehicle
    score:         VehicleScore
    scene:         RecommendScene
    sales_pitch:   str              = Field(..., description="销售话术（Markdown）")
    evidence:      List[RecommendEvidence] = Field(default_factory=list)
    deep_search_used: bool          = Field(False, description="是否用了联网搜索")


class RecommendResponse(BaseModel):
    """推荐接口完整返回"""
    session_id:   str
    profile:      UserProfile
    scene:        RecommendScene
    results:      List[RecommendResult]
    report_md:    str              = Field(..., description="完整推荐报告 Markdown")
    created_at:   datetime


# ─────────────────────────────────────────
# 客服对话相关
# ─────────────────────────────────────────

class ChatMessage(BaseModel):
    """单条对话消息"""
    role:       Literal["user", "assistant"]
    content:    str
    created_at: datetime = Field(default_factory=datetime.now)


class ChatRequest(BaseModel):
    """客服发送消息"""
    session_id:         Optional[str]  = Field(None, description="会话ID，None则新建")
    customer_id:        Optional[int]  = Field(None, description="关联客户ID")
    message:            str
    enable_web_search:  bool           = Field(True, description="是否启用联网搜索")


class ChatResponse(BaseModel):
    """客服回复"""
    session_id:   str
    intent:       RouterIntent         = Field(..., description="Router识别的意图")
    answer:       str                  = Field(..., description="回答内容（Markdown）")
    evidence:     List[RecommendEvidence] = Field(default_factory=list)
    history:      List[ChatMessage]    = Field(default_factory=list, description="本次携带的历史（最近8条）")
    created_at:   datetime


# ─────────────────────────────────────────
# 竞品对比相关
# ─────────────────────────────────────────

class CompareRequest(BaseModel):
    """竞品对比请求"""
    vehicle_ids:        List[int]      = Field(..., min_length=2, max_length=4, description="对比车型ID列表")
    user_profile:       Optional[UserProfile] = Field(None, description="用户画像（可选，有则给出个性化建议）")
    enable_web_search:  bool           = Field(False)


class CompareItem(BaseModel):
    """单个车型的对比维度数据"""
    vehicle:        Vehicle
    price_range:    str                = Field(..., description="如 15-18万")
    range_display:  str                = Field(..., description="如 CLTC 700km")
    autopilot:      str
    space_rating:   Literal["小", "中", "大", "超大"]
    charge_speed:   str                = Field(..., description="如 快充30min至80%")
    value_rating:   Literal["一般", "较高", "很高"]
    pros:           List[str]
    cons:           List[str]


class CompareResponse(BaseModel):
    """竞品对比返回"""
    items:          List[CompareItem]
    recommendation: Optional[str]      = Field(None, description="综合推荐结论（Markdown），有用户画像时生成")
    report_md:      str
    created_at:     datetime


# ─────────────────────────────────────────
# 客户管理相关
# ─────────────────────────────────────────

class CustomerBase(BaseModel):
    """客户基础信息"""
    name:           str
    phone:          Optional[str]      = None
    city:           Optional[str]      = None
    stage:          CustomerStage      = CustomerStage.NEW
    profile:        Optional[UserProfile] = None
    notes:          Optional[str]      = Field(None, description="跟进备注")


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name:           Optional[str]          = None
    phone:          Optional[str]          = None
    city:           Optional[str]          = None
    stage:          Optional[CustomerStage]= None
    profile:        Optional[UserProfile]  = None
    notes:          Optional[str]          = None


class Customer(CustomerBase):
    """客户完整信息"""
    id:                  int
    recommend_history:   List[RecommendResponse] = Field(default_factory=list)
    chat_sessions:       List[str]               = Field(default_factory=list, description="关联会话ID列表")
    created_at:          datetime
    updated_at:          datetime

    class Config:
        from_attributes = True


class CustomerListItem(BaseModel):
    """客户列表简略信息（不含历史）"""
    id:       int
    name:     str
    phone:    Optional[str]
    city:     Optional[str]
    stage:    CustomerStage
    notes:    Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class NotesUpdate(BaseModel):
    """更新跟进备注"""
    notes: str


# ─────────────────────────────────────────
# 数据总览 / 分析统计
# ─────────────────────────────────────────

class DashboardStats(BaseModel):
    """数据总览页统计数据"""
    total_customers:        int
    new_customers_7d:       int
    total_recommendations:  int
    recommendations_7d:     int
    total_chats:            int
    chats_7d:               int
    top_recommended_models: List[dict]   = Field(..., description="推荐次数Top5车型，[{name, count}]")
    customer_stage_dist:    dict         = Field(..., description="客户阶段分布，{stage: count}")
    daily_activity_14d:     List[dict]   = Field(..., description="近14天日活，[{date, recommend, chat}]")


# ─────────────────────────────────────────
# 通用响应
# ─────────────────────────────────────────

class SuccessResponse(BaseModel):
    success:  bool = True
    message:  str  = "操作成功"


class ErrorResponse(BaseModel):
    success:  bool  = False
    message:  str
    detail:   Optional[str] = None
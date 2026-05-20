
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import (
    init_db,
    # 车型
    create_vehicle, get_vehicle, get_all_vehicles,
    update_vehicle, delete_vehicle,
    # 客户
    create_customer, get_customer, get_all_customers,
    update_customer, update_customer_notes,
    # 统计
    get_dashboard_stats,
)
from app.schemas import (
    VehicleCreate, VehicleUpdate,
    CustomerCreate, CustomerUpdate, NotesUpdate,
    RecommendRequest, ChatRequest, CompareRequest,
    SuccessResponse,
)


# ─────────────────────────────────────────
# 启动 / 关闭
# ─────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    print(f"🚀 {settings.APP_NAME} v{settings.APP_VERSION} 启动")
    yield
    print("👋 服务关闭")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# 允许前端跨域访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─────────────────────────────────────────
# 健康检查
# ─────────────────────────────────────────

@app.get("/")
def root():
    return {"app": settings.APP_NAME, "version": settings.APP_VERSION, "status": "ok"}


# ─────────────────────────────────────────
# 车型管理
# ─────────────────────────────────────────

@app.get("/api/vehicles", tags=["车型"])
def list_vehicles():
    return get_all_vehicles()


@app.get("/api/vehicles/{vehicle_id}", tags=["车型"])
def read_vehicle(vehicle_id: int):
    v = get_vehicle(vehicle_id)
    if not v:
        raise HTTPException(status_code=404, detail="车型不存在")
    return v


@app.post("/api/vehicles", tags=["车型"], status_code=201)
def add_vehicle(body: VehicleCreate):
    return create_vehicle(body.model_dump())


@app.put("/api/vehicles/{vehicle_id}", tags=["车型"])
def edit_vehicle(vehicle_id: int, body: VehicleUpdate):
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    v = update_vehicle(vehicle_id, data)
    if not v:
        raise HTTPException(status_code=404, detail="车型不存在")
    return v


@app.delete("/api/vehicles/{vehicle_id}", tags=["车型"])
def remove_vehicle(vehicle_id: int):
    ok = delete_vehicle(vehicle_id)
    if not ok:
        raise HTTPException(status_code=404, detail="车型不存在")
    return SuccessResponse(message="车型已删除")


# ─────────────────────────────────────────
# 客户管理
# ─────────────────────────────────────────

@app.get("/api/customers", tags=["客户"])
def list_customers():
    return get_all_customers()


@app.get("/api/customers/{customer_id}", tags=["客户"])
def read_customer(customer_id: int):
    c = get_customer(customer_id)
    if not c:
        raise HTTPException(status_code=404, detail="客户不存在")
    return c


@app.post("/api/customers", tags=["客户"], status_code=201)
def add_customer(body: CustomerCreate):
    data = body.model_dump()
    if data.get("profile"):
        data["profile"] = body.profile.model_dump() if body.profile else {}
    return create_customer(data)


@app.put("/api/customers/{customer_id}", tags=["客户"])
def edit_customer(customer_id: int, body: CustomerUpdate):
    data = {k: v for k, v in body.model_dump().items() if v is not None}
    c = update_customer(customer_id, data)
    if not c:
        raise HTTPException(status_code=404, detail="客户不存在")
    return c


@app.put("/api/customers/{customer_id}/notes", tags=["客户"])
def edit_notes(customer_id: int, body: NotesUpdate):
    c = update_customer_notes(customer_id, body.notes)
    if not c:
        raise HTTPException(status_code=404, detail="客户不存在")
    return c


# ─────────────────────────────────────────
# 数据总览
# ─────────────────────────────────────────

@app.get("/api/dashboard", tags=["统计"])
def dashboard():
    return get_dashboard_stats()


# ─────────────────────────────────────────
# 推荐 / 客服
# ─────────────────────────────────────────

@app.post("/api/recommend", tags=["推荐"])
async def recommend(body: RecommendRequest):
    from app.agents.recommend.orchestrator import run_recommend_pipeline
    try:
        result = await run_recommend_pipeline(
            profile=body.profile.model_dump(exclude_none=True),
            top_n=body.top_n,
            enable_deep_search=body.enable_deep_search,
            customer_id=body.customer_id,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/chat", tags=["客服"])
async def chat(body: ChatRequest):
    from app.agents.customer_service.orchestrator import run_chat_pipeline
    try:
        result = await run_chat_pipeline(
            message=body.message,
            session_id=body.session_id,
            customer_id=body.customer_id,
            enable_web_search=body.enable_web_search,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/compare", tags=["对比"])
async def compare_vehicles(body: CompareRequest):
    from app.agents.compare.orchestrator import run_compare_pipeline
    return await run_compare_pipeline(body.vehicle_ids)


@app.post("/api/compare/report", tags=["对比"])
async def compare_report(body: CompareRequest):
    from app.agents.compare.orchestrator import run_report_pipeline
    return await run_report_pipeline(body.vehicle_ids)

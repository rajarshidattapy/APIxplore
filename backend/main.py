from contextlib import asynccontextmanager
from fastapi import FastAPI

from config import settings
from middleware import setup_cors, LoggingMiddleware, ErrorMiddleware, SafetyMiddleware
from routers import analyze_api_router, ui_plan_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    print("Policy-Aware AI API Explorer started")
    yield
    print("Policy-Aware AI API Explorer stopped")


app = FastAPI(
    title="Policy-Aware AI API Explorer",
    description="Safety analysis and UI plan generation for API requests",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware
setup_cors(app)
app.add_middleware(ErrorMiddleware)
app.add_middleware(LoggingMiddleware)
app.add_middleware(SafetyMiddleware)

# Routes
app.include_router(analyze_api_router)
app.include_router(ui_plan_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True, access_log=True)

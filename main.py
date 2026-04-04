from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import research, icp, personas, campaign, messages, pipeline

app = FastAPI(title="Outreach Intelligence API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://your-app.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(pipeline.router, prefix="/api/pipeline", tags=["pipeline"])
app.include_router(research.router, prefix="/api/research", tags=["research"])
app.include_router(icp.router, prefix="/api/icp", tags=["icp"])
app.include_router(personas.router, prefix="/api/personas", tags=["personas"])
app.include_router(campaign.router, prefix="/api/campaign", tags=["campaign"])
app.include_router(messages.router, prefix="/api/messages", tags=["messages"])

@app.get("/health")
async def health():
    return {"status": "ok"}

from fastapi import FastAPI
from routes.repository_router import repositoryRouter
from routes.rag_routes import ragRouter
app = FastAPI()

app.include_router(
    repositoryRouter,
    prefix='/ai/repository'
)

app.include_router(
    ragRouter,
    prefix='/ai/rag'
)

@app.get("/")
async def root():
    return {"status": "AI service running"}
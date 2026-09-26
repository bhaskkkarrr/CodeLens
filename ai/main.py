print("STEP 1: main.py starting")

from fastapi import FastAPI

print("STEP 2: FastAPI imported")

from routers.repository_router import repositoryRouter

print("STEP 3: repository router imported")

from routers.rag_router import ragRouter

print("STEP 4: rag router imported")

app = FastAPI()

print("STEP 5: FastAPI app created")

app.include_router(
    repositoryRouter,
    prefix="/ai/repository"
)

print("STEP 6: repository router included")

app.include_router(
    ragRouter,
    prefix="/ai/rag"
)

print("STEP 7: RAG router included")


@app.get("/")
async def root():
    return {"status": "AI service running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}

print("STEP 8: main.py finished")
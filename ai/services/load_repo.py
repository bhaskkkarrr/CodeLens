print("LOAD_REPO: START", flush=True)

from pathlib import Path

print("LOAD_REPO: PATHLIB IMPORTED", flush=True)

from langchain_core.documents import Document

print("LOAD_REPO: DOCUMENT IMPORTED", flush=True)

from langchain_text_splitters import RecursiveCharacterTextSplitter

print("LOAD_REPO: TEXT SPLITTER IMPORTED", flush=True)

from rich import print

print("LOAD_REPO: RICH IMPORTED", flush=True)

from langchain_chroma import Chroma

print("LOAD_REPO: CHROMA IMPORTED", flush=True)

from utils.ai_resources import get_embedding_model

print("LOAD_REPO: AI RESOURCES IMPORTED", flush=True)


SUPPORTED_EXTENSIONS = {
    ".js", ".jsx", ".ts", ".tsx", ".html", ".md"
}

IGNORED_DIRECTORIES = {
    ".git",
    "node_modules",
    "dist",
    "build",
    ".venv",
    "__pycache__",
    "coverage",
    "pacha"
}


async def load(repository_path, repo_id, user_id):
    print("LOAD FUNCTION CALLED", flush=True)

    documents = []
    root = Path(repository_path)

    # Your existing load logic here
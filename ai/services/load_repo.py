from pathlib import Path
import subprocess
import shutil
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from rich import print
from langchain_chroma import Chroma
from utils.ai_resources import get_embedding_model

SUPPORTED_EXTENSIONS = {
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".html",
    ".md"
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


async def load(repo_url,repo_id,user_id):
    print("Repo URL", repo_url)
    print("Cloning started")

    repo_path = (
        Path("runtime_data")
        / "cloned_repositories"
        / str(user_id)
        / str(repo_id)
    )

    if repo_path.exists():

            print("Removing old repository...")

            shutil.rmtree(
                repo_path,
                ignore_errors=True
            )

    repo_path.parent.mkdir(parents=True, exist_ok=True)

    subprocess.run(
        ["git", "clone", repo_url, str(repo_path)],
        check=True
    )

    print("Repository cloned to:", repo_path)

    documents = []

    root = repo_path

    for file_path in root.rglob("*"):

        if not file_path.is_file():
            continue

        if any(
            ignored in file_path.parts for ignored in IGNORED_DIRECTORIES
        ):
            continue

        if file_path.suffix not in SUPPORTED_EXTENSIONS:
            continue

        try:
            content = file_path.read_text(
                encoding="utf-8"
            )

            relative_path = file_path.relative_to(root)
            print("file name:",file_path.name)
            documents.append(
                Document(
                    page_content=f"""
                        FILE: {relative_path}
                        {content}
                        """,
                    metadata={
                        "file_path": str(relative_path),
                        "file_name": file_path.name,
                        "extension": file_path.suffix,
                        "repository_id":repo_id,
                        "user_id":user_id
                    }
                )
            )

        except UnicodeDecodeError:
            continue


    print(f"Loaded {len(documents)} files")
    if not documents:
        return {
            "success": False,
            "message": "No supported files found in repository"
        }

    splitter = RecursiveCharacterTextSplitter(chunk_size = 2000, chunk_overlap = 200 )
    chunks = splitter.split_documents(documents)
    
    print(f"Chunks: {len(chunks)}")

    embedding_model = get_embedding_model()
    try:
        vector_db_path = f"vector_db/{user_id}/{repo_id}"
        Chroma.from_documents(
            documents=chunks,
            embedding=embedding_model,
            persist_directory=vector_db_path
        )
        return {
            "success":True,
            "message":"Repository cloned successfully"
        }
    except:
        return {
            "success":False,
            "message":"Repository cloning unsuccessful"
        }    
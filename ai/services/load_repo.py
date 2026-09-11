from pathlib import Path
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from rich import print
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma

embedding_model = HuggingFaceEmbeddings(
    model_name = "BAAI/bge-small-en-v1.5"
    )

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


async def load_repo(repository_path):

    documents = []

    root = Path(repository_path)

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

            documents.append(
                Document(
                    page_content=content,
                    metadata={
                        "file_path": str(relative_path),
                        "file_name": file_path.name,
                        "extension": file_path.suffix,
                        "repository_path": repository_path
                    }
                )
            )

        except UnicodeDecodeError:
            continue


        print(f"Loaded {len(documents)} files")

        splitter = RecursiveCharacterTextSplitter(chunk_size = 2000, chunk_overlap = 200 )

        chunks = splitter.split_documents(documents)
        print(f"Chunks: {len(chunks)}")

        try:
          vector_store = Chroma.from_documents(
              documents=chunks,
              embedding=embedding_model,
              persist_directory='./db'
          )
          return {
              "success":True,
              "message":"Repository cloned successfully"
          }

        except:
            return {
                "success":True,
                "message":"Repository cloned successfully"
            }
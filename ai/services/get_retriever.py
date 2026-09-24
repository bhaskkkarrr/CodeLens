from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from dotenv import load_dotenv
load_dotenv()

embedding_model = HuggingFaceEmbeddings(
  model_name = "BAAI/bge-small-en-v1.5"
)

vector_store = Chroma(
  persist_directory='vector_db',
  embedding_function=embedding_model
)
from pathlib import Path

VECTOR_DB_ROOT = Path("vector_db")

def get_vector_store(repo_id, user_id):

    db_path = (
        VECTOR_DB_ROOT
        / str(user_id)
        / str(repo_id)
    )

    print("CHROMA PATH:", db_path)

    vector_store = Chroma(
        persist_directory=str(db_path),
        embedding_function=embedding_model
    )

    print(
        "DOCUMENT COUNT:",
        vector_store._collection.count()
    )

    return vector_store

def get_retriever(repo_id,user_id):
  print("Repository ID:", repo_id)
  print("User ID:", user_id)

  vector_store = get_vector_store(
        repo_id,
        user_id
    )

  retriever = vector_store.as_retriever(
    search_type = 'similarity',
    search_kwargs = {
      'k' : 5,
      }
  )
  return retriever
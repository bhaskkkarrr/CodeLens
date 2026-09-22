from langchain_chroma import Chroma
from langchain_huggingface import HuggingFaceEmbeddings

from dotenv import load_dotenv
load_dotenv()

embedding_model = HuggingFaceEmbeddings(
  model_name = "BAAI/bge-small-en-v1.5"
)

vector_store = Chroma(
  persist_directory='db',
  embedding_function=embedding_model
)

def get_retriever(repo_id):
  print("Repository ID:", repo_id)
  retriever = vector_store.as_retriever(
    search_type = 'similarity',
    search_kwargs = {
      'k' : 5,
      'filter' : {
        'repository_id' : repo_id
      }
    }
  )
  return retriever
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_openrouter import ChatOpenRouter

from dotenv import load_dotenv
load_dotenv()

_embedding_model = None
_llm = None


def get_embedding_model():
    global _embedding_model

    if _embedding_model is None:
        print("Loading embedding model...")

        _embedding_model = HuggingFaceEmbeddings(
            model_name="BAAI/bge-small-en-v1.5"
        )

        print("Embedding model loaded.")

    return _embedding_model


def get_llm():
    global _llm

    if _llm is None:
        print("Initializing LLM...")

        _llm = ChatOpenRouter(
                model="openai/gpt-4o-mini",
                max_tokens=700,
                temperature=0
              )

        print("LLM initialized.")

    return _llm
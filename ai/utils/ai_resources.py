from dotenv import load_dotenv
load_dotenv()

_embedding_model = None
_llm = None


def get_embedding_model():
    global _embedding_model

    if _embedding_model is None:
        print("Loading embedding model...")

        from langchain_huggingface import HuggingFaceEndpointEmbeddings

        _embedding_model = HuggingFaceEndpointEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        print("Embedding model loaded.")

    return _embedding_model


def get_llm():
    global _llm

    if _llm is None:
        print("Initializing LLM...")

        from langchain_openrouter import ChatOpenRouter

        _llm = ChatOpenRouter(
            model="openai/gpt-4o-mini",
            max_tokens=700,
            temperature=0
        )

        print("LLM initialized.")

    return _llm
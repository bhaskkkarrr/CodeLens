from services.retriever import retriever_response

async def ask_question(query,repo_id,user_id):
  try:
    response = retriever_response(query,repo_id,user_id)
    return response
  except Exception as e:
        print("ERROR:", repr(e))

        return {
            "success": False,
            "message": str(e)
        }
    
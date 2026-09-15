from services.retriever import retriever_response

async def ask_question(query):
  try:
    response = retriever_response(query)
    return {
      "success":True,
      "message":"AI response generated successfully",
      "response":response
    }
  except Exception as e:
        print("ERROR:", repr(e))

        return {
            "success": False,
            "message": str(e)
        }
    
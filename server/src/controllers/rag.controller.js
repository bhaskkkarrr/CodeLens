import config from "../config/config.js";
import axios from "axios";
export const ask_questions = async (req, res) => {
  const query = req.body.query;
  if (!query) {
    return res.status(400).json({
      success: false,
      message: "No question asked",
    });
  }
  console.log("Query", query);

  try {
    const ai_response = await axios.post(`${config.AI_API}/ai/rag/question`, {
      question: query,
    });
    const reponse_data = ai_response.data
    console.log("RES:", reponse_data);
    if (reponse_data.success) {
      return res.status(200).json({
        success: true,
        message: "AI response generated successfully",
        response: reponse_data.response.response,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "AI response generation error",
        error: reponse_data.message,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unexpected server error occured",
      error,
    });
  }
};

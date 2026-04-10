import express from "express";
import { separatePoem } from "../services/llmService.js";

const router = express.Router();

router.post("/poemSep", async (req, res) => {

  const { poem } = req.body;

  try {

    const result = await separatePoem(poem);

    res.json({
      code: 200,
      message: "Poem separated successfully",
      data: result
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: "LLM request failed"
    });

  }

});

export default router;
import Result from "../models/resultModel.js";

export async function createResult(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "not authorize",
      });
    }

    const { title, technology, level, totalQuestions, correct, wrong } = req.body;

    // Required fields check
    if (!technology || !level || totalQuestions === undefined || correct === undefined) {
      return res.status(400).json({
        success: false,
        message: "Missing fields",
      });
    }

    // ---- ❗ ADD VALIDATION CHECKS ----
    if (isNaN(totalQuestions) || totalQuestions <= 0) {
      return res.status(400).json({
        success: false,
        message: "totalQuestions must be a positive number",
      });
    }

    if (isNaN(correct) || correct < 0) {
      return res.status(400).json({
        success: false,
        message: "correct must be a non-negative number",
      });
    }

    if (correct > totalQuestions) {
      return res.status(400).json({
        success: false,
        message: "correct cannot be greater than totalQuestions",
      });
    }

    if (wrong !== undefined && (isNaN(wrong) || wrong < 0)) {
      return res.status(400).json({
        success: false,
        message: "wrong must be a non-negative number",
      });
    }
    // ---- END VALIDATION ----

    const computedWrong =
      wrong !== undefined
        ? Number(wrong)
        : Math.max(0, Number(totalQuestions) - Number(correct));

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Missing Title",
      });
    }

    const payload = {
      title: String(title).trim(),
      technology,
      level,
      totalQuestions: Number(totalQuestions),
      correct: Number(correct),
      wrong: computedWrong,
      user: req.user.id,
    };

    const created = await Result.create(payload);

    return res.status(201).json({
      success: true,
      message: "Result created",
      result: created,
    });
  } catch (error) {
    console.error("createResult err:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}


export async function listResult(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "not authorize",
      });
    }

    const { technology } = req.query;
    const query = { user: req.user.id };

    if (technology && technology.toLowerCase() !== "all") {
      query.technology = technology;
    }

    const items = await Result.find(query)
      .sort({ createdAt: -1 })
      .lean();

    return res.json({
      success: true,
      results: items,
    });
  } catch (error) {
    console.error("listResult err:", error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

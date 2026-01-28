import Result from "../models/resultModel.js";

export async function getProfileSummary(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const userId = req.user.id;

    // get all results for this user
    const results = await Result.find({ user: userId }).lean();

    const totalQuizzes = results.length;

    const totalQuestions = results.reduce(
      (sum, r) => sum + (Number(r.totalQuestions) || 0),
      0
    );
    const totalCorrect = results.reduce(
      (sum, r) => sum + (Number(r.correct) || 0),
      0
    );
    const totalWrong = results.reduce(
      (sum, r) => sum + (Number(r.wrong) || 0),
      0
    );

    const accuracy = totalQuestions
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0;

    // optional: breakdown by technology
    const byTechMap = {};
    results.forEach((r) => {
      const tech = r.technology || "unknown";
      if (!byTechMap[tech]) {
        byTechMap[tech] = {
          quizzes: 0,
          totalQuestions: 0,
          correct: 0,
          wrong: 0,
        };
      }
      byTechMap[tech].quizzes += 1;
      byTechMap[tech].totalQuestions += Number(r.totalQuestions) || 0;
      byTechMap[tech].correct += Number(r.correct) || 0;
      byTechMap[tech].wrong += Number(r.wrong) || 0;
    });

    const byTechnology = Object.entries(byTechMap).map(
      ([tech, stats]) => ({
        technology: tech,
        ...stats,
        accuracy: stats.totalQuestions
          ? Math.round((stats.correct / stats.totalQuestions) * 100)
          : 0,
      })
    );

    return res.json({
      success: true,
      summary: {
        totalQuizzes,
        totalQuestions,
        totalCorrect,
        totalWrong,
        accuracy,
      },
      byTechnology,
    });
  } catch (err) {
    console.error("getProfileSummary error:", err);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}

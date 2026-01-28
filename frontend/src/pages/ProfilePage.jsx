import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";

const ProfilePage = ({ apiBase = "https://tech-quize-application.vercel.app" }) => {
  const [summary, setSummary] = useState(null);
  const [byTech, setByTech] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getAuthHeader = useCallback(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  useEffect(() => {
    let mounted = true;

    const fetchSummary = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`${apiBase}/api/profile/summary`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          timeout: 10000,
        });

        if (!mounted) return;

        if (res.data && res.data.success) {
          setSummary(res.data.summary);
          setByTech(res.data.byTechnology || []);
        } else {
          setError("Failed to load profile summary.");
        }
      } catch (err) {
        console.error(
          "Failed to fetch profile summary",
          err?.response?.data || err.message || err
        );
        setError("Failed to load profile summary.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSummary();

    return () => {
      mounted = false;
    };
  }, [apiBase, getAuthHeader]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Profile</h1>

        {loading ? (
          <p>Loading profile...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : !summary ? (
          <p>No data yet. Take a quiz to see your stats!</p>
        ) : (
          <>
            {/* Top stats cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white shadow rounded-xl p-4">
                <p className="text-sm text-gray-500">Quizzes Taken</p>
                <p className="text-2xl font-semibold">{summary.totalQuizzes}</p>
              </div>
              <div className="bg-white shadow rounded-xl p-4">
                <p className="text-sm text-gray-500">Questions Attempted</p>
                <p className="text-2xl font-semibold">
                  {summary.totalQuestions}
                </p>
              </div>
              <div className="bg-white shadow rounded-xl p-4">
                <p className="text-sm text-gray-500">Correct Answers</p>
                <p className="text-2xl font-semibold">{summary.totalCorrect}</p>
              </div>
              <div className="bg-white shadow rounded-xl p-4">
                <p className="text-sm text-gray-500">Accuracy</p>
                <p className="text-2xl font-semibold">{summary.accuracy}%</p>
              </div>
            </div>

            {/* Per-technology breakdown */}
            {byTech.length > 0 && (
              <section>
                <h2 className="text-xl font-semibold mb-3">
                  Performance by Technology
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {byTech.map((t) => (
                    <div
                      key={t.technology}
                      className="bg-white shadow rounded-xl p-4"
                    >
                      <p className="font-semibold capitalize mb-1">
                        {t.technology}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Quizzes: {t.quizzes}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Questions: {t.totalQuestions}
                      </p>
                      <p className="text-sm text-gray-500 mb-1">
                        Correct: {t.correct} | Wrong: {t.wrong}
                      </p>
                      <p className="text-sm font-medium">
                        Accuracy: {t.accuracy}%
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ProfilePage;

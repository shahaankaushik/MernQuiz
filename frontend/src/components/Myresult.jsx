import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { resultStyles } from "../assets/dummyStyles";

const Badge = ({ percent }) => {
  if (percent >= 85)
    return <span className={resultStyles.badgeExcellent}>Excellent</span>;
  if (percent >= 65)
    return <span className={resultStyles.badgeGood}>Good</span>;
  if (percent >= 45)
    return <span className={resultStyles.badgeAverage}>Average</span>;

  return (
    <span className={resultStyles.badgeNeedsWork}>Needs Work</span>
  );
};

const Myresult = ({ apiBase = "https://tech-quize-application.vercel.app" }) => {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTechnology, setSelectedTechnology] =
    useState("all");
  const [technologies, setTechnologies] = useState([]);

  const getAuthHeader = useCallback(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  // Effect: fetch results when component mounts or when selectedTechnology changes
  useEffect(() => {
    let mounted = true;

    const fetchResults = async (tech = "all") => {
      setLoading(true);
      setError(null);

      try {
        const q =
          tech && tech.toLowerCase() !== "all"
            ? `?technology=${encodeURIComponent(tech)}`
            : "";

        const res = await axios.get(
          `${apiBase}/api/results${q}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...getAuthHeader(),
            },
            timeout: 10000,
          }
        );

        if (!mounted) return;

        if (res.status === 200 && res.data && res.data.success) {
          setResults(
            Array.isArray(res.data.results)
              ? res.data.results
              : []
          );
        } else {
          setResults([]);
          toast.warn(
            "Unexpected server response while fetching results."
          );
        }
      } catch (error) {
        console.error(
          "Failed to fetch results",
          error?.response?.data || error.message || error
        );
        if (!mounted) return;

        if (error?.response?.status === 401) {
          setError(
            "Not authenticated. please log in to view results"
          );
          toast.error("Not authenticated. please login");
        } else {
          setError("Could not load results from server.");
          toast.error("Could not load results from server");
          setResults([]);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchResults(selectedTechnology);

    return () => {
      mounted = false;
    };
  }, [apiBase, selectedTechnology, getAuthHeader]);

  // Effect: fetch all results once to build a list of available technologies
  useEffect(() => {
    let mounted = true;

    const fetchAllForTechList = async () => {
      try {
        const res = await axios.get(`${apiBase}/api/results`, {
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader(),
          },
          timeout: 10000,
        });

        if (!mounted) return;

        if (res.status === 200 && res.data && res.data.success) {
          const all = Array.isArray(res.data.results)
            ? res.data.results
            : [];
          const set = new Set();
          all.forEach((r) => {
            if (r.technology) set.add(r.technology);
          });
          const arr = Array.from(set).sort((a, b) =>
            a.localeCompare(b)
          );
          console.log("technologies from API:", arr);
          setTechnologies(arr);
        } else {
          // leave technologies empty - will show fallback from results if present
        }
      } catch (error) {
        console.error(
          "Failed to fetch technologies",
          error?.response?.data || error.message || error
        );
      }
    };

    fetchAllForTechList();

    return () => {
      mounted = false;
    };
  }, [apiBase, getAuthHeader]);

  const makeKey = (r) =>
    r && r._id ? r._id : `${r.id}||${r.title}`;

  // summary is memoized so it only recalculates when results change
  const summary = useMemo(() => {
    const source = Array.isArray(results) ? results : [];
    const totalQs = source.reduce(
      (s, r) => s + (Number(r.totalQuestions) || 0),
      0
    );
    const totalCorrect = source.reduce(
      (s, r) => s + (Number(r.correct) || 0),
      0
    );
    const totalWrong = source.reduce(
      (s, r) => s + (Number(r.wrong) || 0),
      0
    );
    const pct = totalQs
      ? Math.round((totalCorrect / totalQs) * 100)
      : 0;
    return { totalQs, totalCorrect, totalWrong, pct };
  }, [results]);

  // group results by the first word of the title (used as track)
  const grouped = useMemo(() => {
    const src = Array.isArray(results) ? results : [];
    const map = {};
    src.forEach((r) => {
      const track = (r.title || "").split(" ")[0] || "General";
      if (!map[track]) map[track] = [];
      map[track].push(r);
    });
    return map;
  }, [results]);

  // Handler called when user clicks a technology filter button
  const handleSelectTech = (tech) => {
    setSelectedTechnology(tech || "all");
  };

  return (
    <div className={resultStyles.pageContainer}>
      <div className={resultStyles.container}>
        <header className={resultStyles.header}>
          <div>
            <h1 className={resultStyles.title}>Quiz Results</h1>
            {/* Example summary usage, if you want to show it */}
            {summary.totalQs > 0 && (
              <p className={resultStyles.summaryText}>
                Total Questions: {summary.totalQs} • Correct:{" "}
                {summary.totalCorrect} • Wrong: {summary.totalWrong} •{" "}
                <Badge percent={summary.pct} />
              </p>
            )}
          </div>

          <div className={resultStyles.headerControls}>
            {/* You can put a "Go to Dashboard" button or similar here */}
          </div>
        </header>

        {/* Filter bar */}
        <div className={resultStyles.filterContainer}>
          <div className={resultStyles.filterContent}>
            <div className={resultStyles.filterRow || ""}>
              <span className={resultStyles.filterLabel}>
                Filter by tech:
              </span>

              {/* "All" button */}
              <button
                onClick={() => handleSelectTech("all")}
                className={`${resultStyles.filterButton} ${
                  selectedTechnology === "all"
                    ? resultStyles.filterButtonActive
                    : resultStyles.filterButtonInactive
                }`}
                aria-pressed={selectedTechnology === "all"}
              >
                All
              </button>

              {/* Dynamic technology buttons from technologies list */}
              {technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => handleSelectTech(tech)}
                  className={`${resultStyles.filterButton} ${
                    selectedTechnology === tech
                      ? resultStyles.filterButtonActive
                      : resultStyles.filterButtonInactive
                  }`}
                  aria-pressed={selectedTechnology === tech}
                >
                  {tech}
                </button>
              ))}

              {/* Fallback: derive technologies from current results if technologies[] is empty */}
              {technologies.length === 0 &&
                Array.isArray(results) &&
                results.length > 0 &&
                [
                  ...new Set(
                    results
                      .map((r) => r.technology)
                      .filter(Boolean)
                  ),
                ].map((tech) => (
                  <button
                    key={`fallback-${tech}`}
                    onClick={() => handleSelectTech(tech)}
                    className={`${resultStyles.filterButton} ${
                      selectedTechnology === tech
                        ? resultStyles.filterButtonActive
                        : resultStyles.filterButtonInactive
                    }`}
                    aria-pressed={selectedTechnology === tech}
                  >
                    {tech}
                  </button>
                ))}
            </div>

            <div className={resultStyles.filterStatus}>
              {selectedTechnology === "all"
                ? "Showing all technologies"
                : `Filtering: ${selectedTechnology}`}
            </div>
          </div>
        </div>

        {/* Main content */}
        {loading ? (
          <div className={resultStyles.loadingContainer}>
            <div className={resultStyles.loadingSpinner}>
              <div className={resultStyles.loadingText}>
                Loading results ...
              </div>
            </div>
          </div>
        ) : error ? (
          <div className={resultStyles.errorContainer}>
            <p className={resultStyles.errorText}>{error}</p>
          </div>
        ) : !results || results.length === 0 ? (
          <div className={resultStyles.emptyState}>
            <p className={resultStyles.emptyStateText}>
              No results found yet. Take a quiz to see your results here.
            </p>
          </div>
        ) : (
          <>
            {Object.entries(grouped).map(([track, items]) => (
              <section
                key={track}
                className={resultStyles.trackSection}
              >
                <h2 className={resultStyles.trackTitle}>
                  {track} Track
                </h2>

               <div className={resultStyles.resultsGrid}>
                {items.map((r)=>(
                    <StripCard key={makeKey(r)} item={r} />
                ))}
               </div>
              </section>
            ))}
            
            {Array.isArray(results) && results.length === 0 && !error && (
                <div className={resultStyles.emptyState}>
                 No results yet. Take a quiz to see results here.
                </div>
            )}

          </>
        )}
      </div>
    </div>
  );
};

{/* strip cart */}
function StripCard({item}){
 const percent = item.totalQuestions
 ? Math.round((Number(item.correct) / Number(item.totalQuestions)) * 100) : 0;

 const getLevel = (it) =>{
    const id = (it.id || "").toString().toLowerCase();
    const title = (it.id || "").toString().toLowerCase();
    if(id.includes("basic") || title.includes("basic"))
      return {letter: "B", Style: resultStyles.levelBasic};
    if(id.includes("intermediate") || title.includes("intermediate"))
      return {letter: "I", Style: resultStyles.levelIntermediate};

    return {letter:"A", style:resultStyles.levelAdvanced};
    };
    const level= getLevel(item);
    return (
      <article className={resultStyles.card}>
         <div className={resultStyles.cardAccent}></div>
         <div className={resultStyles.cardContent}>
              <div className={resultStyles.cardHeader}>
                 <div className={resultStyles.cardInfo}>
                   <div className={`${resultStyles.levelAvatar} ${level.style}`}>
                    {level.letter}
                   </div>
                  <div className={resultStyles.cardText}>
                     <h3 className={resultStyles.cardTitle}>{item.title}</h3>

                     <div className={resultStyles.cardMeta}>
                        {item.totalQuestions} Qs
                        {item.timeSpent ? `* ${item.timeSpent}` : ""}
                     </div>
                  </div>
                 </div>

                 <div className={resultStyles.cardPerformance}>
                   <div className={resultStyles.performanceLabel}>Performance</div>
                   <div className={resultStyles.badgeContainer}>
                     <Badge percent={percent} />
                   </div>
                 </div>
              </div>

              <div className={resultStyles.cardStats}>
                 <div className={resultStyles.statItem}>
                     Correct:
                 
                 <span className={resultStyles.statNumber}>{item.correct}</span> 
                 </div>

                  <div className={resultStyles.statItem}>
                     Wrong:
                 
                 <span className={resultStyles.statNumber}>{item.wrong}</span> 
                 </div>

                  <div className={resultStyles.statItem}>
                     Score:
                 
                 <span className={resultStyles.statNumber}>{percent}%</span> 
                 </div>
              </div>
         </div>
      </article>
    )
}
export default Myresult;

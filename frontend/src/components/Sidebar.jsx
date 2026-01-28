import axios from "axios";
import {
  Award,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Code,
  Coffee,
  Cpu,
  Database,
  Globe,
  Layout,
  Menu,
  Sparkles,
  Star,
  Target,
  Terminal,
  Trophy,
  X,
  XCircle,
  Zap,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { sidebarStyles } from "../assets/dummyStyles";
import questionsData from "../assets/dummydata.js";

const API_BASE = "https://tech-quize-application.vercel.app";

const Sidebar = () => {
  const [selectedTech, setSelectedTech] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState({});
  const [showResults, setShowResults] = useState(false);
  const submittedRef = useRef(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const asideRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
      else setIsSidebarOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      if (isSidebarOpen) document.body.style.overflow = "hidden";
      else document.body.style.overflow = "";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isSidebarOpen]);

  // techs
  const technologies = [
    {
      id: "html",
      name: "HTML",
      icon: <Globe size={20} />,
      color: "bg-blue-50 text-orange-600 border-orange-200",
    },
    {
      id: "css",
      name: "CSS",
      icon: <Layout size={20} />,
      color: "bg-blue-50 text-orange-600 border-orange-200",
    },
    {
      id: "js",
      name: "JavaScript",
      icon: <Code size={20} />,
      color: "bg-blue-50 text-orange-600 border-orange-200",
    },
    {
      id: "react",
      name: "React",
      icon: <Cpu size={20} />,
      color: "bg-blue-50 text-orange-600 border-orange-200",
    },
    {
      id: "node",
      name: "Node.Js",
      icon: <Code size={20} />,
      color: "bg-blue-50 text-orange-600 border-orange-200",
    },
    {
      id: "mongodb",
      name: "MongoDB",
      icon: <Database size={20} />,
      color: "bg-blue-50 text-orange-600 border-orange-200",
    },
    {
      id: "java",
      name: "Java",
      icon: <Coffee size={20} />,
      color: "bg-blue-50 text-orange-600 border-orange-200",
    },
    {
      id: "python",
      name: "Python",
      icon: <Terminal size={20} />,
      color: "bg-blue-50 text-orange-600 border-orange-200",
    },
    {
      id: "cpp",
      name: "C++",
      icon: <Code size={20} />,
      color: "bg-blue-50 text-orange-600 border-orange-200",
    },
    {
      id: "bootstrap",
      name: "Bootstrap",
      icon: <Layout size={20} />,
      color: "bg-blue-50 text-orange-600 border-orange-200",
    },
  ];

  const levels = [
    {
      id: "basic",
      name: "Basic",
      questions: 20,
      icon: <Star size={16} />,
      color: "bg-green-50 text-green-600",
    },
    {
      id: "intermediate",
      name: "Intermediate",
      questions: 40,
      icon: <Zap size={16} />,
      color: "bg-green-50 text-green-600",
    },
    {
      id: "advanced",
      name: "Advance",
      questions: 60,
      icon: <Target size={16} />,
      color: "bg-green-50 text-green-600",
    },
  ];

  // handle what you select tech
  const handleTechSelect = (techId) => {
    if (selectedTech === techId) {
      setSelectedTech(null);
      setSelectedLevel(null);
    } else {
      setSelectedTech(techId);
      setSelectedLevel(null);
    }
    setCurrentQuestion(0);
    setUserAnswer({});
    setShowResults(false);
    submittedRef.current = false;
    if (window.innerWidth < 768) setIsSidebarOpen(true);

    setTimeout(() => {
      const el = asideRef.current?.querySelector(`[data-tech="${techId}"]`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 120);
  };

  const handleLevelSelect = (levelId) => {
    setSelectedLevel(levelId);
    setCurrentQuestion(0);
    setUserAnswer({});
    setShowResults(false);
    submittedRef.current = false;
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const getQuestions = () => {
    if (!selectedTech || !selectedLevel) return [];
    return questionsData[selectedTech]?.[selectedLevel] || [];
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = { ...userAnswer, [currentQuestion]: answerIndex };
    setUserAnswer(newAnswers);
    const qs = getQuestions();
    setTimeout(() => {
      if (currentQuestion < qs.length - 1)
        setCurrentQuestion((prev) => prev + 1);
      else setShowResults(true);
    }, 500);
  };

  // calculate score
  const calculateScore = () => {
    const questions = getQuestions();
    let correct = 0;
    questions.forEach((question, index) => {
      if (userAnswer[index] == question.correctAnswer) correct++;
    });
    return {
      correct,
      total: questions.length,
      percentage: questions.length
        ? Math.round((correct / questions.length) * 100)
        : 0,
    };
  };

  const questions = getQuestions();
  const currentQ = questions[currentQuestion];
  const score = calculateScore();

  const getPerformanceStatus = () => {
    if (score.percentage >= 90)
      return {
        text: "Outstanding!",
        color: "bg-gradient-to-r from-amber-200 to-amber-300",
        icon: <Sparkles className="text-amber-800" />,
      };
    if (score.percentage >= 75)
      return {
        text: "Excellent!",
        color: "bg-gradient-to-r from-blue-200 to-indigo-300",
        icon: <Trophy className="text-amber-800" />,
      };
    if (score.percentage >= 60)
      return {
        text: "Good Job!",
        color: "bg-gradient-to-r from-green-200 to-teal-300",
        icon: <Award className="text-amber-800" />,
      };
    return {
      text: "Keep Practicing!",
      color: "bg-gradient-to-r from-gray-200 to-gray-300",
      icon: <BookOpen className="text-amber-800" />,
    };
  };

  const performance = getPerformanceStatus();
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const getAuthHeader = () => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("authToken") ||
      null;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const submitResult = useCallback(async () => {
    if (submittedRef.current) return;
    if (!selectedTech || !selectedLevel) return;

    const payload = {
      title: `${selectedTech.toUpperCase()} - ${
        selectedLevel.charAt(0).toUpperCase() + selectedLevel.slice(1)
      } quize`,
      technology: selectedTech,
      level: selectedLevel,
      totalQuestions: score.total,
      correct: score.correct,
      wrong: score.total - score.correct,
    };

    try {
      submittedRef.current = true;
      toast.info("Saving your result..");
      const res = await axios.post(`${API_BASE}/api/results`, payload, {
        headers: { "Content-Type": "application/json", ...getAuthHeader() },
        timeout: 10000,
      });
      if (res.data && res.data.success) toast.success("Result saved!");
      else {
        toast.warn("Result not saved.");
        submittedRef.current = false;
      }
    } catch (error) {
      submittedRef.current = false;
      console.error(
        "error saving result",
        error?.response?.data || error.message || error
      );
      toast.error("Could not save result. Check console or network.");
    }
  }, [selectedTech, selectedLevel, score]);

  useEffect(() => {
    if (showResults) submitResult();
  }, [showResults, submitResult]);

  return (
    <div className={sidebarStyles.pageContainer}>
      {isSidebarOpen && (
        <div
          onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
          className={sidebarStyles.mobileOverlay}
        ></div>
      )}

      <div className={sidebarStyles.mainContainer}>
        <aside
          ref={asideRef}
          className={`${sidebarStyles.sidebar} ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className={sidebarStyles.sidebarHeader}>
            <div className={sidebarStyles.headerDecoration1}></div>
            <div className={sidebarStyles.headerDecoration2}></div>
            <div className={sidebarStyles.headerContent}>
              <div className={sidebarStyles.logoContainer}>
                <div className={sidebarStyles.logoIcon}>
                  <BookOpen size={28} className="text-indigo-700" />
                </div>
                <div>
                  <h1 className={sidebarStyles.logoTitle}>Mern Quiz App</h1>
                  <p className={sidebarStyles.logoSubtitle}>
                    Test your knowledge & improve skills
                  </p>
                </div>
              </div>
              <button
                onClick={toggleSidebar}
                className={sidebarStyles.closeButton}
              >
                {" "}
                <X size={20} />
              </button>
            </div>
          </div>
          <div className={sidebarStyles.sidebarContent}>
            <div className={sidebarStyles.technologiesHeader}>
              <h2 className={sidebarStyles.technologiesTitle}>Technologies</h2>
              <span className={sidebarStyles.technologiesCount}>
                {technologies.length} options
              </span>
            </div>
            {technologies.map((tech) => (
              <div
                key={tech.id}
                className={sidebarStyles.techItem}
                data-tech={tech.id}
              >
                <button
                  onClick={() => handleTechSelect(tech.id)}
                  className={`${sidebarStyles.techButton} ${
                    selectedTech === tech.id
                      ? `${tech.color} ${sidebarStyles.techButtonSelected}`
                      : sidebarStyles.techButtonNormal
                  }`}
                >
                  <div className={sidebarStyles.techButtonContent}>
                    <span className={`{sidebarStyles.techIcon} ${tech.color}`}>
                      {tech.icon}
                    </span>
                    <span className={sidebarStyles.techName}>{tech.name}</span>
                  </div>
                  {selectedTech === tech.id ? (
                    <ChevronDown size={18} className="text-current" />
                  ) : (
                    <ChevronRight size={18} className="text-gray-400" />
                  )}
                </button>
                {selectedTech === tech.id && (
                  <div className={sidebarStyles.levelsContainer}>
                    <h3 className={sidebarStyles.levelsTitle}>
                      <span>Select Difficulty</span>
                      <span className={sidebarStyles.techBadge}>
                        {technologies.find((t) => t.id === selectedTech).name}
                      </span>
                    </h3>
                    {levels.map((level) => (
                      <button
                        key={level.id}
                        onClick={() => handleLevelSelect(level.id)}
                        className={`${sidebarStyles.levelButton} ${
                          selectedLevel === level.id
                            ? `${level.color} ${sidebarStyles.levelButtonSelected}`
                            : sidebarStyles.levelButtonNormal
                        }`}
                      >
                        <div className={sidebarStyles.levelButtonContent}>
                          <span
                            className={`${sidebarStyles.levelIcon} ${
                              selectedLevel === level.id
                                ? "bg-white/40"
                                : "bg-gray-100"
                            }`}
                          >
                            {level.icon}
                          </span>
                          <span>{level.name}</span>
                        </div>
                        <span className={sidebarStyles.levelQuestions}>
                          {level.questions} Qs
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={sidebarStyles.sidebarFooter}>
            <div className={sidebarStyles.footerContent}>
              <div className={sidebarStyles.footerContentCenter}>
                <p>Master your skills one quiz at a time</p>
                <p className={sidebarStyles.footerHighlight}>
                  Keep Learning, Keep Growing!
                </p>
              </div>
            </div>
          </div>
        </aside>
        {/* Question and answer also result*/}
        <main className={sidebarStyles.mainContent}>
          <div className={sidebarStyles.mobileHeader}>
            <button
              onClick={toggleSidebar}
              className={sidebarStyles.menuButton}
            >
              <Menu size={20} />
            </button>
            <div className={sidebarStyles.mobileTitle}>
              {selectedTech ? (
                <div className={sidebarStyles.mobileTechInfo}>
                  <div
                    className={`${sidebarStyles.mobileTechIcon} ${
                      technologies.find((t) => t.id === selectedTech).color
                    }`}
                  >
                    {technologies.find((t) => t.id === selectedTech).icon}
                  </div>
                  <div className={sidebarStyles.mobileTechText}>
                    <div className={sidebarStyles.mobileTechName}>
                      {technologies.find((t) => t.id === selectedTech).name}
                    </div>
                    <div className={sidebarStyles.mobileTechLevel}>
                      {selectedLevel
                        ? `${
                            selectedLevel.charAt(0).toUpperCase() +
                            selectedLevel.slice(1)
                          } level`
                        : "Select level"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={sidebarStyles.mobilePlaceholder}>
                  Select a technology from the menu
                </div>
              )}
            </div>
          </div>

          {selectedTech && !selectedLevel && (
            <div className={sidebarStyles.mobileLevels}>
              <div className={sidebarStyles.mobileLevelsContainer}>
                {levels.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => handleLevelSelect(l.id)}
                    className={sidebarStyles.mobileLevelButton}
                  >
                    {l.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!selectedTech ? (
            <div className={sidebarStyles.welcomeContainer}>
              <div className={sidebarStyles.welcomeContent}>
                <div className={sidebarStyles.welcomeIcon}>
                  <Award size={64} className="text-indigo-700" />
                </div>
                <h2 className={sidebarStyles.welcomeTitle}>
                  Welcome to Mern Quiz App
                </h2>
                <p className={sidebarStyles.welcomeDescription}>
                  Select a technology from the sidebar to start your quiz
                  joruney. Test your knowledge at basic, intermediate, or
                  advance levels.
                </p>

                <div className={sidebarStyles.featuresGrid}>
                  <div className={sidebarStyles.featureCard}>
                    <div className={sidebarStyles.featureIcon}>
                      <Star size={20} />
                    </div>
                    <h3 className={sidebarStyles.featureTitle}>
                      Multiple Technologies
                    </h3>
                    <p className={sidebarStyles.featureDescription}>
                      HTML,CSS,JavaScript, React and more
                    </p>
                  </div>

                  <div className={sidebarStyles.featureCard}>
                    <div className={sidebarStyles.featureIcon}>
                      <Zap size={20} />
                    </div>

                    <h3 className={sidebarStyles.featureTitle}>
                      Three Difficulty Levels
                    </h3>
                    <p className={sidebarStyles.featureDescription}>
                      Basic, Intermediate and Advanced Challenges
                    </p>
                  </div>

                  <div className={sidebarStyles.featureCard}>
                    <div className={sidebarStyles.featureIcon}>
                      <Target size={20} />
                    </div>

                    <h3 className={sidebarStyles.featureTitle}>
                      Instant Feedback
                    </h3>
                    <p className={sidebarStyles.featureDescription}>
                      Get detailed results and performance analysis
                    </p>
                  </div>
                </div>
                <div className={sidebarStyles.welcomePrompt}>
                  <p className={sidebarStyles.welcomePromptText}>
                    <Sparkles size={16} className="mr-2" />
                    Select any technology to begin your learning adventure!
                  </p>
                </div>
              </div>
            </div>
          ) : !selectedLevel ? (
            <div className={sidebarStyles.levelSelectionContainer}>
              <div className={sidebarStyles.levelSelectionContent}>
                <div
                  className={`${sidebarStyles.techSelectionIcon} ${
                    technologies.find((t) => t.id === selectedTech).color
                  }`}
                >
                  {technologies.find((t) => t.id === selectedTech).icon}
                </div>
                <h2 className={sidebarStyles.techSelectionTitle}>
                  {technologies.find((t) => t.id === selectedTech).name} Quiz
                </h2>
                <p className={sidebarStyles.techSelectionDescription}>
                  Select a difficulty level to begin your challenge
                </p>

                <div className={sidebarStyles.techSelectionPrompt}>
                  <p className={sidebarStyles.techSelectionPromptText}>
                    Get ready to test your{" "}
                    {technologies.find((t) => t.id === selectedTech).name}{" "}
                    knowledge
                  </p>
                </div>
              </div>
            </div>
          ) : showResults ? (
            <div className={sidebarStyles.resultsContainer}>
              <div className={sidebarStyles.resultsContent}>
                <div className={sidebarStyles.resultsHeader}>
                  <div
                    className={`${sidebarStyles.performanceIcon} ${performance.color}`}
                  >
                    {performance.icon}
                  </div>
                  <h2 className={sidebarStyles.resultsTitle}>
                    Quiz Completed!
                  </h2>
                  <p className={sidebarStyles.resultsSubtitle}>
                    you've completed the {selectedLevel} level
                  </p>
                  <div
                    className={`${sidebarStyles.performanceBadge} ${performance.color}`}
                  >
                    {performance.text}
                  </div>

                  <div className={sidebarStyles.scoreGrid}>
                    <div className={sidebarStyles.scoreCard}>
                      <div className={sidebarStyles.scoreIcon}>
                        <CheckCircle size={24} />
                      </div>
                      <p className={sidebarStyles.scoreNumber}>
                        {score.correct}
                      </p>
                      <p className={sidebarStyles.scoreLabel}>Correct Answer</p>
                    </div>

                    <div className={sidebarStyles.scoreCard}>
                      <div className={sidebarStyles.scoreIcon}>
                        <XCircle size={24} />
                      </div>
                      <p className={sidebarStyles.scoreNumber}>
                        {score.total - score.correct}
                      </p>
                      <p className={sidebarStyles.scoreLabel}>
                        Incorrect Answers
                      </p>
                    </div>
                  </div>

                  <div className={sidebarStyles.scoreProgress}>
                    <div className={sidebarStyles.scoreProgressHeader}>
                      <span className={sidebarStyles.scoreProgressPercentage}>
                        {score.percentage}%
                      </span>
                    </div>
                    <div className={sidebarStyles.scoreProgressBar}>
                      <div
                        className={`${sidebarStyles.scoreProgressFill} ${
                          score.percentage >= 80
                            ? "bg-green-400"
                            : score.percentage >= 60
                            ? "bg-yellow-400"
                            : "bg-red-400"
                        }`}
                        style={{ width: `${score.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : currentQ ? (
            <div className={sidebarStyles.quizContainer}>
              <div className={sidebarStyles.quizHeader}>
                <div className={sidebarStyles.quizTitleContainer}>
                  <h1 className={sidebarStyles.quizTitle}>
                    {technologies.find((t) => t.id === selectedTech).name} -{" "}
                    {selectedLevel.charAt(0).toUpperCase() +
                      selectedLevel.slice(1)}{" "}
                    Level
                  </h1>
                  <span className={sidebarStyles.quizCounter}>
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                </div>

                <div className={sidebarStyles.progressBar}>
                  <div
                    className={sidebarStyles.progressFill}
                    style={{
                      width: `${
                        ((currentQuestion + 1) / (questions.length || 1)) * 100
                      }%`,
                    }}
                  ></div>
                </div>

                <div className={sidebarStyles.questionContainer}>
                  <div className={sidebarStyles.questionHeader}>
                    <div className={sidebarStyles.questionIcon}>
                      <Target size={20} />
                    </div>
                    <h2 className={sidebarStyles.questionText}>
                      {currentQ.question}
                    </h2>
                  </div>

                  <div className={sidebarStyles.optionsContainer}>
                    {currentQ.options.map((option, index) => {
                      const isSelected = userAnswer[currentQuestion] === index;
                      const isCorrect = index === currentQ.correctAnswer;
                      const showFeedback =
                        userAnswer[currentQuestion] !== undefined;

                      return (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={userAnswer[currentQuestion] !== undefined}
                          className={`${sidebarStyles.optionButton} ${
                            isSelected
                              ? isCorrect
                                ? sidebarStyles.optionCorrect
                                : sidebarStyles.optionIncorrect
                              : showFeedback && isCorrect
                              ? sidebarStyles.optionCorrect
                              : sidebarStyles.optionNormal
                          }`}
                        >
                          <div className={sidebarStyles.optionContent}>
                            {showFeedback ? (
                              isSelected ? (
                                isCorrect ? (
                                  <CheckCircle
                                    size={20}
                                    className={sidebarStyles.optionIconCorrect}
                                  />
                                ) : (
                                  <XCircle
                                    size={20}
                                    className={
                                      sidebarStyles.optionIconIncorrect
                                    }
                                  />
                                )
                              ) : isCorrect ? (
                                <CheckCircle
                                  size={20}
                                  className={sidebarStyles.optionIconCorrect}
                                />
                              ) : (
                                <div
                                  className={sidebarStyles.optionIconEmpty}
                                ></div>
                              )
                            ) : (
                              <div className={sidebarStyles.optionIconEmpty} />
                            )}
                            <span className={sidebarStyles.optionText}>
                              {option}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={sidebarStyles.loadingContainer}>
              <div className={sidebarStyles.loadingContent}>
                <div className={sidebarStyles.loadingSpinner}></div>
                <h3 className={sidebarStyles.loadingTitle}>
                  Preparing your Quiz
                </h3>
                <p className={sidebarStyles.loadingDescription}>
                  Loading question...
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
      <style>{sidebarStyles.customStyles}</style>
    </div>
  );
};

export default Sidebar;

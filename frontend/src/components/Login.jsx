import {
  ArrowLeft,
  Eye,
  EyeOff,
  Lock,
  LogIn,
  Mail,
} from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginStyles } from "../assets/dummyStyles";

// ✅ Email validation helper
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const Login = ({ onLoginSuccess = null }) => {
  const navigate = useNavigate();

  // ✅ Correct state declarations
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const API_BASE = 'https://tech-quize-application.vercel.app';

  // ✅ Validation
  const validate = () => {
    const e = {};

    if (!email) e.email = "Email is required";
    else if (!isValidEmail(email)) e.email = "Please enter a valid email";

    if (!password) e.password = "Password is required";

    return e;
  };

  // ✅ Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    const validation = validate();
    setError(validation);

    if (Object.keys(validation).length > 0) return;

    setLoading(true);
    try {
     
      const payload = {email:email.trim().toLowerCase(), password};
     const res = await fetch(`${API_BASE}/api/auth/login`, {
  method: 'POST',
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(payload),
});

        let data = null;
        try{
          data = await res.json();
        } catch{
//  error
        }
        if(!res.ok){
          const msg = data?.message || "Login failed";
          setSubmitError(msg);
          return;
        }
       if(data?.token){
        try {
          localStorage.setItem('authToken', data.token);
          localStorage.setItem(
            'currentUser', JSON.stringify(data.user || {email: payload.email})
          )
        } catch (error) {
          // ignore error
        }
       }
        const user = data.user || {email:payload.email}
        window.dispatchEvent(
          new CustomEvent("authChanged", {detail:{user}})
        )
        if(typeof onLoginSuccess === 'function') onLoginSuccess(user);
        navigate("/", {replace:true});

   // Go to home after login
    } catch (err) {
      console.error(err);
      setSubmitError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={loginStyles.pageContainer}>
      <div className={loginStyles.bubble1}></div>
      <div className={loginStyles.bubble2}></div>

      {/* Back Button */}
      <Link to="/" className={loginStyles.backButton}>
        <ArrowLeft className={loginStyles.backButtonIcon} />
        <span className={loginStyles.backButtonText}>Home</span>
      </Link>

      {/* Login Form */}
      <div className={loginStyles.formContainer}>
        <form
          onSubmit={handleSubmit}
          className={loginStyles.form}
          noValidate
        >
          <div className={loginStyles.formWrapper}>
            <div className={loginStyles.animatedBorder}>
              <div className={loginStyles.formContent}>
                <h2 className={loginStyles.heading}>
                  <span className={loginStyles.headingIcon}>
                    <LogIn className={loginStyles.headingIconInner} />
                  </span>
                  <span className={loginStyles.headingText}>Login</span>
                </h2>

                <p className={loginStyles.subtitle}>
                  Sign in to continue to Mern Quiz App
                </p>

                {/* Email Field */}
                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>Email</span>
                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <Mail className={loginStyles.inputIconInner} />
                    </span>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error.email)
                          setError((s) => ({ ...s, email: undefined }));
                      }}
                      className={`${loginStyles.input} ${
                        error.email
                          ? loginStyles.inputError
                          : loginStyles.inputNormal
                      }`}
                      placeholder="your@example.com"
                      required
                    />
                  </div>
                  {error.email && (
                    <p className={loginStyles.errorText}>{error.email}</p>
                  )}
                </label>

                {/* Password Field */}
                <label className={loginStyles.label}>
                  <span className={loginStyles.labelText}>Password</span>
                  <div className={loginStyles.inputContainer}>
                    <span className={loginStyles.inputIcon}>
                      <Lock className={loginStyles.inputIconInner} />
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error.password)
                          setError((s) => ({ ...s, password: undefined }));
                      }}
                      className={`${loginStyles.input} ${loginStyles.passwordInput} ${
                        error.password
                          ? loginStyles.inputError
                          : loginStyles.inputNormal
                      }`}
                      placeholder="Enter your password"
                      required
                    />

                    {/* Toggle password visibility */}
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className={loginStyles.passwordToggle}
                    >
                      {showPassword ? (
                        <EyeOff className={loginStyles.passwordToggleIcon} />
                      ) : (
                        <Eye className={loginStyles.passwordToggleIcon} />
                      )}
                    </button>
                  </div>
                  {error.password && (
                    <p className={loginStyles.errorText}>{error.password}</p>
                  )}
                </label>

                {/* Submit error */}
                {submitError && (
                  <p className={loginStyles.submitError}>{submitError}</p>
                )}

                {/* Submit button */}
                <div className={loginStyles.buttonsContainer}>
                  <button
                    type="submit"
                    className={loginStyles.submitButton}
                    disabled={loading}
                  >
                    {loading ? (
                      "Signing in..."
                    ) : (
                      <>
                        <LogIn className={loginStyles.submitButtonIcon} />
                        <span className={loginStyles.submitButtonText}>
                          Sign In
                        </span>
                      </>
                    )}
                  </button>
                  <div className={loginStyles.signupContainer}>
                    <div className={loginStyles.signupContent}>
                       <span className={loginStyles.signupText}>
                        Don't have an account?
                       </span>
                       <Link to='/signup' className={loginStyles.signupLink}>Create Account</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

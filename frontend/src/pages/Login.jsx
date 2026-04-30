import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const { login, loginWithEmail, registerWithEmail, loginAsDemo, user } =
    useAuth();
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        await loginWithEmail(formData.email, formData.password);
        toast.success("Logged in successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to login");
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      try {
        await registerWithEmail(
          formData.name,
          formData.email,
          formData.password,
        );
        toast.success("Account created successfully");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to register");
      }
    }
  };

  const handleDemoLogin = async () => {
    try {
      await loginAsDemo();
      toast.success("Logged in as Demo User");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to login as demo user",
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Centered card */}
      <div className="relative z-10 w-full max-w-[400px] animate-[fadeUp_0.3s_ease_forwards]">
        {/* Logo mark */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--color-accent)] mb-5">
            <span className="font-['Syne',sans-serif] font-extrabold text-2xl text-[#0a0a0f]">
              D
            </span>
          </div>
          <h1 className="font-['Syne',sans-serif] font-extrabold text-5xl tracking-[-2px] text-[var(--color-text-base)] mb-2">
            DevQuiz
          </h1>
          <p className="text-[var(--color-muted)] text-xs font-mono tracking-wide">
            Master development skills, one quiz at a time.
          </p>
        </div>

        {/* Login card */}
        <div className="bg-[var(--color-surface)] border border-[var(--color-text-base)]/[0.07] rounded-[12px] p-8">
          {/* Tabs */}
          <div className="flex mb-6 border-b border-[var(--color-text-base)]/[0.07]">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 pb-3 text-sm font-mono font-medium transition-colors border-b-2 ${
                isLogin
                  ? "text-[var(--color-text-base)] border-[var(--color-accent)]"
                  : "text-[var(--color-muted)] border-transparent hover:text-[var(--color-text-base)]/[0.8]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 pb-3 text-sm font-mono font-medium transition-colors border-b-2 ${
                !isLogin
                  ? "text-[var(--color-text-base)] border-[var(--color-accent)]"
                  : "text-[var(--color-muted)] border-transparent hover:text-[var(--color-text-base)]/[0.8]"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
            {!isLogin && (
              <div>
                <label className="block text-[var(--color-muted)] text-xs font-mono mb-1.5 uppercase tracking-wider">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Your Name"
                  required
                  className="w-full bg-[var(--color-surface2)] border border-[var(--color-text-base)]/[0.07] rounded-lg px-4 py-3 text-sm text-[var(--color-text-base)] font-mono focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>
            )}
            <div>
              <label className="block text-[var(--color-muted)] text-xs font-mono mb-1.5 uppercase tracking-wider">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="name@example.com"
                required
                className="w-full bg-[var(--color-surface2)] border border-[var(--color-text-base)]/[0.07] rounded-lg px-4 py-3 text-sm text-[var(--color-text-base)] font-mono focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
            <div>
              <label className="block text-[var(--color-muted)] text-xs font-mono mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="••••••••"
                required
                minLength="6"
                className="w-full bg-[var(--color-surface2)] border border-[var(--color-text-base)]/[0.07] rounded-lg px-4 py-3 text-sm text-[var(--color-text-base)] font-mono focus:outline-none focus:border-[var(--color-accent)] transition-colors"
              />
            </div>
            {!isLogin && (
              <div>
                <label className="block text-[var(--color-muted)] text-xs font-mono mb-1.5 uppercase tracking-wider">
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  required
                  minLength="6"
                  className="w-full bg-[var(--color-surface2)] border border-[var(--color-text-base)]/[0.07] rounded-lg px-4 py-3 text-sm text-[var(--color-text-base)] font-mono focus:outline-none focus:border-[var(--color-accent)] transition-colors"
                />
              </div>
            )}
            <button
              type="submit"
              className="mt-2 w-full bg-[var(--color-accent)] hover:bg-[#6be65d] text-[#0a0a0f] font-mono font-bold text-sm py-3 px-4 rounded-lg transition-all duration-150 hover:-translate-y-px cursor-pointer border-0"
            >
              {isLogin ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-[var(--color-text-base)]/[0.07]" />
            <span className="text-[10px] uppercase tracking-[2px] text-[var(--color-muted)] font-mono">
              Or
            </span>
            <div className="flex-1 h-px bg-[var(--color-text-base)]/[0.07]" />
          </div>

          {/* Google sign-in */}
          <div className="flex flex-col gap-3">
            <button
              onClick={login}
              type="button"
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-mono font-medium text-sm py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition-all duration-150 hover:-translate-y-px cursor-pointer border-0"
            >
              <img
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="Google"
                className="w-5 h-5 flex-shrink-0"
              />
              Continue with Google
            </button>

            <button
              onClick={handleDemoLogin}
              type="button"
              className="w-full bg-[var(--color-surface2)] hover:bg-[var(--color-text-base)]/[0.05] text-[var(--color-text-base)] font-mono font-medium text-sm py-3 px-4 rounded-lg flex items-center justify-center transition-all duration-150 hover:-translate-y-px cursor-pointer border border-[var(--color-text-base)]/[0.1]"
            >
              Login with Demo Account
            </button>
          </div>

          {/* Browser note */}
          <div className="mt-6 px-4 py-3.5 bg-[#ffcc44]/[0.06] border border-[#ffcc44]/[0.15] rounded-lg">
            <p className="text-[11px] text-[#ffcc44] font-mono font-medium mb-2">
              Browser Configuration
            </p>
            <ul className="text-[11px] text-[var(--color-muted)] font-mono space-y-1 list-disc list-inside">
              <li>
                Disable Shields <span className="opacity-60">(Brave)</span>
              </li>
              <li>
                Allow Third-Party Cookies{" "}
                <span className="opacity-60">(Chrome, Edge)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-[10px] text-[var(--color-muted)] font-mono tracking-widest">
          © 2026 DevQuiz. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;

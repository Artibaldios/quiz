"use client";
import { signIn, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

interface LoginFormProps {
  onSuccess: () => void;
  setError: (error: string) => void;
}

interface RegisterFormProps {
  onSuccess: () => void;
  setError: (error: string) => void;
}

interface LoginFormData {
  username: string;
  password: string;
}

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

const LoginFormFields = ({ onSuccess, setError }: LoginFormProps) => {
  const [form, setForm] = useState<LoginFormData>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const t = useTranslations("login");

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username: form.username,
      password: form.password,
    });

    setLoading(false);
    if (res?.error) {
      setError("Invalid username or password");
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="login-username" className="block text-sm font-medium text-textColor mb-2">
          {t("username")}
        </label>
        <input
          id="login-username"
          name="username"
          type="text"
          required
          value={form.username}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-textColor focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none placeholder-textColor placeholder-opacity-50"
          placeholder= {t("enterUsername")}
          autoComplete="on"
        />
      </div>

      <div>
        <label htmlFor="login-password" className="block text-sm font-medium text-textColor mb-2">
          {t("password")}
        </label>
        <input
          id="login-password"
          name="password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-textColor focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none placeholder-textColor placeholder-opacity-50"
          placeholder= {t("enterPassword")}
          autoComplete="on"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-105 focus:scale-105 font-semibold shadow-lg cursor-pointer"
      >
        {loading ? t("loading") : t("signIn") }
      </button>
    </form>
  );
};

const RegisterFormFields = ({ onSuccess, setError }: RegisterFormProps) => {
  const [form, setForm] = useState<RegisterFormData>({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const t = useTranslations("login");
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simple validation
    if (form.password.length < 5) {
      setError("Password must be more than 4 characters");
      setLoading(false);
      return;
    }

    // Optional: username check too
    if (form.username.length < 3) {
      setError("Username must be at least 3 characters");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      setLoading(false);

      if (response.ok) {
        const signInRes = await signIn("credentials", {
          redirect: false,
          username: form.username,
          password: form.password,
        });
        if (signInRes?.error) {
          setError("Account created but sign-in failed. Please login manually.");
        } else {
          onSuccess();
        }
      } else {
        const data = await response.json();
        setError(data.message || t("failUserCreate"));
      }
    } catch (error) {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="register-username" className="block text-sm font-medium text-textColor mb-2">
          {t("username")}
        </label>
        <input
          id="register-username"
          name="username"
          type="text"
          required
          value={form.username}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-textColor focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none placeholder-textColor"
          placeholder={t("chooseUser")}
          autoComplete="on"
        />
      </div>

      <div>
        <label htmlFor="register-email" className="block text-sm font-medium text-textColor mb-2">
          {t("email")}
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-textColor focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none placeholder-textColor"
          placeholder={t("enterEmail")}
          autoComplete="on"
        />
      </div>

      <div>
        <label htmlFor="register-password" className="block text-sm font-medium text-textColor mb-2">
          {t("password")}
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          required
          value={form.password}
          onChange={handleChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-textColor focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none placeholder-textColor"
          placeholder={t("createPassword")}
          autoComplete="off"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition transform hover:scale-105 focus:scale-105 font-semibold shadow-lg cursor-pointer"
      >
        {loading ? t("loading") : t("createAccount")}
      </button>
    </form>
  );
};

export const LoginForm = () => {
  const t = useTranslations("login");
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const handleLoginToggle = useCallback(() => {
    setError("");
    setIsLogin(true);
  }, []);
  const handleRegisterToggle = useCallback(() => {
    setError("");
    setIsLogin(false);
  }, []);

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.replace("/");
    }
  }, [session, status, router]);

  return (
    <div className="bg-bgContent rounded-2xl shadow-xl p-8 w-full max-w-md">
      {/* Toggle Switch */}
      <div className="flex items-center justify-center mb-8">
        <div className="bg-gray-100 dark:bg-blue-900 rounded-full p-1 flex">
          <button
            onClick={handleLoginToggle}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer dark:text-textColor ${
              isLogin
                ? "bg-blue-500 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("login")}
          </button>
          <button
            onClick={handleRegisterToggle}
            className={`px-6 py-3 rounded-full font-semibold text-sm transition-all duration-300 cursor-pointer dark:text-textColor ${
              !isLogin
                ? "bg-blue-500 text-white shadow-lg transform scale-105"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            {t("register")}
          </button>
        </div>
      </div>

      <div className="relative">
        {isLogin ? (
            <LoginFormFields
              onSuccess={() => router.push("/")}
              setError={setError}
            />
        ) : (
            <RegisterFormFields
              onSuccess={() => router.push("/")}
              setError={setError}
            />
        )}
        {error && <p className="p-1 text-red-500" aria-live="polite">{error}</p>}
      </div>
    </div>
  );
};

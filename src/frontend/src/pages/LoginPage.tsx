import {
  ArrowLeft,
  BookOpen,
  Eye,
  EyeOff,
  GraduationCap,
  RefreshCw,
} from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useActor } from "../hooks/useActor";

interface Props {
  onLogin: (user: unknown) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const { actor, isFetching } = useActor();
  const actorRef = useRef(actor);
  actorRef.current = actor;
  const isFetchingRef = useRef(isFetching);
  isFetchingRef.current = isFetching;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const attemptLogin = async (user: string, pass: string): Promise<boolean> => {
    const result = await (actorRef.current as any).login(user.trim(), pass);
    if ("ok" in (result as object)) {
      onLogin((result as { ok: unknown }).ok);
      return true;
    }
    setError("Invalid username or password. Please check and try again.");
    return false;
  };

  const waitForActor = async (): Promise<boolean> => {
    const maxWait = 15000;
    const interval = 500;
    let elapsed = 0;
    while (elapsed < maxWait) {
      if (actorRef.current && !isFetchingRef.current) return true;
      await new Promise((res) => setTimeout(res, interval));
      elapsed += interval;
    }
    return false;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    setError("");
    setPendingCredentials(null);

    // If actor not ready, wait up to 15s
    if (!actorRef.current || isFetchingRef.current) {
      const ready = await waitForActor();
      if (!ready) {
        setError(
          "Server is starting up. Please wait a few seconds and try again.",
        );
        setPendingCredentials({ username, password });
        setLoading(false);
        return;
      }
    }

    try {
      const success = await attemptLogin(username, password);
      if (success) return;
    } catch {
      // First attempt failed — wait 2s and retry once
      await new Promise((res) => setTimeout(res, 2000));
      try {
        await attemptLogin(username, password);
      } catch {
        setError(
          "Server is starting up. Please wait a few seconds and try again.",
        );
        setPendingCredentials({ username, password });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = async () => {
    if (!pendingCredentials) return;
    setError("");
    setLoading(true);
    setPendingCredentials(null);

    if (!actorRef.current || isFetchingRef.current) {
      const ready = await waitForActor();
      if (!ready) {
        setError("Server is still starting up. Please try again in a moment.");
        setPendingCredentials(pendingCredentials);
        setLoading(false);
        return;
      }
    }

    try {
      await attemptLogin(
        pendingCredentials.username,
        pendingCredentials.password,
      );
    } catch {
      setError("Server is still starting up. Please try again in a moment.");
      setPendingCredentials(pendingCredentials);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Dark Navy */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 text-white relative overflow-hidden"
        style={{
          background:
            "linear-gradient(160deg, #0f172a 0%, #1e293b 60%, #0c1a3a 100%)",
        }}
      >
        {/* Decorative circles */}
        <div
          className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #6366f1, transparent)",
          }}
        />
        <div
          className="absolute bottom-[-60px] left-[-60px] w-80 h-80 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #818cf8, transparent)",
          }}
        />

        {/* Top badge */}
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold tracking-widest uppercase">
            <BookOpen className="w-4 h-4 text-indigo-300" />
            <span className="text-indigo-200">Classio Learn</span>
          </div>
        </div>

        {/* Main content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <h1 className="text-5xl font-extrabold leading-tight mb-3">
            Empower Your
            <br />
            <span
              style={{
                background: "linear-gradient(90deg, #818cf8, #c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Teachers.
            </span>
          </h1>
          <p className="text-lg text-slate-300 mb-2 font-medium">
            Transforming Classrooms.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mt-2">
            A self-paced professional development platform designed for
            educators across all grade levels.
          </p>

          {/* Stats */}
          <div className="mt-10 flex gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">10</div>
              <div className="text-slate-400 text-xs mt-1">Grade Levels</div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">40+</div>
              <div className="text-slate-400 text-xs mt-1">
                Training Modules
              </div>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-slate-400 text-xs mt-1">Self-Paced</div>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-slate-400 text-sm">Learn and Lead</p>
        </div>
      </div>

      {/* Right Panel — White */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        {/* Top nav */}
        <div className="p-6 lg:p-8 flex items-center justify-between">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
            onClick={() => {}}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </button>
          {/* Classio logo — top right */}
          <img
            src="/assets/uploads/classio_logo_reel_compressed-019d30ca-b132-705d-98da-5b01d58eace4-1.jpeg"
            alt="Classio - Learn and Lead"
            className="w-14 h-14 object-contain rounded-xl shadow"
          />
        </div>

        {/* Center form */}
        <div className="flex-1 flex flex-col items-center justify-center px-8 pb-12">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 text-center">
              <img
                src="/assets/uploads/classio_logo_reel_compressed-019d30ca-b132-705d-98da-5b01d58eace4-1.jpeg"
                alt="Classio"
                className="w-32 mx-auto rounded-xl"
              />
            </div>

            {/* Heading */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-2 mb-4">
                <GraduationCap className="w-6 h-6 text-indigo-600" />
                <span className="text-xs font-bold tracking-widest uppercase text-indigo-600">
                  Classio Learn
                </span>
              </div>
              <h1 className="text-3xl font-extrabold text-slate-900">
                Classio Login
              </h1>
              <p className="text-slate-500 mt-2 text-sm">
                Enter your credentials from your administrator
              </p>
            </div>

            {/* Connecting banner */}
            {isFetching && (
              <div
                className="mb-5 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2"
                data-ocid="login.loading_state"
              >
                <svg
                  role="img"
                  aria-label="Loading"
                  className="animate-spin h-4 w-4 shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <title>Loading</title>
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Connecting to server, please wait...
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="username"
                  className="text-slate-700 font-semibold text-sm"
                >
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="h-12 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl text-slate-900 placeholder:text-slate-400"
                  autoComplete="username"
                  data-ocid="login.input"
                />
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="password"
                  className="text-slate-700 font-semibold text-sm"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pr-11 border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 rounded-xl text-slate-900 placeholder:text-slate-400"
                    autoComplete="current-password"
                    data-ocid="login.password_input"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Help link */}
              <div className="text-right">
                <span className="text-xs text-slate-400">
                  Need help?{" "}
                  <a
                    href="mailto:admin@classiotech.com"
                    className="text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
                  >
                    Contact your administrator
                  </a>
                </span>
              </div>

              {/* Error */}
              {error && (
                <div
                  className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                  data-ocid="login.error_state"
                >
                  <p>{error}</p>
                  {pendingCredentials && (
                    <button
                      type="button"
                      onClick={handleRetry}
                      disabled={loading}
                      data-ocid="login.retry_button"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-800 underline underline-offset-2 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retry
                    </button>
                  )}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading || !username.trim() || !password}
                data-ocid="login.submit_button"
                className="w-full h-12 rounded-xl font-semibold text-base text-white transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{
                  background: loading
                    ? "#6366f1"
                    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  boxShadow: loading
                    ? "none"
                    : "0 4px 20px rgba(99,102,241,0.35)",
                }}
              >
                {loading
                  ? isFetching
                    ? "Waiting for server..."
                    : "Signing in..."
                  : isFetching
                    ? "Connecting..."
                    : "Sign in"}
              </button>
            </form>

            {/* Footer copyright */}
            <p className="mt-10 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Classio Learn. All rights reserved.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-indigo-500 transition-colors"
              >
                Built with caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

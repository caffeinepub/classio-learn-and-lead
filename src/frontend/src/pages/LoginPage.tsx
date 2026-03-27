import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { useActor } from "../hooks/useActor";

interface Props {
  onLogin: (user: unknown) => void;
}

export default function LoginPage({ onLogin }: Props) {
  const { actor, isFetching } = useActor();
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    if (!actor) {
      setError(
        "Still connecting to the server. Please wait a moment and try again.",
      );
      return;
    }
    setLoading(true);
    setError("");
    try {
      const result = await actor.login(username.trim());
      if ("ok" in (result as object)) {
        onLogin((result as { ok: unknown }).ok);
      } else {
        setError("Invalid username. Please check and try again.");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-cyan-500 flex-col items-center justify-center p-12 text-white">
        <div className="max-w-md text-center">
          <img
            src="/assets/uploads/classio_logo_reel_compressed-019d30ca-b132-705d-98da-5b01d58eace4-1.jpeg"
            alt="Classio - Learn and Lead"
            className="w-72 mx-auto mb-10 bg-white rounded-2xl p-4 shadow-xl"
          />
          <h2 className="text-3xl font-bold mb-4">Empowering Teachers.</h2>
          <h2 className="text-3xl font-bold mb-6">Transforming Classrooms.</h2>
          <p className="text-cyan-100 text-lg leading-relaxed">
            A self-paced professional development platform designed for
            educators across all grade levels.
          </p>
          <div className="mt-10 flex gap-8 justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold">10</div>
              <div className="text-cyan-100 text-sm">Grade Levels</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">40+</div>
              <div className="text-cyan-100 text-sm">Training Modules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">100%</div>
              <div className="text-cyan-100 text-sm">Self-Paced</div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
            <img
              src="/assets/uploads/classio_logo_reel_compressed-019d30ca-b132-705d-98da-5b01d58eace4-1.jpeg"
              alt="Classio"
              className="w-40 mx-auto"
            />
          </div>
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-500 mt-1">
              Sign in to your Classio account
            </p>
          </div>

          {isFetching && (
            <div className="mb-4 bg-cyan-50 border border-cyan-200 text-cyan-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
              <svg
                role="img"
                aria-label="Loading"
                className="animate-spin h-4 w-4"
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

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-700 font-medium">
                Username
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-12 border-gray-200 focus:border-cyan-500 focus:ring-cyan-500"
                autoComplete="username"
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            <Button
              type="submit"
              disabled={loading || !username.trim() || isFetching}
              className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-base disabled:opacity-60"
            >
              {loading
                ? "Signing in..."
                : isFetching
                  ? "Connecting..."
                  : "Sign In"}
            </Button>
          </form>
          <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-xs text-gray-500 font-medium mb-2">
              Demo Credentials
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Admin:</span> username ={" "}
              <code className="bg-gray-200 px-1 rounded">admin</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

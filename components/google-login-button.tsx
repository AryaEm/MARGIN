"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../utils/firebase";
import { upsertUserProfile } from "../utils/users";

export default function GoogleLoginButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    setError(null);
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await upsertUserProfile(result.user);
      router.push("/dashboard");
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError("Gagal masuk dengan Google. Coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button type="button" onClick={handleLogin} disabled={loading} className={className}>
        {loading ? "Menghubungkan..." : children}
      </button>
      {error && <p className="font-sans text-xs text-pencil">{error}</p>}
    </div>
  );
}
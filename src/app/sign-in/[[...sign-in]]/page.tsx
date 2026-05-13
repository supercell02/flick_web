import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-bold uppercase tracking-tight">Flick</h1>
        <p className="font-mono text-xs text-[#888888] uppercase tracking-widest mt-1">
          Host Sign In
        </p>
      </div>
      <SignIn />
    </div>
  );
}

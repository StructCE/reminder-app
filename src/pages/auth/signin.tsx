import { signIn } from "next-auth/react";
import Image from "next/image";
import { env } from "~/env.mjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-zinc-900">
      <div className="flex flex-col items-center gap-4 rounded-xl bg-zinc-800 p-16">
        <h1 className="text-3xl text-white">Entre com sua conta da Struct:</h1>
        <div>
          <button
            onClick={() =>
              signIn("google", { callbackUrl: env.NEXT_PUBLIC_BASE_URL })
            }
            className="flex rounded-md border-b-2 border-r-2 border-zinc-500 bg-slate-100 p-4 transition-transform hover:scale-y-[102%]"
          >
            <Image
              loading="lazy"
              src="https://authjs.dev/img/providers/google.svg"
              alt=""
              width="24"
              height="24"
            />
            <span className="mx-10 text-xl">Entre com Google</span>
          </button>
        </div>
      </div>
    </main>
  );
}

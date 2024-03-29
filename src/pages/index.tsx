import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

// import { api } from "~/utils/api";

const Home: NextPage = () => {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });

  const { data: sessionData } = useSession();

  return (
    <>
      <Head>
        <title>{"{Struct} - Lembretes"}</title>
        <meta
          name="description"
          content="Site para gerenciar lembretes das tarefas da {Struct}"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#02396d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Lembra{" "}
            <span className="text-[hsl(50,75%,50%)] underline">disso</span>, ein
          </h1>
          <div>
            {sessionData?.user && (
              <Link
                className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
                href="/reminders"
              >
                <h3 className="text-2xl font-bold">Aplicação →</h3>
                <div className="text-lg">Veja seus lembretes</div>
              </Link>
            )}
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {/* {hello.data ? hello.data.greeting : "Loading tRPC query..."} */}
            </p>
            <AuthShowcase />
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  // const { data: secretMessage } = api.example.getSecretMessage.useQuery(
  //   undefined, // no input
  //   { enabled: sessionData?.user !== undefined }
  // );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logado como {sessionData.user?.name}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sair" : "Entrar"}
      </button>
    </div>
  );
};

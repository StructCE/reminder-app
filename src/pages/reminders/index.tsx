import Head from "next/head";
import Sidebar from "~/components/Sidebar";

export default function RemindersPage() {
  return (
    <>
      <Head>
        <title>Lembretes</title>
        <meta name="description" content="Seus lembretes na Struct" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex min-h-screen bg-gradient-to-b from-[#a1cef8] to-[#15162c]">
        <Sidebar />
        <main className="bg-cyan-500"></main>
      </section>
    </>
  );
}

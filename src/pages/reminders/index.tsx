import { type Reminder as ReminderT } from "@prisma/client";
import Head from "next/head";
import { FormEventHandler, useState } from "react";
import { Reminder } from "~/components/Reminder";
import Sidebar from "~/components/Sidebar";
import { api } from "~/utils/api";

export default function RemindersPage() {
  const reminders = api.reminders.getAll.useQuery();
  const reminderMutation = api.reminders.createReminder.useMutation();

  const [creatingReminderInfo, setCreatingReminderInfo] = useState<
    Pick<ReminderT, "body">
  >({
    body: "",
  });

  const handleCreateReminder: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    reminderMutation.mutate(creatingReminderInfo);
  };

  return (
    <>
      <Head>
        <title>Lembretes</title>
        <meta name="description" content="Seus lembretes na Struct" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex min-h-screen bg-gradient-to-b from-[#a1cef8] to-[#15162c]">
        <Sidebar />
        <main className="w-full">
          <div className="mx-auto w-full xl:w-3/6">
            <ul className="flex min-h-[90vh] flex-col gap-2 rounded-xl bg-stone-500 bg-opacity-10 p-10 backdrop-blur-2xl">
              {reminders.data
                ? reminders.data.map((reminder) => (
                    <li key={reminder.id}>
                      <Reminder reminder={reminder} />
                    </li>
                  ))
                : "Carregando"}
            </ul>

            <form
              onSubmit={handleCreateReminder}
              className="flex flex-wrap items-center justify-around"
            >
              <label className="flex items-center" htmlFor="body">
                Corpo do lembrete:
              </label>
              <textarea
                className="rounded-md border-2 border-solid border-slate-900 bg-white p-2 text-zinc-900 "
                id="body"
                onChange={(e) =>
                  setCreatingReminderInfo({ body: e.target.value })
                }
              />
              <button
                className="rounded-md border-2 border-solid border-slate-400 bg-slate-400 p-2"
                type="submit"
              >
                Criar
              </button>
            </form>
          </div>
        </main>
      </section>
    </>
  );
}

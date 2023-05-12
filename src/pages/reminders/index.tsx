import { type Reminder as ReminderT } from "@prisma/client";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { Paperclip } from "lucide-react";
import Head from "next/head";
import { FormEventHandler, useState } from "react";
import { Reminder } from "~/components/Reminder";
import SecurePageWrapper from "~/components/SecurePageWrapper";
import Sidebar from "~/components/Sidebar";
import { api } from "~/utils/api";

export default function RemindersPage() {
  const [showCompleted, setShowCompleted] = useState(false);

  const utils = api.useContext();
  const reminders = api.reminders.getAll.useQuery();
  const shownReminders = reminders.data?.filter(
    (r) => r.completed === showCompleted
  );

  const reminderCreateMutation = api.reminders.createReminder.useMutation({
    onSuccess() {
      utils.reminders.getAll.refetch();
    },
  });
  const reminderDeleteMutation = api.reminders.deleteReminder.useMutation({
    onSuccess() {
      utils.reminders.getAll.refetch();
    },
  });
  const reminderUpdateMutation = api.reminders.updateReminder.useMutation({
    onSuccess() {
      utils.reminders.getAll.refetch();
    },
  });

  const [creatingReminderInfo, setCreatingReminderInfo] = useState<
    Pick<ReminderT, "body">
  >({
    body: "",
  });

  const handleCreateReminder: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    reminderCreateMutation.mutateAsync(creatingReminderInfo);
    utils.reminders.invalidate();
  };

  function handleDeleteReminder(id: string) {
    reminderDeleteMutation.mutate({ reminderId: id });
    return;
  }

  function handleUpdateReminder(reminder: ReminderT) {
    reminderUpdateMutation.mutate({ reminder });
    return;
  }

  return (
    <SecurePageWrapper>
      <Head>
        <title>Lembretes</title>
        <meta name="description" content="Seus lembretes na Struct" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex h-screen bg-gradient-to-b from-[#5ba7ee] to-[#15162c]">
        <Sidebar />
        <main className="w-full overflow-scroll bg-stone-500 bg-opacity-10 py-6 backdrop-blur-2xl">
          <div className="mx-auto w-full xl:w-3/6">
            <h1 className="text-7xl">Lembretes</h1>
            <RadioGroup.Root
              className="flex justify-around"
              value={showCompleted ? "completed" : "pending"}
              onValueChange={(v) => setShowCompleted(v === "completed")}
              aria-label="View density"
            >
              <RadioGroup.Item
                className="relative flex gap-1 rounded-md p-2"
                value="pending"
                id="r1"
              >
                <Paperclip />
                <RadioGroup.Indicator className="absolute inset-0 -z-10 rounded-md bg-blue-950 bg-opacity-30" />
                <label className="cursor-pointer" htmlFor="r1">
                  Pendentes
                </label>
              </RadioGroup.Item>
              <RadioGroup.Item
                className="relative flex gap-1 rounded-md p-2"
                value="completed"
                id="r2"
              >
                <Paperclip />
                <RadioGroup.Indicator className="absolute inset-0 -z-10 rounded-md bg-blue-950 bg-opacity-30" />
                <label className="cursor-pointer" htmlFor="r2">
                  Concluídos
                </label>
              </RadioGroup.Item>
            </RadioGroup.Root>

            <ul className="flex min-h-[80vh] flex-col rounded-xl">
              {shownReminders
                ? shownReminders.map((reminder) => (
                    <li key={reminder.id}>
                      <Reminder
                        reminder={reminder}
                        handleDeleteReminder={handleDeleteReminder}
                        handleUpdateReminder={handleUpdateReminder}
                      />
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
    </SecurePageWrapper>
  );
}

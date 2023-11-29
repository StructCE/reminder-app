import { type Reminder as ReminderT } from "@prisma/client";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { LogOut, Paperclip } from "lucide-react";
import Head from "next/head";
import { useRouter } from "next/router";
import { type FormEvent, useState } from "react";
import { CreateReminder } from "~/components/CreateReminder";
import { Reminder } from "~/components/Reminder";
import SecurePageWrapper from "~/components/SecurePageWrapper";
import { DragNDropContextProvider } from "~/hooks/useDragNDrop";
import { type RouterInputs, api } from "~/utils/api";

function compareReminderSort(a: string, b: string) {
  return a < b ? -1 : a === b ? 0 : 1;
}

export default function RemindersPage() {
  const [showCompleted, setShowCompleted] = useState(false);

  const utils = api.useUtils();
  const reminders = api.reminders.getAll.useQuery();
  const shownReminders =
    reminders.data
      ?.filter((r) => r.completed === showCompleted)
      .toSorted((a, b) => compareReminderSort(a.sortedBy, b.sortedBy)) ?? [];

  const reminderCreateMutation = api.reminders.createReminder.useMutation({
    onSuccess() {
      void utils.reminders.getAll.refetch();
    },
    onError() {
      alert("Ocorreu um erro ao tentar criar o lembrete...");
    },
  });
  const reminderDeleteMutation = api.reminders.deleteReminder.useMutation({
    onSuccess() {
      void utils.reminders.getAll.refetch();
    },
    onError() {
      alert("Ocorreu um erro ao tentar deletar o lembrete...");
    },
  });
  const reminderUpdateMutation = api.reminders.updateReminder.useMutation({
    onSuccess() {
      void utils.reminders.getAll.refetch();
    },
    onError() {
      alert("Ocorreu um erro ao tentar fazer update do lembrete...");
    },
  });

  const reorderMutation = api.reminders.updateSortedBy.useMutation({
    onSuccess() {
      void utils.reminders.getAll.refetch();
    },
    onError() {
      alert("Ocorreu um erro ao tentar reordenar os lembretes...");
    },
  });

  function reorder(index: number, toIndex: number) {
    const reminderId = shownReminders[index]?.id;
    if (!reminderId) return;
    if (index === toIndex) return;

    let previous: string | undefined;
    let next: string | undefined;
    if (index > toIndex) {
      previous = shownReminders[toIndex - 1]?.sortedBy;
      next = shownReminders[toIndex]?.sortedBy;
    } else {
      previous = shownReminders[toIndex]?.sortedBy;
      next = shownReminders[toIndex + 1]?.sortedBy;
    }

    reorderMutation.mutate({ reminderId, previous, next });
  }

  const [creatingReminderInfo, setCreatingReminderInfo] = useState<
    Omit<RouterInputs["reminders"]["createReminder"], "lastSortedBy">
  >({
    body: "",
  });

  const handleCreateReminder: (e: FormEvent) => Promise<ReminderT> = async (
    e
  ) => {
    e.preventDefault();
    return reminderCreateMutation.mutateAsync({
      ...creatingReminderInfo,
      lastSortedBy: shownReminders[shownReminders?.length - 1]?.sortedBy ?? "m",
    });
  };

  function handleDeleteReminder(id: string) {
    reminderDeleteMutation.mutate({ reminderId: id });
    return;
  }

  function handleUpdateReminder(reminder: ReminderT) {
    reminderUpdateMutation.mutate({ reminder });
    return;
  }
  const router = useRouter();

  return (
    <SecurePageWrapper>
      <Head>
        <title>Lembretes</title>
        <meta name="description" content="Seus lembretes na Struct" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="min-h-screen bg-gradient-to-b from-[rgb(9,20,36)] to-[rgb(11,27,52)]">
        <button
          onClick={() => router.back()}
          className="w-max justify-around p-2 text-xl text-white hover:bg-[rgba(0,0,0,0.3)]"
        >
          <LogOut className="rotate-180 text-amber-500" />
        </button>
        <main className="h-full w-full overflow-scroll px-2 py-2">
          <div className="mx-auto flex h-full w-full flex-col xl:w-3/6">
            <RadioGroup.Root
              className="ml-auto flex gap-4 p-3 md:ml-0"
              value={showCompleted ? "completed" : "pending"}
              onValueChange={(v) => setShowCompleted(v === "completed")}
              aria-label="View density"
            >
              <RadioGroup.Item
                className="relative z-0 flex gap-1 rounded-md p-2 outline-offset-1 outline-orange-400 focus-visible:outline"
                value="pending"
                id="r1"
              >
                <Paperclip className="text-zinc-400" />
                <RadioGroup.Indicator className="absolute inset-0 -z-10 rounded-md bg-blue-500/20" />
                <label className="cursor-pointer text-white" htmlFor="r1">
                  Pendentes
                </label>
              </RadioGroup.Item>
              <RadioGroup.Item
                className="relative z-0 flex gap-1 rounded-md p-2 outline-offset-1 outline-orange-400 focus-visible:outline"
                value="completed"
                id="r2"
              >
                <Paperclip className="text-zinc-400" />
                <RadioGroup.Indicator className="absolute inset-0 -z-10 rounded-md bg-blue-500/20" />
                <label className="cursor-pointer text-white" htmlFor="r2">
                  Concluídos
                </label>
              </RadioGroup.Item>
            </RadioGroup.Root>

            <ul className="flex min-h-[70vh] flex-col rounded-xl">
              <DragNDropContextProvider onDragEnd={reorder}>
                {shownReminders
                  ? shownReminders.map((reminder, i) => (
                      <li key={reminder.id}>
                        <Reminder
                          index={i}
                          reminder={reminder}
                          handleDeleteReminder={handleDeleteReminder}
                          handleUpdateReminder={handleUpdateReminder}
                        />
                      </li>
                    ))
                  : "Carregando"}
              </DragNDropContextProvider>
            </ul>
            <CreateReminder
              handleCreateReminder={handleCreateReminder}
              setCreatingReminderInfo={setCreatingReminderInfo}
            />
          </div>
        </main>
      </section>
    </SecurePageWrapper>
  );
}

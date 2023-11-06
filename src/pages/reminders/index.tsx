import { type Reminder as ReminderT } from "@prisma/client";
import * as RadioGroup from "@radix-ui/react-radio-group";
import { LogOut, Paperclip, Plus, X } from "lucide-react";
import { signOut } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  Dispatch,
  FormEvent,
  FormEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Reminder } from "~/components/Reminder";
import SecurePageWrapper from "~/components/SecurePageWrapper";
import { DragNDropContextProvider } from "~/hooks/useDragNDrop";
import { RouterInputs, RouterOutputs, api } from "~/utils/api";

function compareReminderSort(a: string, b: string) {
  return a < b ? -1 : a === b ? 0 : 1;
}

export default function RemindersPage() {
  const [showCompleted, setShowCompleted] = useState(false);

  const utils = api.useUtils();
  const reminders = api.reminders.getAll.useQuery();
  const shownReminders = reminders.data
    ?.filter((r) => r.completed === showCompleted)
    .toSorted((a, b) => compareReminderSort(a.sortedBy, b.sortedBy))!;

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

  const reorderMutation = api.reminders.updateSortedBy.useMutation({
    onSuccess() {
      utils.reminders.getAll.refetch();
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

type CreateReminderProps = {
  handleCreateReminder: (
    e: FormEvent
  ) => Promise<RouterOutputs["reminders"]["createReminder"]>;
  setCreatingReminderInfo: Dispatch<
    SetStateAction<
      Omit<RouterInputs["reminders"]["createReminder"], "lastSortedBy">
    >
  >;
};

function CreateReminder({
  handleCreateReminder,
  setCreatingReminderInfo,
}: CreateReminderProps) {
  const [isCreating, setIsCreating] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isCreating) {
      textAreaRef.current?.focus({ preventScroll: true });
      textAreaRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isCreating]);

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setIsCreating((s) => !s);
        }}
        className="group mx-auto mt-10 rounded-full bg-blue-500/20 p-2 text-white data-[creating='false']:mb-48 data-[creating='true']:bg-blue-500/10"
        data-creating={isCreating}
      >
        <Plus className="mx-auto transition-all group-data-[creating='true']:rotate-45 group-data-[creating='true']:text-red-400" />
      </button>
      {isCreating && (
        <form
          onSubmit={(e) => {
            handleCreateReminder(e).then(() => {
              setCreatingReminderInfo((pr) => ({ ...pr, body: "" }));
              setTimeout(() => {
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth",
                });
              }, 100);
            });
          }}
          className="my-10 flex flex-wrap items-center justify-around"
        >
          <textarea
            ref={textAreaRef}
            className="w-3/4 rounded-md bg-blue-400/10 bg-opacity-50 p-3 text-white outline-offset-1 outline-orange-400/50 drop-shadow-2xl focus-visible:outline"
            id="body"
            onChange={(e) =>
              setCreatingReminderInfo((pr) => ({ ...pr, body: e.target.value }))
            }
            rows={4}
          />
          <button
            className="rounded-md bg-slate-400 px-3 py-2 focus-visible:outline"
            type="submit"
          >
            Criar
          </button>
        </form>
      )}
    </>
  );
}

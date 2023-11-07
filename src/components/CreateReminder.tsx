import { Plus } from "lucide-react";
import {
  type Dispatch,
  type FormEvent,
  type SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import type { RouterInputs, RouterOutputs } from "~/utils/api";

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

export function CreateReminder({
  handleCreateReminder,
  setCreatingReminderInfo,
}: CreateReminderProps) {
  const [isCreating, setIsCreating] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

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
        ref={buttonRef}
        className="group mx-auto mt-10 rounded-full bg-blue-500/20 p-2 text-white data-[creating='false']:mb-48 data-[creating='true']:bg-blue-500/10"
        data-creating={isCreating}
      >
        <Plus className="mx-auto transition-all group-data-[creating='true']:rotate-45 group-data-[creating='true']:text-red-400" />
      </button>
      {isCreating && (
        <form
          onSubmit={(e) => {
            handleCreateReminder(e)
              .then(() => {
                setCreatingReminderInfo((pr) => ({ ...pr, body: "" }));
                setIsCreating(false);
                setTimeout(() => {
                  window.scrollTo({
                    top: document.body.scrollHeight,
                    behavior: "smooth",
                  });
                  buttonRef.current?.focus({ preventScroll: true });
                }, 100);
              })
              .catch(() =>
                alert("deu muita merda, isso n era pra aparecer nunca")
              );
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

// import { BookmarkMinus, BookmarkPlus, Trash2 } from "lucide-react";
import { useState, useRef, type ChangeEvent } from "react";
import { type Reminder as ReminderT } from "@prisma/client";
import { CheckCheck, Trash2 } from "lucide-react";
import { useDragNDropContext } from "~/hooks/useDragNDrop";

type ReminderProps = {
  reminder: ReminderT;
  handleDeleteReminder: (id: string) => void;
  handleUpdateReminder: (reminder: ReminderT) => void;
  index: number;
};

export const Reminder = ({
  reminder: originalReminder,
  handleDeleteReminder,
  handleUpdateReminder,
  index,
}: ReminderProps) => {
  const [reminderBody, setReminderBody] = useState(originalReminder.body);
  const timeoutRef = useRef<undefined | NodeJS.Timeout>();

  const { onDragEnd, onDragEnter, onDragStart } = useDragNDropContext();

  function handleBodyChange(
    e: ChangeEvent<HTMLTextAreaElement>,
    reminder: ReminderT
  ) {
    const value = e.target.value;

    clearTimeout(timeoutRef.current);

    setReminderBody(value);

    timeoutRef.current = setTimeout(() => {
      handleUpdateReminder({ ...reminder, body: value });
    }, 1000);
  }

  return (
    <div
      onDragStart={() => onDragStart(index)}
      onDragEnter={() => onDragEnter(index)}
      onDragEnd={() => onDragEnd()}
      draggable
      key={originalReminder.id}
      className="relative flex flex-col p-3 md:flex-row"
    >
      <div className="absolute -left-16 bottom-0 top-0 flex cursor-move gap-1 px-10 py-3">
        <div className="my-auto h-8 w-[2px] rounded-full bg-zinc-300/80" />
        <div className="my-auto h-10 w-[2px] rounded-full bg-zinc-300" />
      </div>
      <textarea
        onChange={(e) => handleBodyChange(e, originalReminder)}
        className="h-40 max-w-full rounded-md bg-blue-400/30 bg-opacity-50 p-3 text-white outline-offset-1 outline-orange-400 drop-shadow-2xl focus-visible:outline md:flex-1"
        name="body"
        value={reminderBody}
      />
      <div className="ml-auto flex py-3 md:flex-col md:px-3">
        {originalReminder.completed ? (
          <button
            name="Deletar"
            className="rounded-md bg-blue-400/30 bg-opacity-60 p-2 text-red-500 outline-offset-1 outline-orange-400 transition-transform hover:scale-105 focus-visible:outline"
            onClick={() => {
              handleDeleteReminder(originalReminder.id);
            }}
          >
            <Trash2 />
          </button>
        ) : (
          <button
            name="Completado"
            className="rounded-md bg-blue-400/30 bg-opacity-60 p-2 text-green-500 outline-offset-1 outline-orange-400 transition-transform hover:scale-105 focus-visible:outline"
            onClick={() => {
              handleUpdateReminder({ ...originalReminder, completed: true });
            }}
          >
            <CheckCheck />
          </button>
        )}
      </div>
      {/* <button
          name="priority"
          value="Important"
          className="text-yellow-400 rounded-md p-2"
          onClick={() => {
            updateReminder({ ...reminder, priority: "Important" });
          }}
        >
          <BookmarkPlus />
        </button>
        <button
          name="priority"
          value=""
          className="text-gray-400 rounded-md p-2"
          onClick={() => {
            updateReminder({ ...reminder, priority: "" });
          }}
        >
          <BookmarkMinus />
        </button>
      </div> */}
    </div>
  );
};

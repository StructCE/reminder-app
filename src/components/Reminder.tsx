// import { BookmarkMinus, BookmarkPlus, Trash2 } from "lucide-react";
import { useState, useRef, ChangeEvent } from "react";
import { type Reminder as ReminderT } from "@prisma/client";
import { CheckCheck, Trash2 } from "lucide-react";

type ReminderProps = {
  reminder: ReminderT;
  handleDeleteReminder: (id: string) => void;
  handleUpdateReminder: (reminder: ReminderT) => void;
};

export const Reminder = ({
  reminder: originalReminder,
  handleDeleteReminder,
  handleUpdateReminder,
}: ReminderProps) => {
  const [reminderBody, setReminderBody] = useState(originalReminder.body);
  const timeoutRef = useRef<undefined | NodeJS.Timeout>();

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
    <div key={originalReminder.id} className="flex flex-wrap p-3">
      <textarea
        onChange={(e) => handleBodyChange(e, originalReminder)}
        className="h-40 max-w-full flex-1 rounded-md bg-blue-950 bg-opacity-50 p-3 text-white drop-shadow-2xl"
        name="body"
        value={reminderBody}
      />
      <div className="flex flex-col flex-wrap p-3">
        {originalReminder.completed ? (
          <button
            name="Deletar"
            className="rounded-md bg-blue-950 bg-opacity-60 p-2 text-red-500 transition-transform hover:scale-105"
            onClick={() => {
              handleDeleteReminder(originalReminder.id);
            }}
          >
            <Trash2 />
          </button>
        ) : (
          <button
            name="Completado"
            className="rounded-md bg-blue-950 bg-opacity-60 p-2 text-green-500 transition-transform hover:scale-105"
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

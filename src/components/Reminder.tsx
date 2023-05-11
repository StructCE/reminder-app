// import { BookmarkMinus, BookmarkPlus, Trash2 } from "lucide-react";
import { useState, useRef, ChangeEvent } from "react";
import { type Reminder as ReminderT } from "@prisma/client";

export const Reminder = ({
  reminder: originalReminder,
}: {
  reminder: ReminderT;
}) => {
  const [reminder, setReminder] = useState(originalReminder);
  const timeoutRef = useRef<undefined | NodeJS.Timeout>();

  function handleReminderChange(
    e: ChangeEvent<HTMLTextAreaElement>,
    reminder: ReminderT
  ) {
    const propName = e.target.name;
    const value = e.target.value;

    if (propName === "id") {
      // Não faça cagada, caro programador
      throw new Error("Não é possível alterar o id");
    }

    clearTimeout(timeoutRef.current);

    setReminder({ ...reminder, [propName]: value });

    timeoutRef.current = setTimeout(() => {
      //   updateReminder({ ...reminder, [propName]: value });
    }, 1000);
  }

  return (
    <div
      key={reminder.id}
      className="flex flex-wrap border-y border-solid border-orange-400 p-3"
    >
      <textarea
        onChange={(e) => handleReminderChange(e, reminder)}
        className="h-40 max-w-full flex-1 drop-shadow-2xl"
        name="body"
        value={reminder.body}
      />

      {/* <div className="p-3 flex flex-wrap flex-col">
        <button
          className="text-red-500 rounded-md p-2"
          onClick={() => {
            deleteReminder(reminder.id);
          }}
        >
          <Trash2 />
        </button>
        <button
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

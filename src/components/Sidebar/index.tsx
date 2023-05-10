import Link from "next/link";
import React, { useState } from "react";

const openButtonHeight = 10;

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((op) => !op)}
        className="fixed left-0 top-0 z-50 md:invisible"
      >
        {open ? "fechar" : "Abrir"}
      </button>
      <aside
        className={`flex-col items-start md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-all`}
      >
        <nav>
          <ul className="flex h-full flex-col bg-cyan-500">
            <li className="">
              <Link href="/reminders" className="text-white hover:bg-cyan-600">
                Seus lembretes
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
    </>
  );
}

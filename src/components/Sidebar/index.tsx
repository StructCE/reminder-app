import Link from "next/link";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
import { MenuSquare, CopyX, LogOut } from "lucide-react";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen((op) => !op)}
        className={"fixed left-0 top-0 z-50 h-10 w-10 md:invisible md:hidden"}
      >
        <CopyX
          className={
            open
              ? "absolute left-2 top-2 opacity-100 transition-all"
              : "absolute left-2 top-2 opacity-0 transition-all"
          }
        />
        <MenuSquare
          className={
            open
              ? "absolute left-2 top-2 opacity-0 transition-all"
              : "absolute left-2 top-2 opacity-100 transition-all"
          }
        />
      </button>
      <aside
        className={
          open
            ? "fixed left-0 top-0 z-40 flex h-screen min-w-max translate-x-0     flex-col items-start justify-between gap-4 bg-slate-700 bg-opacity-80 pt-8 backdrop-blur-2xl transition-all md:relative md:mt-0 md:h-[unset] md:translate-x-0 md:justify-around md:pt-4"
            : "fixed left-0 top-0 z-40 flex h-screen min-w-max -translate-x-full flex-col items-start justify-between gap-4 bg-slate-700 bg-opacity-80 pt-8 backdrop-blur-2xl transition-all md:relative md:mt-0 md:h-[unset] md:translate-x-0 md:justify-around md:pt-4"
        }
      >
        <div className="mb-auto w-full">
          <h2 className="m-1 text-sm text-zinc-100">Rotas</h2>
          <nav className="">
            <ul className="flex h-full flex-col">
              <li className="contents">
                <Link
                  href="/reminders"
                  className="p-3  text-xl leading-4 text-white hover:bg-[rgba(0,0,0,0.3)]"
                >
                  Seus lembretes
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="w-full">
          <h2 className="m-1 text-sm text-zinc-100">Ações</h2>
          <button
            onClick={() => signOut()}
            className="flex w-full justify-around p-2 text-xl text-white hover:bg-[rgba(0,0,0,0.3)]"
          >
            Sair
            <LogOut className="text-amber-500" />
          </button>
        </div>
      </aside>
    </>
  );
}

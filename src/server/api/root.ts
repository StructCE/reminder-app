import { createTRPCRouter } from "~/server/api/trpc";
import { remindersRouter } from "~/server/api/routers/reminders";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  reminders: remindersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

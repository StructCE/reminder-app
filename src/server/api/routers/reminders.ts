import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const remindersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.reminder.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  createReminder: protectedProcedure
    .input(z.object({ body: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.reminder.create({
        data: {
          userId: ctx.session.user.id,
          body: input.body,
        },
      });
    }),
});

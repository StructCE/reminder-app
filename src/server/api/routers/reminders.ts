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
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.reminder.create({
        data: {
          userId: ctx.session.user.id,
          body: input.body,
        },
      });
    }),

  deleteReminder: protectedProcedure
    .input(z.object({ reminderId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const reminder = await ctx.prisma.reminder.findUnique({
        where: {
          id: input.reminderId,
        },
        select: {
          userId: true,
        },
      });
      if (ctx.session.user.id === reminder?.userId) {
        return ctx.prisma.reminder.delete({
          where: {
            id: input.reminderId,
          },
        });
      }

      throw new Error("Reminder must be yours to delete");
    }),

  updateReminder: protectedProcedure
    .input(
      z.object({
        reminder: z.object({
          id: z.string(),
          body: z.string(),
          completed: z.boolean(),
        }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const reminder = await ctx.prisma.reminder.findUnique({
        where: {
          id: input.reminder.id,
        },
        select: {
          userId: true,
        },
      });

      if (ctx.session.user.id === reminder?.userId) {
        return ctx.prisma.reminder.update({
          where: {
            id: input.reminder.id,
          },
          data: input.reminder,
        });
      }

      throw new Error("Reminder must be yours to update");
    }),
});

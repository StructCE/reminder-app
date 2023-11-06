import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { getMidSortedBy } from "~/server/utils/getMidSortedBy";
import { getNextSortedBy } from "~/server/utils/getNextSortedBy";
import { getPreviousSortedBy } from "~/server/utils/getPreviousSortedBy";

export const remindersRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.prisma.reminder.findMany({
      where: { userId: ctx.session.user.id },
    });
  }),

  createReminder: protectedProcedure
    .input(z.object({ body: z.string(), lastSortedBy: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.reminder.create({
        data: {
          userId: ctx.session.user.id,
          body: input.body,
          sortedBy: getNextSortedBy(input.lastSortedBy),
        },
      });
    }),

  updateSortedBy: protectedProcedure
    .input(
      z.object({
        reminderId: z.string(),
        previous: z.string().optional(),
        next: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input: { reminderId, next, previous } }) => {
      const reminder = await ctx.prisma.reminder.findUnique({
        where: {
          id: reminderId,
        },
        select: {
          userId: true,
        },
      });

      if (ctx.session.user.id !== reminder?.userId)
        throw new Error("Reminder must be yours to sort");

      if (!next && !previous)
        return ctx.prisma.reminder.update({
          where: {
            id: reminderId,
          },
          data: {
            sortedBy: getNextSortedBy(undefined),
          },
        });

      if (next && previous) {
        return ctx.prisma.reminder.update({
          where: {
            id: reminderId,
          },
          data: {
            sortedBy: getMidSortedBy(previous, next),
          },
        });
      }

      if (next) {
        return ctx.prisma.reminder.update({
          where: {
            id: reminderId,
          },
          data: {
            sortedBy: getPreviousSortedBy(next),
          },
        });
      }

      return ctx.prisma.reminder.update({
        where: {
          id: reminderId,
        },
        data: {
          sortedBy: getNextSortedBy(previous),
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
          // [TODO]: Make completed change affect sorting pos
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

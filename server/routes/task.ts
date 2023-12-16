import { z } from 'zod';
import { userProcedure } from '../middlewares/protectedroute';
import { publicProcedure, router } from '../trpc';
import { db } from '..';
import { InsertStep, InsertTask, step, task } from '../db/schema/Schema';
import { eq, inArray } from 'drizzle-orm';
import { TRPCClientError } from '@trpc/client';
import { v4 as uuidv4 } from 'uuid';

export const taskRouter = router({
    add: userProcedure.input(
        z.object({
            name: z.string().nonempty(),
            steps: z.array(z.string().nonempty("Step name is required")
                .min(1, "Atleast one step is required"))
        })
    ).mutation(async (opts) => {
        //checking for existing user
        try {
            const newTask = async (t: InsertTask) => {
                return db.insert(task).values(t);
            }

            const newStep = async (t: InsertStep) => {
                return db.insert(step).values(t);
            }

            const taskId = uuidv4();


            const newtask: InsertTask = { name: opts.input.name, user_id: opts.ctx.user.id, task_id: taskId };
            const result = await newTask(newtask);
            if (result === undefined || result === null) {
                throw new TRPCClientError(result + "task agya pakad me ")
            }

            for (let i = 0; i < opts.input.steps.length; i++) {

                const newstep = { name: opts.input.steps[i], task_id: taskId, step_id: uuidv4() };
                const result2 = await newStep(newstep);
                if (result2 === undefined || result2 === null) {
                    throw new TRPCClientError(result2 + "step agya pakad me ")
                }
            }
            if (result) {
                return {
                    status: "Task Added",
                    res: { name: opts.input.name, user_id: opts.ctx.user.id, task_id: uuidv4() }
                };
            }
        } catch (error) {
            let errorMessage = "Failed to do something exceptional";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            throw new TRPCClientError(errorMessage)
        }
    }),

    getall: userProcedure.query(async (opts) => {
        try {
            const tasks = await db.select().from(task).where(eq(task.user_id, opts.ctx.user.id));
            if (tasks === undefined || tasks.length === 0 || tasks === null) {
                throw new TRPCClientError("No Tasks Found");
            }

            const taskIds = tasks.map((task) => task.task_id);
            const steps = await db.select().from(step).where(inArray(step.task_id, taskIds));

            const tasksWithSteps = tasks.map((task) => {
                const taskSteps = steps
                    .filter((step) => step.task_id === task.task_id)
                    .map((step) => step.name);

                return { ...task, steps: taskSteps };
            });

            return tasksWithSteps;
        } catch (error) {
            let errorMessage = "Failed to do something exceptional";
            if (error instanceof Error) {
                errorMessage = error.message;
            }
            throw new TRPCClientError(errorMessage);
        }
    }),
});
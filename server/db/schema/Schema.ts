import { pgTable, text, uuid, serial, integer, boolean } from 'drizzle-orm/pg-core';
import { InferModel, relations } from 'drizzle-orm';


export const user = pgTable('buyers', {
    id: text('id').primaryKey().notNull(),
    email: text('email').notNull(),
    username: text('username').notNull(),
    password: text('password').notNull(),
    isSeller: boolean('isSeller').default(true).notNull(),
});



export const task = pgTable('tasks', {
    task_id: text('task_id').primaryKey(),
    name: text('name'),
    user_id: text('user_id').notNull().references(() => user.id),
});

export const step = pgTable('steps', {
    step_id: text('step_id').primaryKey(),
    name: text('name'),
    task_id: text('task_id').notNull().references(() => task.task_id),
});




export const stepRelations = relations(step, ({ one }) => ({
    task: one(task, {
        fields: [step.task_id],
        references: [task.task_id],
    }),
}));



export type User = InferModel<typeof user>;
export type InsertUser = InferModel<typeof user, "insert">;



export type Task = InferModel<typeof task>;
export type InsertTask = InferModel<typeof task, "insert">;

export type Step = InferModel<typeof step>;
export type InsertStep = InferModel<typeof step, "insert">;

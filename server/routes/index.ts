import express from "express";
import { db } from "../index";
import { user } from "../db/schema/Schema";
import { publicProcedure, router } from "../trpc";
import { authRouter } from './auth';


import { string, z } from "zod";
import { TRPCClientError } from "@trpc/client";
import { taskRouter } from './task';


export const appRouter = router({

    auth: authRouter,

    task: taskRouter,


})
export type AppRouter = typeof appRouter;
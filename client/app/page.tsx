"use client";
import Spinner from '@/components/ui/spinner';
import { useToast } from '@/components/ui/use-toast';
import { trpc } from '@/utils/trpc';
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from "next/link";
require('dotenv').config()

import './TaskList.css';



function ShowTasks() {
  const { toast } = useToast();
  const router = useRouter()
  const queryError = (error: any) => {
    if (error?.message == "You must be logged in to do this") {
      router.push('/login');
    }

    toast({
      variant: "destructive",
      title: error?.message,
    })

  }
  let { data: tasks, isLoading, isFetching, isError, error, refetch } = trpc.task.getall.useQuery(undefined, { retry: 1 });


  if (isLoading || isFetching) {
    return <Spinner />
  }


  if (tasks === undefined || tasks.length === 0) {
    return <div className="flex justify-center mt-8">No Tasks found</div>
  }

  return (
    <>
      <h1 className="my-4 text-4xl text-center font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        User Tasks
      </h1>
      <Link className="flex justify-center mx-4" href={'/addTask'}>
        <p>add tasks</p>
      </Link>
      <div className="flex justify-center max-w-full">

        <div className="task-list-container m-20 flex-wrap">
          {tasks.map((task) => (
            <div key={task.task_id} className="task-card">
              <h2>{task.name}</h2>
              {/* <h3>{process.env.NEXT_PUBLIC_NAME}</h3> */}

              <ul>
                {task.steps.map((step, index) => (
                  <li key={index}>-  {step}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default ShowTasks;
"use client"

import { trpc } from "@/utils/trpc";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isDirty, isValid, z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from 'next/image';
import { Separator } from "@/components/ui/separator";
import { DevTool } from "@hookform/devtools";
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import RegisterSchema from "@/utils/zod-schemas/RegisterSchema";
import { ToastAction } from "@/components/ui/toast";
import { Timer } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox"
import { Mutation } from "@tanstack/react-query";
import { useState } from "react";
import Link from "next/link";
require('dotenv').config()
import OpenAI from 'openai';


const openai = new OpenAI({
    apiKey: "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",
    dangerouslyAllowBrowser: true
});





export type TaskFormValues = {
    name: string;
    steps: string[];
};

const AddtaskForm = () => {
    const { toast } = useToast()
    const router = useRouter();
    const [gptdata, setGptdata] = useState<string>("")

    let mutation = trpc.task.add.useMutation({
        onSuccess: () => {
            toast({
                variant: "success",
                title: "task Added",
            });
            reset();
        },
        onError: (error) => {
            toast({
                variant: "destructive",
                title: error.message,
            });

        }
    })
        ;

    const chatGPTSubmit = async (gptdata: string | OpenAI.Chat.Completions.ChatCompletionContentPart[]) => {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user", content: `
                you have 5 life points , each time you not strictly follow my orders i will take one life point away , and if your lifepoints become 0 you die 

                so here is your task 
                
                I will give you a brief task and then you have to break the task into steps and give it a title 
                
                for example 
                
                user :- today after waking up i  wanna go to the collage using the local transport 
                
                output :- 
                { name : go to collage ,
                   steps:['wake up ' , 'freshen up' , 'change in collage dress' , 'board the bus' , 'enter the collage'] }
                
                the structure of your response should strictly match the example output i have given you 
                
                so here is the task 
                
                "${gptdata}"
                I am again reminding you not even a word extra from what i have defined in the structure , you will not even write the title in capital bold at the start
                
                ` }],
        })
        console.log(response.choices[0].message.content + "chatgpt response")
        mutation.mutate(JSON.parse(response.choices[0].message.content as string))
    }


    const form = useForm<TaskFormValues>({
        defaultValues: {
            name: "",
            steps: ["",],
        },
        resolver: zodResolver(
            z.object({
                name: z.string().nonempty("Task name is required"),
                steps: z.array(z.string().nonempty("Step name is required")
                ),
            })
        ),

        mode: "onTouched" // this causes validaiton when u type , there are option to choose 
        //you can also do async validaiton
    });

    const { register, handleSubmit, formState, control, reset } = form;

    //when we are not using zod we use register to register different form feilds 
    // const name = register("name") , now the name is an object with various variables in it lets destructre it
    // const { ref, onChange, onBlur, value } = name;
    //you can add these as input props like this <input id="name" {...register("name")} (if you are doing this you do not need to define it like this const name = register("name") above  /> or you can add them individually like this  <input id="name" ref={ref} onChange={onChange} onBlur={onBlur}  /> this enables react hook form to track the input feilds and validate them

    //form also has a watch object which helps us to watch any feild 

    //there are two methods getvalues and setvalues which can get you values of the specified feilds when some specific action is performed such as clicking 
    const { errors, isDirty, isValid } = formState; // there are also other values we can destructure like isSumbiting , isSumbited , isSumbitSuccessfull , sumbitcount

    //  you can also reset the form with reset funciton , ---> useeffect ke andr , if isSumbitsuccessfull then reset , and watch for [insumbitsuccessfull]

    const { fields, append, remove } = useFieldArray({
        name: "steps" as never,
        control
    });


    const onSubmit = async (data: TaskFormValues,) => {

        console.log(data, "data")

        mutation.mutate(data);





        //you can console log this to see what is the structure of the data being recieved from the form
        //also suppose the api accept the data in some other form or structure then also you can modify data here before sending it to the api with nested objects you can group some properties checkout video 13 , insted of nested objects you can also use arrays to group some properties video 14

        //sometimes you do not how many feilds in array are required , for example in a website we have an option to add as many phone numbers as the user wants by clicking a plus sign for thisw watch video 15
    };
    // you can also disable some feilds , for example disable = "true" or disable = watch("name")==="" ---> in this code if the name is empty then the price feild will be disabled
    return (
        <div className="border-solid border-4 flex flex-col h-screen justify-center items-center">
            <Link className="flex justify-center mx-4" href={'/'}>
                <p>show all the  tasks</p>
            </Link>
            <div className="my-8 text-4xl font-bold">Ask chatGPT</div>
            <div className="flex">
                <Input type="text" id="gptdata" placeholder="ask chatGPT" onChange={(e) => setGptdata(e.target.value)} />
            </div>
            <Button className="my-4" type="button" onClick={() => chatGPTSubmit(gptdata)}>Submit</Button>

            <div className="my-8 text-4xl font-bold">Add a task</div>


            <Separator className="w-[40vh] mt-6" />

            <form onSubmit={handleSubmit(onSubmit)} noValidate> {/* along with onSumbit , handle sumbit also has a function to handle errors which we get while sumbiting the form */}
                <div className="flex flex-col   ">
                    <div className="form-control my-4">
                        <Input type="text" id="name" placeholder="name of the task" {...register("name")} />
                        <p className="text-red-600 text-sm">{errors.name?.message}</p>
                    </div>


                    <div>
                        {fields.map((field, index) => {
                            return (

                                <div key={field.id} className="flex flex-row items-center">
                                    <div className="form-control my-4">
                                        <Input type="text" id="steps" placeholder="steps" {...register(`steps.${index}` as const)} />
                                        <p className="text-red-600 text-sm">{errors.steps?.[index]?.message}</p>
                                    </div>
                                    <Button className="ml-10" onClick={() => remove(index)}>Remove</Button>
                                </div>
                            )
                        })}
                        <Button className="my-4" onClick={() => append("")}>Add a step in the task </Button>
                    </div>



                    <Button className="my-4" disabled={!isDirty || !isValid} >Submit</Button>
                    {/* here we are using isDirty and isValid to disable the button if the form is not dirty or not valid */}
                </div>
            </form>


            <DevTool control={control} />

        </div>
        // devtool to visualize react hook form , control is a object destructured from useForm hook and these track the state without rerendering the whole conmpnent while if we have used state the whole componenet would have been re rendered


    );
};

export default AddtaskForm;


//React form hook notes 


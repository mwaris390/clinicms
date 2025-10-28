"use client";

import Loader from "@/app/_components/loader";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { login } from "@/controller/user/data";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import toast from 'react-hot-toast';
import { redirect } from "next/navigation";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z.string().min(8, { message: "minimum 8 characters" }),
});

type FormType = z.infer<typeof formSchema>;

function Login() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    mode: "onBlur",
    defaultValues: {
      email: "saim01@gmail.com",
      password: "",
    },
  });

  function onSubmit(values: FormType) {
    console.log(values);
    startTransition(async () => {
      const result = await login(values);
      console.log(result);
      if (result.status) {
        toast.success(result.message)
        sessionStorage.setItem('user_data', JSON.stringify(result.data))
        redirect("/")
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <>
      <div className="flex justify-center items-center h-[80vh] ">
        <div className="w-1/3 bg-customSecondary-20 p-8 rounded-md shadow-md">
          <h2 className="mb-6 font-bold text-2xl text-center">LOGIN</h2>
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Write Email" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Password<span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Write Password" {...field} />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                className="bg-customPrimary hover:bg-customPrimary-80 disabled:bg-customPrimary-20 w-full"
                type="submit"
                disabled={!form.formState.isValid}
              >
                Login
                {isPending && <Loader />}
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </>
  );
}

export default Login;

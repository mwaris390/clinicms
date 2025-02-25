"use client";

import Loader from "@/app/_components/loader";
import SubHeader from "@/app/_components/sub-header";
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
import { Switch } from "@/components/ui/switch";
import { AddUser, ReadSingleUser, UpdateUser } from "@/controller/user/data";
import { GetUser } from "@/lib/get_user";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export default function CreateUser() {
  const [isPending, startTransition] = useTransition();
  let { id } = useParams();
  let parseId: string | undefined;
  if (id) {
    parseId = id[0];
  }
  const [isPasswordFieldShow, setPasswordFieldShow] = useState(
    parseId == undefined
  );

  const baseSchema = z.object({
    fname: z.string().min(1, { message: "First Name required" }),
    lname: z.string().min(1, { message: "Last Name required" }),
    email: z
      .string()
      .min(1, { message: "Email required" })
      .email("Incorrect Email"),
  });

  const extendedSchema = z
    .object({
      password: z.string().min(1, { message: "Password required" }),
      confirmPassword: z
        .string()
        .min(1, { message: "Confirm Password required" }),
    })
    .refine(
      (val) => {
        return val.password === val.confirmPassword;
      },
      { message: "password must match", path: ["confirmPassword"] }
    );

  const formSchema = z.intersection(baseSchema, extendedSchema);

  const formSchema1 = baseSchema;

  type FormType = z.infer<typeof formSchema>;

  const form = useForm<FormType>({
    resolver: zodResolver(isPasswordFieldShow ? formSchema : formSchema1),
    mode: "onBlur",
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: FormType) {
    startTransition(async () => {
      const user = await GetUser();
      if (parseId) {
        const result = await UpdateUser(
          Object.assign(values, {
            id: parseId || "",
            createdBy: user.data?.id,
            updatedBy: user.data?.id,
          })
        );
        if (result.status) {
          toast.success(result.message);
          redirect("/user/user-list");
        } else {
          toast.error(result.message);
        }
      } else {
        const result = await AddUser(
          Object.assign(values, {
            createdBy: user.data?.id,
            updatedBy: user.data?.id,
          })
        );
        if (result.status) {
          toast.success(result.message);
          redirect("/user/user-list");
        } else {
          toast.error(result.message);
        }
      }
    });
  }

  async function FetchSingleRecord() {
    if (parseId) {
      const result = await ReadSingleUser(parseId);
      if (!result.status) {
        toast.error(result.message);
      } else {
        form.reset({
          fname: result.data?.fname.toLowerCase(),
          lname: result.data?.lname.toLowerCase(),
          email: result.data?.email.toLowerCase(),
        });
      }
    }
  }

  useEffect(() => {
    FetchSingleRecord();
  }, []);

  return (
    <>
      <section>
        <SubHeader title={`${parseId == undefined ? "Add" : "Update"} User`} />
        <div className="flex items-center justify-center w-full mt-8 ">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              autoComplete="off"
              className="bg-customSecondary-20 rounded-md shadow p-8 w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="fname"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="basis-[30%]">
                      First Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="basis-[70%]">
                      <FormControl>
                        <Input placeholder="Write First Name" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage className="" />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lname"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="basis-[30%]">
                      Last Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="basis-[70%]">
                      <FormControl>
                        <Input placeholder="Write Last Name" {...field} />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="basis-[30%]">
                      Email<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="basis-[70%]">
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Write Email"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              {parseId != undefined && (
                <div className="flex items-center">
                  <FormLabel className="basis-[30%]">
                    Do You want to change password?
                  </FormLabel>
                  <div className="basis-[70%]">
                    <Switch
                      className="data-[state=checked]:bg-tertiary data-[state=unchecked]:bg-customPrimary-20 "
                      onCheckedChange={(val) => {
                        setPasswordFieldShow(val);
                        if (val) {
                          form.reset({
                            ...form.getValues(),
                            password: "",
                            confirmPassword: "",
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              )}
              {isPasswordFieldShow && (
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="basis-[30%]">
                          Password<span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="basis-[70%]">
                          <FormControl>
                            <Input placeholder="Write Password" {...field} />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem className="flex items-center">
                        <FormLabel className="basis-[30%]">
                          Confirm Password
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <div className="basis-[70%]">
                          <FormControl>
                            <Input
                              placeholder="Write Confirm Password"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <div className="w-full flex gap-x-4 justify-end ">
                <Button
                  className="bg-red-500 text-white hover:bg-red-600 hover:text-white px-12"
                  type="button"
                  onClick={() => {
                    form.reset();
                  }}
                >
                  Reset
                </Button>
                <Button
                  className="bg-customPrimary hover:bg-customPrimary-80 disabled:bg-customPrimary-20 px-12"
                  type="submit"
                  disabled={!form.formState.isValid}
                >
                  {parseId == undefined ? "Add" : "Update"}
                  {isPending && <Loader />}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </section>
    </>
  );
}

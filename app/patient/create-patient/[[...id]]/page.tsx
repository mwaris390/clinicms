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
import { Textarea } from "@/components/ui/textarea";
import {
  AddPatient,
  ReadSinglePatient,
  UpdatePatient,
} from "@/controller/patient/action";
import { GetUser } from "@/lib/get_user";
import { zodResolver } from "@hookform/resolvers/zod";
import { redirect, useParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export default function CreatePatient() {
  const [isPending, startTransition] = useTransition();
  const [phoneExistBtn, setPhoneExistBtn] = useState({ id: "", status: false });
  const { id } = useParams();
  let parseId: string | undefined;
  if (id) {
    parseId = id[0];
  }

  const baseSchema = z
    .object({
      patientName: z.string().min(1, { message: "Patient Name is Required" }),
      fatherName: z.string(),
      age: z
        .union([
          z.string().min(1, { message: "Age is Required" }),
          z
            .number()
            .int()
            .nonnegative({ message: "Age must be a positive number" }),
        ])
        .transform((val, ctx) => {
          if (typeof val === "string") {
            if (!Number.isNaN(parseInt(val))) {
              return parseInt(val);
            } else {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Not a valid number",
              });
            }
          }
          return val; // Already a number
        }),
      cnic: z.string().max(13, { message: "Max 13 digits" }),
      phone: z
        .string()
        .min(11, { message: "Max 11 digits" })
        .max(15, { message: "Max 15 digits" })
        .superRefine((val: string, ctx) => {
          if (val != "") {
            if (Number.isNaN(parseInt(val))) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Not a Number",
              });
            }
          }
        }),
      sideNote: z.string(),
    })
    .partial({ fatherName: true, cnic: true, sideNote: true });
  type FormType = z.infer<typeof baseSchema>;
  const form = useForm<FormType>({
    resolver: zodResolver(baseSchema),
    mode: "onBlur",
    defaultValues: {
      patientName: "",
      fatherName: "",
      cnic: "",
      phone: "",
      sideNote: "",
      age: "",
    },
  });

  async function onSubmit(values: FormType) {
    console.log(values);
    const user = await GetUser();
    if (parseId) {
      startTransition(async () => {
        const result = await UpdatePatient(
          Object.assign(values, {
            createdBy: user.data?.id,
            updatedBy: user.data?.id,
            id: parseId,
          })
        );
        if (result.status) {
          toast.success(result.message);
          redirect(`/patient/patient-list`);
        } else {
          toast.error(result.message);
        }
      });
    } else {
      startTransition(async () => {
        const result: any = await AddPatient(
          Object.assign(values, {
            createdBy: user.data?.id,
            updatedBy: user.data?.id,
          })
        );
        if (result.status) {
          toast.success(result.message);
          redirect(`/patient/patient-checkup/${result.data.id}`);
        } else {
          toast.error(result.message);
          if (result.message === "Phone No already Exist.") {
            setPhoneExistBtn({ id: result.data?.id, status: true });
          }
        }
      });
    }
  }
  async function FetchSingleRecord() {
    if (parseId) {
      const result = await ReadSinglePatient(parseId);
      if (!result.status) {
        toast.error(result.message);
      } else {
        form.reset({
          patientName: result.data?.patient_name.toLowerCase(),
          fatherName: (result.data?.father_name || "").toLowerCase(),
          age: result.data?.age,
          cnic: result.data?.cnic || "",
          phone: result.data?.phone_no,
          sideNote: result.data?.notes || "",
        });
      }
    }
  }

  useEffect(() => {
    FetchSingleRecord();
  }, [phoneExistBtn]);
  return (
    <>
      <section>
        <SubHeader
          title={`${parseId == undefined ? "Add" : "Update"} Patient`}
        />
        <div className="flex items-center justify-center w-full mt-8 ">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              autoComplete="off"
              className="bg-customSecondary-20 rounded-md shadow p-8 w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="basis-[30%]">
                      Patient Name<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="basis-[70%]">
                      <FormControl>
                        <Input
                          placeholder="Write Patient Name"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="fatherName"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="basis-[30%]">Father Name</FormLabel>
                    <div className="basis-[70%]">
                      <FormControl>
                        <Input
                          placeholder="Write Father Name (Optional)"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="basis-[30%]">
                      Age <span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="basis-[70%]">
                      <FormControl>
                        <Input
                          placeholder="Write Age"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cnic"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="basis-[30%]">CNIC</FormLabel>
                    <div className="basis-[70%]">
                      <FormControl>
                        <Input
                          placeholder="Write CNIC Example 3422127522717 (Optional)"
                          {...field}
                          type="number"
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="basis-[30%]">
                      Phone No.<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="basis-[70%]">
                      <FormControl>
                        <Input
                          placeholder="Write Phone Number"
                          {...field}
                          type="text"
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sideNote"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="basis-[30%]">Notes</FormLabel>
                    <div className="basis-[70%]">
                      <FormControl>
                        <Textarea
                          placeholder="Write any remarks regarding to identify this patient (Optional)"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="w-full flex gap-x-4 justify-end ">
                {phoneExistBtn.status && (
                  <Button
                    className="bg-customPrimary text-white hover:bg-customPrimary hover:text-white px-12"
                    type="button"
                    onClick={() => {
                      redirect(`/patient/patient-checkup/${phoneExistBtn.id}`);
                    }}
                  >
                    Are you Sure to Continue?
                  </Button>
                )}
                <Button
                  className="bg-red-500 text-white hover:bg-red-600 hover:text-white px-12"
                  type="button"
                  onClick={() => {
                    form.reset();
                    setPhoneExistBtn({ id: "", status: false });
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

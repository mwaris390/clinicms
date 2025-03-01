"use client";
import Loader from "@/app/_components/loader";
import SubHeader from "@/app/_components/sub-header";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { ReadPatientAll } from "@/controller/patient/action";
import {
  PatientCheckup,
  ReadCheckUp,
  UpdatePatientCheckup,
} from "@/controller/patient/checkup/action";
import { GetUser } from "@/lib/get_user";
import { zodResolver } from "@hookform/resolvers/zod";
import { setDate } from "date-fns";
import { Check, ChevronsUpDown } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

export default function PatientCheckUp() {
  const [data, setData] = useState<
    | {
        id: string;
        patient_name: string;
        father_name: string | null;
        age: number;
        cnic: string | null;
        phone_no: string;
        notes: string | null;
      }[]
  >();
  const [isPending, startTransition] = useTransition();
  const { id } = useParams();
  let checkupId: string | undefined;
  let checkupToUpdateId: string | undefined;
  let isCheckUpUpdate: boolean | undefined = false;
  if (id) {
    checkupId = id[0];
    if (id[1] == "true" || id[1] == "false") {
      isCheckUpUpdate = id[1] == "true" ? true : false;
    }
  }
  const baseSchema = z.object({
    patient: z.string().uuid({ message: "Patient must be selected" }),
    sphLD: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    cylLD: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    axisLD: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    vaLD: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    sphLN: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    cylLN: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    axisLN: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    vaLN: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    sphRD: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    cylRD: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    axisRD: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    vaRD: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    sphRN: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    cylRN: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    axisRN: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    vaRN: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
    sideNote: z.string().optional(),
    addNote: z
      .string()
      .optional()
      .refine(
        (val) =>
          val === undefined ||
          val.trim() === "" ||
          /^[-+]?\d+(\.\d+)?$/.test(val),
        {
          message: "Invalid decimal number",
        }
      ),
  });
  type FormType = z.infer<typeof baseSchema>;
  const form = useForm<FormType>({
    resolver: zodResolver(baseSchema),
    mode: "onBlur",
    defaultValues: {
      patient: "",
      sideNote: "",
      sphLD: "",
      sphLN: "",
      sphRD: "",
      sphRN: "",
      cylLD: "",
      cylLN: "",
      cylRD: "",
      cylRN: "",
      axisLD: "",
      axisLN: "",
      axisRD: "",
      axisRN: "",
      vaLD: "",
      vaLN: "",
      vaRD: "",
      vaRN: "",
      addNote: "",
    },
  });
  async function fetchPatient() {
    if (data == undefined) {
      const result = await ReadPatientAll();
      if (result.status) {
        // toast.success(result.message);
        setData(result.data);
        if (checkupId) {
          form.setValue("patient", checkupId);
        }
      } else {
        toast.error(result.message);
      }
    }

    if (isCheckUpUpdate) {
      if (id) {
        const result = await ReadCheckUp(id[2]);
        if (result.status) {
          console.log("data", result);
          const value = result.data;
          form.reset({
            patient: checkupId,
            sideNote: String(value?.remarks),
            sphLD: String(value?.sphld || ""),
            sphLN: String(value?.sphln || ""),
            sphRD: String(value?.sphrd || ""),
            sphRN: String(value?.sphrn || ""),
            cylLD: String(value?.cylld || ""),
            cylLN: String(value?.cylln || ""),
            cylRD: String(value?.cylrd || ""),
            cylRN: String(value?.cylrn || ""),
            axisLD: String(value?.axisld || ""),
            axisLN: String(value?.axisln || ""),
            axisRD: String(value?.axisrd || ""),
            axisRN: String(value?.axisrn || ""),
            vaLD: String(value?.vald || ""),
            vaLN: String(value?.valn || ""),
            vaRD: String(value?.vard || ""),
            vaRN: String(value?.varn || ""),
            addNote: String(value?.add_note || ""),
          });
          checkupToUpdateId = value?.id;
          // toast.success(result.message);
        } else {
          toast.error(result.message);
        }
      }
    }
  }

  function onSubmit(values: FormType) {
    console.log(values);
    startTransition(async () => {
      const user = await GetUser();
      if (!isCheckUpUpdate) {
        const result = await PatientCheckup(
          Object.assign(values, {
            created_user_id: user.data?.id || "",
            updated_user_id: user.data?.id || "",
          })
        );
        if (result.status) {
          toast.success(result.message);
          form.reset({
            patient: values.patient,
          });
        } else {
          console.log(result);
          toast.error(result.message);
        }
      } else {
        const result = await UpdatePatientCheckup(
          Object.assign(values, {
            checkupId: id?.[2] || "",
            created_user_id: user.data?.id || "",
            updated_user_id: user.data?.id || "",
          })
        );
        if (result.status) {
          toast.success(result.message);
          redirect(`/patient/profile/${checkupId}`);
        } else {
          console.log(result);

          toast.error(result.message);
        }
      }
    });
  }

  const buttonRef = useRef<HTMLButtonElement>(null);
  const [width, setWidth] = useState<string | null>(null);
  const didRun = useRef(false);

  useEffect(() => {
    if (!didRun.current) {
      didRun.current = true;
      fetchPatient();
      if (buttonRef.current) {
        setWidth(String(buttonRef.current.offsetWidth));
      }
    }
  }, []);
  return (
    <>
      <section>
        <SubHeader
          title={`${isCheckUpUpdate ? "Update " : ""}Patient Check Up`}
        />
        <div className="flex items-center justify-center w-full mt-8 ">
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="bg-customSecondary-20 rounded-md shadow p-8 w-full space-y-4"
            >
              <FormField
                control={form.control}
                name="patient"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="basis-[30%]">
                      Patient<span className="text-red-500">*</span>
                    </FormLabel>
                    <div className="basis-[70%]">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              ref={buttonRef}
                              variant="outline"
                              role="combobox"
                              className={`
                                w-full justify-between capitalize
                                ${!field.value && "text-muted-foreground"}
                              `}
                            >
                              {field.value
                                ? data?.find(
                                    (patient) => patient.id === field.value
                                  )?.patient_name
                                : "Select Patient"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent
                          style={{ width: `${width}px` }}
                          className={` p-0`}
                        >
                          <Command>
                            <CommandInput placeholder={`Search Patient...`} />
                            <CommandList>
                              <CommandEmpty>No Patient found.</CommandEmpty>
                              <CommandGroup>
                                {data?.map((patient) => (
                                  <CommandItem
                                    className="capitalize"
                                    value={patient.patient_name}
                                    key={patient.id}
                                    onSelect={() => {
                                      form.setValue("patient", patient.id, {
                                        shouldValidate: true,
                                      });
                                    }}
                                  >
                                    {patient.patient_name}
                                    <Check
                                      className={`
                                        ml-auto
                                        ${
                                          patient.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        }
                                      `}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex items-center">
                <FormLabel className="basis-[30%]">Right Eye</FormLabel>
                <div className="basis-[70%]">
                  <table className="">
                    <thead>
                      <tr>
                        <th className="border-2 border-tertiary"></th>
                        <th className="border-2 border-tertiary text-sm">
                          SPH (L/R)
                        </th>
                        <th className="border-2 border-tertiary text-sm">
                          CYL (L/R)
                        </th>
                        <th className="border-2 border-tertiary text-sm">
                          AXIS (L/R)
                        </th>
                        <th className="border-2 border-tertiary text-sm">
                          VA (L/R)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-2 border-tertiary font-bold text-[12px] w-[6rem] text-center">
                          DIST.
                        </td>
                        <td className="border-2 border-tertiary w-[12rem]">
                          <div className="flex gap-x-1">
                            <FormField
                              control={form.control}
                              name="sphLD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="sphRD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </td>
                        <td className="border-2 border-tertiary w-[12rem]">
                          <div className="flex gap-x-1">
                            <FormField
                              control={form.control}
                              name="cylLD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="cylRD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </td>
                        <td className="border-2 border-tertiary w-[12rem]">
                          <div className="flex gap-x-1">
                            <FormField
                              control={form.control}
                              name="axisLD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="axisRD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </td>
                        <td className="border-2 border-tertiary w-[12rem]">
                          <div className="flex gap-x-1">
                            <FormField
                              control={form.control}
                              name="vaLD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="vaRD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-2 border-tertiary font-bold text-[12px] w-[6rem] text-center">
                          NEAR.
                        </td>
                        <td className="border-2 border-tertiary w-[12rem]">
                          <div className="flex gap-x-1">
                            <FormField
                              control={form.control}
                              name="sphLN"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="sphRN"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </td>
                        <td className="border-2 border-tertiary w-[12rem]">
                          <div className="flex gap-x-1">
                            <FormField
                              control={form.control}
                              name="cylLN"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="cylRN"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </td>
                        <td className="border-2 border-tertiary w-[12rem]">
                          <div className="flex gap-x-1">
                            <FormField
                              control={form.control}
                              name="axisLN"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="axisRN"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </td>
                        <td className="border-2 border-tertiary w-[12rem]">
                          <div className="flex gap-x-1">
                            <FormField
                              control={form.control}
                              name="vaLN"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="vaRN"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="number"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td className="border-2 border-tertiary font-bold text-[12px] w-[6rem] text-center">
                          ADD.
                        </td>
                        <td
                          className="border-2 border-tertiary w-[12rem]"
                          colSpan={4}
                        >
                          <FormField
                            control={form.control}
                            name="addNote"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="placeholder:text-center"
                                    placeholder="--"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              {/* <div className="flex items-center">
                <FormLabel className="basis-[30%]">Left Eye</FormLabel>
                <div className="basis-[70%]">
                  <table className="">
                    <thead>
                      <tr>
                        <th className="border-2 border-tertiary"></th>
                        <th className="border-2 border-tertiary text-sm">
                          SPH
                        </th>
                        <th className="border-2 border-tertiary text-sm">
                          CYL
                        </th>
                        <th className="border-2 border-tertiary text-sm">
                          AXIS
                        </th>
                        <th className="border-2 border-tertiary text-sm">VA</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="border-2 border-tertiary font-bold text-[12px]  w-[6rem] text-center">
                          DIST.
                        </td>
                        <td className="border-2 border-tertiary w-[6rem]">
                          <FormField
                            control={form.control}
                            name="sphLD"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="placeholder:text-center"
                                    placeholder="--"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border-2 border-tertiary w-[6rem]">
                          <FormField
                            control={form.control}
                            name="cylLD"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="placeholder:text-center"
                                    placeholder="--"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border-2 border-tertiary w-[6rem]">
                          <FormField
                            control={form.control}
                            name="axisLD"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="placeholder:text-center"
                                    placeholder="--"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border-2 border-tertiary w-[6rem]">
                          <FormField
                            control={form.control}
                            name="vaLD"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="placeholder:text-center"
                                    placeholder="--"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                      </tr>
                      <tr>
                        <td className="border-2 border-tertiary font-bold text-[12px]  w-[6rem] text-center">
                          NEAR.
                        </td>
                        <td className="border-2 border-tertiary w-[6rem]">
                          <FormField
                            control={form.control}
                            name="sphLN"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="placeholder:text-center"
                                    placeholder="--"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border-2 border-tertiary w-[6rem]">
                          <FormField
                            control={form.control}
                            name="cylLN"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="placeholder:text-center"
                                    placeholder="--"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border-2 border-tertiary w-[6rem]">
                          <FormField
                            control={form.control}
                            name="axisLN"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="placeholder:text-center"
                                    placeholder="--"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                        <td className="border-2 border-tertiary w-[6rem]">
                          <FormField
                            control={form.control}
                            name="vaLN"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    className="placeholder:text-center"
                                    placeholder="--"
                                    {...field}
                                    type="number"
                                  />
                                </FormControl>
                                <FormDescription></FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div> */}
              <FormField
                control={form.control}
                name="sideNote"
                render={({ field }) => (
                  <FormItem className="flex items-center">
                    <FormLabel className="basis-[30%]">Remarks</FormLabel>
                    <div className="basis-[70%]">
                      <FormControl>
                        <Textarea
                          placeholder="Write any remarks (Optional)"
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
                <Button
                  className="bg-red-500 text-white hover:bg-red-600 hover:text-white px-12"
                  type="button"
                  onClick={() => {
                    form.reset({
                      patient: checkupId,
                    });
                  }}
                >
                  Reset
                </Button>
                <Button
                  className="bg-customPrimary hover:bg-customPrimary-80 disabled:bg-customPrimary-20 px-12"
                  type="submit"
                  disabled={!form.formState.isValid}
                >
                  {isCheckUpUpdate == true ? "Update" : "Add"}
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

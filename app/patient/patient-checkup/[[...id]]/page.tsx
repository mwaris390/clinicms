"use client";
import Loader from "@/app/_components/loader";
import PrintPatientCard from "@/app/_components/print-patient-card";
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
import { Check, ChevronsUpDown, FileUser } from "lucide-react";
import Link from "next/link";
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
    sphLD: z.string().optional(),
    cylLD: z.string().optional(),
    axisLD: z.string().optional(),
    vaLD: z.string().optional(),
    sphLN: z.string().optional(),
    cylLN: z.string().optional(),
    axisLN: z.string().optional(),
    vaLN: z.string().optional(),
    sphRD: z.string().optional(),
    cylRD: z.string().optional(),
    axisRD: z.string().optional(),
    vaRD: z.string().optional(),
    sphRN: z.string().optional(),
    cylRN: z.string().optional(),
    axisRN: z.string().optional(),
    vaRN: z.string().optional(),
    sideNote: z.string().optional(),
    addNoteL: z.string().optional(),
    addNote: z.string().optional(),
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
      addNoteL: "",
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
            addNoteL: String(value?.add_noteL || ""),
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
    // console.log(values);
    startTransition(async () => {
      const user = await GetUser();
      if (!isCheckUpUpdate) {
        const result:any = await PatientCheckup(
          Object.assign(values, {
            created_user_id: user.data?.id || "",
            updated_user_id: user.data?.id || "",
          })
        );
        console.log(result);
        if (result.status) {
          toast.success(result.message);
          setPatientData({
            patient_name: result.data.patient_checkups.patient_name,
            patient_checkup: [result.data],
          });
          // setTimeout(() => {
          //   triggerPrint?.();
          // }, 5);
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
  const [patientData, setPatientData] = useState<any>(null);
  const [triggerPrint, setTriggerPrint] = useState<() => void>();
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
    if (patientData && triggerPrint) {
      triggerPrint();
    }
  }, [patientData, triggerPrint]);
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
                    <div className="basis-[70%] flex gap-x-1">
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
                                  )?.patient_name +
                                  ", Phone No. " +
                                  data?.find(
                                    (patient) => patient.id === field.value
                                  )?.phone_no
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
                              <CommandEmpty>
                                No Patient found.{" "}
                                <span className="text-customPrimary underline">
                                  <Link href={"/create-patient"}>
                                    Create Patient
                                  </Link>
                                </span>
                              </CommandEmpty>
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
                      {field.value && (
                        <button>
                          <Link
                            href={`/patient/profile/${
                              data?.find(
                                (patient) => patient.id === field.value
                              )?.id
                            }`}
                          >
                            <FileUser size={28} className="stroke-tertiary" />
                          </Link>
                        </button>
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <div className="flex items-center">
                <FormLabel className="basis-[30%]">EYE</FormLabel>
                <div className="basis-[70%]">
                  <div className="flex gap-x-4">
                    <table className="flex-1">
                      <thead>
                        <tr>
                          <td
                            className="border-2 border-tertiary font-bold text-center"
                            colSpan={5}
                          >
                            OD
                          </td>
                        </tr>
                        <tr>
                          <td className="border-2 border-tertiary"></td>
                          <td className="border-2 border-tertiary text-center ">
                            SPH
                          </td>
                          <td className="border-2 border-tertiary text-center ">
                            CYL
                          </td>
                          <td className="border-2 border-tertiary text-center ">
                            AXIS
                          </td>
                          <td className="border-2 border-tertiary text-center ">
                            VA
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-2 border-tertiary  text-center w-20">
                            DIST.
                          </td>
                          <td className="border-2 border-tertiary w-20">
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
                                      type="text"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="border-2 border-tertiary w-20">
                            <FormField
                              control={form.control}
                              name="cylRD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="text"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="border-2 border-tertiary w-20">
                            <FormField
                              control={form.control}
                              name="axisRD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="text"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="border-2 border-tertiary w-20">
                            <FormField
                              control={form.control}
                              name="vaRD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="text"
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
                          <td className="border-2 border-tertiary w-20 text-center ">
                            ADD.
                          </td>
                          <td
                            className="border-2 border-tertiary w-20"
                            colSpan={5}
                          >
                            <FormField
                              control={form.control}
                              name="addNote"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="text"
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

                    <table className="flex-1">
                      <thead>
                        <tr>
                          <td
                            className="border-2 border-tertiary font-bold text-center"
                            colSpan={5}
                          >
                            OS
                          </td>
                        </tr>
                        <tr>
                          <td className="border-2 border-tertiary"></td>
                          <td className="border-2 border-tertiary text-center ">
                            SPH
                          </td>
                          <td className="border-2 border-tertiary text-center ">
                            CYL
                          </td>
                          <td className="border-2 border-tertiary text-center ">
                            AXIS
                          </td>
                          <td className="border-2 border-tertiary text-center ">
                            VA
                          </td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border-2 border-tertiary  text-center w-20">
                            DIST.
                          </td>
                          <td className="border-2 border-tertiary w-20">
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
                                      type="text"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="border-2 border-tertiary w-20">
                            <FormField
                              control={form.control}
                              name="cylLD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="text"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="border-2 border-tertiary w-20">
                            <FormField
                              control={form.control}
                              name="axisLD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="text"
                                    />
                                  </FormControl>
                                  <FormDescription></FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </td>
                          <td className="border-2 border-tertiary w-20">
                            <FormField
                              control={form.control}
                              name="vaLD"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="text"
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
                          <td className="border-2 border-tertiary w-20 text-center ">
                            ADD.
                          </td>
                          <td
                            className="border-2 border-tertiary w-20"
                            colSpan={5}
                          >
                            <FormField
                              control={form.control}
                              name="addNoteL"
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl className="">
                                    <Input
                                      className="placeholder:text-center"
                                      placeholder="--"
                                      {...field}
                                      type="text"
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
              </div>

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
          {patientData && (
            <PrintPatientCard
              patientData={patientData}
              showIcon={false}
              printCallByParent={(fn) => setTriggerPrint(() => fn)}
            />
          )}
        </div>
      </section>
    </>
  );
}

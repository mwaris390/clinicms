"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarClock, CalendarIcon, Copy } from "lucide-react";
import PatientCard from "../patient-card";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useState, useTransition } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  BookAppointment,
  UpdateBookAppointment,
} from "@/controller/patient/appointment/action";
import { GetUser } from "@/lib/get_user";
import { toast } from "react-hot-toast";
import Loader from "../loader";

export default function Appointment({
  patientId,
  appointmentId,
  appointmentDateTime,
  isEdit = false,
  emitter,
  data,
}: {
  patientId: string;
  appointmentId?: string;
  appointmentDateTime?: string;
  isEdit?: boolean;
  emitter?: () => void;
  data: {
    id: string;
    age: number;
    cnic: string | null;
    patient_name: string;
    father_name: string | null;
    phone_no: string;
    notes: string | null;
  };
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const baseSchema = z.object({
    patientId: z.string(),
    appointmentDate: z.date({
      required_error: "Date and time must be selected",
    }),
  });
  type FormType = z.infer<typeof baseSchema>;
  const form = useForm<FormType>({
    resolver: zodResolver(baseSchema),
    mode: "onBlur",
    defaultValues: {
      patientId: patientId,
      appointmentDate: new Date(appointmentDateTime || new Date()),
    },
  });

  function handleTimeChange(type: "hour" | "minute" | "ampm", value: string) {
    const currentDate = form.getValues("appointmentDate") || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }

    form.setValue("appointmentDate", newDate);
  }

  function onSubmit(values: FormType) {
    console.log(values);
    if (isEdit) {
      startTransition(async () => {
        const user = await GetUser();
        const result = await UpdateBookAppointment(
          Object.assign(values, {
            createdBy: user.data?.id || "",
            updatedBy: user.data?.id || "",
            appointmentId: appointmentId || "",
          })
        );
        if (result.status) {
          toast.success(result.message);
          setOpen(false);
          if (emitter) {
            emitter();
          }
        } else {
          toast.error(result.message);
        }
      });
    } else {
      startTransition(async () => {
        const user = await GetUser();
        const result = await BookAppointment(
          Object.assign(values, {
            createdBy: user.data?.id || "",
            updatedBy: user.data?.id || "",
          })
        );
        if (result.status) {
          toast.success(result.message);
          setOpen(false);
        } else {
          toast.error(result.message);
        }
      });
    }
  }
  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          form.reset(); // Reset form when closing
          setOpen(isOpen);
        }}
      >
        <DialogTrigger asChild>
          <button onClick={() => setOpen(true)}>
            {!isEdit && <CalendarClock className="stroke-teal-700" />}
            {isEdit && <CalendarClock className="stroke-customPrimary" />}
          </button>
        </DialogTrigger>
        <DialogContent aria-describedby="" className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEdit ? "Update" : "Book"} Appointment</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <PatientCard
              isCompact={true}
              isEdit={false}
              isNote={false}
              data={data}
            />
          </div>
          <div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <FormField
                  control={form.control}
                  name="appointmentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Appointment Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal border border-tertiary",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP hh:mm aa")
                              ) : (
                                <span>Pick a Date & Time</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="bg-white rounded-md shadow">
                          <div className="sm:flex">
                            <Calendar
                              className=""
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date: Date) =>
                                date <
                                new Date(
                                  new Date().getFullYear(),
                                  new Date().getMonth(),
                                  new Date().getDate()
                                )
                              }
                              initialFocus
                            />
                            <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                              <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                  {Array.from(
                                    { length: 12 },
                                    (_, i) => i + 1
                                  ).map((hour) => (
                                    <Button
                                      key={hour}
                                      size="icon"
                                      variant={
                                        field.value &&
                                        field.value.getHours() % 12 ===
                                          hour % 12
                                          ? undefined
                                          : "ghost"
                                      }
                                      className={`sm:w-full shrink-0 aspect-square  ${
                                        field.value.getHours() % 12 ===
                                        hour % 12
                                          ? "bg-customPrimary text-white hover:bg-customPrimary "
                                          : "ghost"
                                      }`}
                                      type="button"
                                      onClick={() =>
                                        handleTimeChange(
                                          "hour",
                                          hour.toString()
                                        )
                                      }
                                    >
                                      {hour}
                                    </Button>
                                  ))}
                                </div>
                                <ScrollBar
                                  orientation="horizontal"
                                  className="sm:hidden"
                                />
                              </ScrollArea>
                              <ScrollArea className="w-64 sm:w-auto">
                                <div className="flex sm:flex-col p-2">
                                  {Array.from(
                                    { length: 12 },
                                    (_, i) => i * 5
                                  ).map((minute) => (
                                    <Button
                                      key={minute}
                                      size="icon"
                                      variant={
                                        field.value &&
                                        field.value.getMinutes() === minute
                                          ? undefined
                                          : "ghost"
                                      }
                                      className={`sm:w-full shrink-0 aspect-square  ${
                                        field.value.getMinutes() === minute
                                          ? "bg-customPrimary text-white hover:bg-customPrimary "
                                          : "ghost"
                                      }`}
                                      type="button"
                                      onClick={() =>
                                        handleTimeChange(
                                          "minute",
                                          minute.toString()
                                        )
                                      }
                                    >
                                      {minute.toString().padStart(2, "0")}
                                    </Button>
                                  ))}
                                </div>
                                <ScrollBar
                                  orientation="horizontal"
                                  className="sm:hidden"
                                />
                              </ScrollArea>
                              <ScrollArea className="">
                                <div className="flex sm:flex-col p-2">
                                  {["AM", "PM"].map((ampm) => (
                                    <Button
                                      key={ampm}
                                      size="icon"
                                      variant={
                                        field.value &&
                                        ((ampm === "AM" &&
                                          field.value.getHours() < 12) ||
                                          (ampm === "PM" &&
                                            field.value.getHours() >= 12))
                                          ? undefined
                                          : "ghost"
                                      }
                                      className={`sm:w-full shrink-0 aspect-square  ${
                                        (ampm === "AM" &&
                                          field.value.getHours() < 12) ||
                                        (ampm === "PM" &&
                                          field.value.getHours() >= 12)
                                          ? "bg-customPrimary text-white hover:bg-customPrimary "
                                          : "ghost"
                                      }`}
                                      type="button"
                                      onClick={() =>
                                        handleTimeChange("ampm", ampm)
                                      }
                                    >
                                      {ampm}
                                    </Button>
                                  ))}
                                </div>
                              </ScrollArea>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter className="justify-end">
                  <DialogClose asChild>
                    <Button
                      className="bg-red-500 text-white hover:bg-red-600 hover:text-white px-6"
                      type="button"
                      size="sm"
                      onClick={() => setOpen(false)}
                    >
                      Close
                    </Button>
                  </DialogClose>
                  <Button
                    className="bg-customPrimary hover:bg-customPrimary-80 disabled:bg-customPrimary-20 px-6"
                    type="submit"
                    size="sm"
                    disabled={!form.formState.isValid}
                  >
                    Confirm
                    {isPending && <Loader />}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

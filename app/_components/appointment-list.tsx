"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  CalendarIcon,
  CalendarOff,
  CircleUserRound,
  NotebookText,
} from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import Appointment from "./modal/appointment";
import {
  CancelBookAppointment,
  ReadBookAppointment,
} from "@/controller/patient/appointment/action";
import toast from "react-hot-toast";
import NoData from "./no-data";
import { GetUser } from "@/lib/get_user";

export default function AppointmentList() {
  const [isPending, startTransition] = useTransition();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [data, setData] = useState<any[] | null | undefined>();
  function onDateChange(value: Date) {
    setSelectedDate(value);
  }

  function cancelAppointment(appointmentId: string) {
    startTransition(async () => {
      const user = await GetUser();
      const result = await CancelBookAppointment({
        appointmentId,
        updatedBy: user.data?.id || "",
      });
      if (result.status) {
        toast.success(result.message);
        setData((prevState) => {
          return prevState?.filter((data) => {
            return data.id != appointmentId;
          });
        });
      } else {
        console.log(result);

        toast.error(result.message);
      }
    });
  }

  async function FetchPendingAppointment() {
    const result = await ReadBookAppointment(selectedDate);
    if (result.status) {
     

      setData(result.data);
    } else {
      toast.error(result.message);
    }
  }

  function isUpdateAppointment() {
    FetchPendingAppointment();
  }

  useEffect(() => {
    FetchPendingAppointment();
  }, [selectedDate, data?.length]);
  return (
    <div className="rounded-md shadow-md bg-slate-50 w-full h-full p-4">
      <h2 className="text-xl font-bold text-customPrimary">
        <span>
          <NotebookText className="stroke-tertiary inline-block me-2" />
        </span>
        Appointments
      </h2>
      <div className="mt-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "pl-3 w-full text-left font-normal border border-tertiary",
                !selectedDate && "text-muted-foreground"
              )}
            >
              {selectedDate ? (
                format(selectedDate, "PPP")
              ) : (
                <span>Pick a Date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="bg-white rounded-md shadow">
            <Calendar
              onDayClick={onDateChange}
              className=""
              mode="single"
              selected={selectedDate}
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
          </PopoverContent>
        </Popover>
      </div>
      <div className="h-[85%] overflow-auto my-4">
        {data && data?.length > 0 && (
          <ul>
            {data?.map((data) => {
              return (
                <li
                  key={data.id}
                  className="w-full bg-customSecondary-20 my-4 rounded-3xl px-4 py-4  shadow"
                >
                  <div className="space-x-2 fixed right-14 flex justify-end">
                    <button
                      onClick={() => {
                        cancelAppointment(data.id);
                      }}
                    >
                      <CalendarOff className="stroke-red-500" />
                    </button>
                    <Appointment
                      patientId={data.patient_appointment.id}
                      appointmentId={data.id}
                      appointmentDateTime={data.appointment_date_time}
                      data={data.patient_appointment}
                      isEdit={true}
                      emitter={isUpdateAppointment}
                    />
                  </div>
                  <div className="flex items-center my-2">
                    <div className="w-full">
                      <CircleUserRound className="stroke-tertiary inline-block me-2 " />
                      <span className="capitalize">
                        {data.patient_appointment.patient_name}
                      </span>
                      <div className="flex justify-between w-full">
                        <span className="indent-8 text-sm text-customPrimary font-bold">
                          {data.patient_appointment.phone_no || "No Phone No."}
                        </span>
                        <span className="text-sm text-slate-500">
                          At - {format(data.appointment_date_time, "p")}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        {data && data?.length <= 0 && <NoData />}
      </div>
    </div>
  );
}

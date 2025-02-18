import AppointmentList from "./_components/appointment-list";
import NoOfCheckUps from "./_components/no-of-checkups";
import Stats from "./_components/stats";
import SubHeader from "./_components/sub-header";

export default function Home() {
  return (
    <>
      <section>
        <SubHeader title="Dashboard" />
        <div className="flex justify-between my-8">
          <div className="w-[60%]">
            <Stats />
            <NoOfCheckUps />
          </div>
          <div className="ms-12 w-[40%] border">
            <AppointmentList />
          </div>
        </div>
      </section>
    </>
  );
}

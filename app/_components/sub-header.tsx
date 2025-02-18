
export default function SubHeader({ title }: { title: string }) {
  return (
    <header className="bg-customPrimary-20 font-semibold py-2 px-8 rounded-md shadow-sm mt-8">
      {title ?? "title"}
    </header>
  );
}

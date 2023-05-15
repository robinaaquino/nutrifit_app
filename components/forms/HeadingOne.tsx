export default function HeadingOne({ label, id }: { label: any; id?: any }) {
  return (
    <>
      <h1 className="text-black text-[32px] font-bold uppercase" id={id}>
        {label}
      </h1>
    </>
  );
}

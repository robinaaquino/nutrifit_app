export default function HeadingTwo({ label, id }: { label: any; id?: any }) {
  return (
    <>
      <h2 className="mb-4 font-bold md:text-xl text-heading text-black" id={id}>
        {label}
      </h2>
    </>
  );
}

export default function HeadingTwo({ label }: { label: any }) {
  return (
    <>
      <h2 className="mb-4 font-bold md:text-xl text-heading text-black">
        {label}
      </h2>
    </>
  );
}

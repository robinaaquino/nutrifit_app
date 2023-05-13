export default function InputSubmit({ label }: { label: any }) {
  return (
    <>
      <input
        type="submit"
        value={label}
        className="border-primary w-full cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green mb-6"
      />
    </>
  );
}

export default function InputSubmit({ label }: { label: any }) {
  return (
    <>
      <input
        type="submit"
        value={label}
        // className="border-primary w-full cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green mb-6"
        className="inline-flex w-full justify-center rounded-md bg-nf_green px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-nf_dark_blue cursor-pointer sm:ml-3 sm:w-auto"
      />
    </>
  );
}

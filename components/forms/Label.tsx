export default function Label({ label, id }: { label: string; id: string }) {
  return (
    <>
      <label
        className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 text-left"
        htmlFor={id}
      >
        {label}
      </label>
    </>
  );
}

export default function TableRowText({ text }: { text: string }) {
  return (
    <>
      <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
        <div>
          <h2 className="font-medium text-black  ">{text}</h2>
        </div>
      </td>
    </>
  );
}

import { useRouter } from "next/navigation";

export default function TableRowText({
  text,
  type,
  tableKey,
  key,
}: {
  text: string;
  type: string;
  tableKey: string;
  key: number;
}) {
  const router = useRouter();
  return (
    <>
      {tableKey == "id" ? (
        <td
          className="px-4 py-4 text-sm font-medium whitespace-nowrap cursor-pointer underline"
          key={key}
        >
          <div>
            <h2
              className="font-medium text-blue-500 "
              onClick={() => {
                router.push(`/${type}/${text}`);
              }}
            >
              {text}
            </h2>
          </div>
        </td>
      ) : (
        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap ">
          <div>
            <h2 className="font-medium text-black ">{text ? text : ""}</h2>
          </div>
        </td>
      )}
    </>
  );
}

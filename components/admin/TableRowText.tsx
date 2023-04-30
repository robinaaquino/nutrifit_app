import { useRouter } from "next/navigation";

export default function TableRowText({
  text,
  type,
  tableKey,
  key,
  isAdmin,
}: {
  text: string;
  type: string;
  tableKey: string;
  key: number;
  isAdmin: boolean;
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
                if (isAdmin && type == "order") {
                  router.push(`/admin/${type}/${text}`);
                } else {
                  router.push(`/${type}/${text}`);
                }
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

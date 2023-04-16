export default function TableRowStatus({ type }: { type: string }) {
  return (
    <>
      <td className="px-12 py-4 text-sm font-medium whitespace-nowrap">
        {type == "pending" ? (
          <div className="inline px-3 py-1 text-sm font-normal rounded-full text-white gap-x-2 bg-yellow-600">
            Pending
          </div>
        ) : type == "success" ? (
          <div className="inline px-3 py-1 text-sm font-normal rounded-full text-white gap-x-2 bg-nf_green">
            Success
          </div>
        ) : type == "cancelled" ? (
          <div className="inline px-3 py-1 text-sm font-normal rounded-full text-white gap-x-2 bg-red-600">
            Cancelled
          </div>
        ) : (
          <div className="inline px-3 py-1 text-sm font-normal rounded-full text-white gap-x-2 bg-gray-500">
            {type}
          </div>
        )}
      </td>
    </>
  );
}

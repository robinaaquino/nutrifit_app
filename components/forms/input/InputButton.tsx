export default function InputButton({
  label,
  type,
  handleClick,
  color,
}: {
  label: any;
  type?: any;
  handleClick?: any;
  color?: any;
}) {
  var colorClass = " text-white bg-nf_green hover:bg-nf_dark_blue ";
  if (color == "error") {
    colorClass = " text-white bg-red-500 hover:bg-red-800 ";
  } else if (color == "blank") {
    colorClass =
      " text-black border border-gray-500 hover:bg-gray-500 hover:text-white ";
  }

  return (
    <>
      <input
        type="button"
        value={label}
        className={
          type == "multiple"
            ? `inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm font-semibold shadow-sm  cursor-pointer sm:ml-3 sm:w-auto ${colorClass}`
            : `w-full font-semibold cursor-pointer rounded-md border py-3 px-5 transition mb-6 ${colorClass}`
        }
        onClick={() => handleClick()}
      />
    </>
  );
}

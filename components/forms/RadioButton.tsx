export default function RadioButton({
  name,
  id,
  value,
  handleInput,
}: {
  name: string;
  id: string;
  value: string;
  handleInput: any;
}) {
  return (
    <>
      <div className="flex space-x-2 items-center justify-start ">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          onChange={(event) => handleInput(event.target.value)}
          className="form-radio text-black  bg-gray-200 border border-gray-500 checked:border-none checked:bg-black cursor-pointer
                                              "
        />
        <div className="inline-block">
          <div className="flex space-x-6 justify-center items-center">
            <label
              htmlFor={value}
              className="mr-2 text-sm leading-3 font-normal text-black"
            >
              {value}
            </label>
          </div>
        </div>

        <br />
      </div>
    </>
  );
}

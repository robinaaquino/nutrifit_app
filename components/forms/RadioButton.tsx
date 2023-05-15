export default function RadioButton({
  name,
  id,
  value,
  handleInput,
  isBoolean,
  label,
  checkedFunction,
  disabled,
  register,
}: {
  name: string;
  id: string;
  value: string;
  label: string;
  handleInput?: any;
  isBoolean?: boolean;
  checkedFunction?: boolean;
  disabled?: boolean;
  register?: any;
}) {
  return (
    <>
      <div className="flex space-x-2 items-center justify-start mt-2">
        <input
          type="radio"
          id={id}
          name={name}
          value={value}
          {...(register &&
            register(name, {
              onChange: (e: any) =>
                handleInput
                  ? isBoolean
                    ? handleInput(e.target.value == "true" ? true : false)
                    : handleInput(e.target.value)
                  : null,
            }))}
          className={
            "form-radio text-black  bg-gray-200 border border-gray-500 checked:border-none checked:bg-black" +
            (disabled ? "" : "cursor-pointer")
          }
          disabled={disabled}
          checked={checkedFunction}
        />
        <div className="inline-block">
          <div className="flex space-x-6 justify-center items-center">
            <label
              htmlFor={value}
              className="mr-2 text-sm leading-3 font-normal text-black"
            >
              {label}
            </label>
          </div>
        </div>

        <br />
      </div>
    </>
  );
}

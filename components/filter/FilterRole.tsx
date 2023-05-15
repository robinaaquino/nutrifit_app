import RadioButton from "../forms/RadioButton";

export default function FilterRole({
  handleFilterRole,
  register,
}: {
  handleFilterRole: any;
  register: any;
}) {
  return (
    <>
      <div className="pr-2 pt-2">
        <div className="flex text-black">
          <p className="leading-5 text-sm font-bold">Role</p>
        </div>
        <div className="flex pt-2">
          <RadioButton
            name={"role"}
            id={"customer"}
            register={register}
            value={"customer"}
            label={"Customer"}
            handleInput={handleFilterRole}
          />

          <RadioButton
            name={"role"}
            id={"admin"}
            register={register}
            value={"admin"}
            label={"Admin"}
            handleInput={handleFilterRole}
          />
        </div>
      </div>
    </>
  );
}

import RadioButton from "../forms/RadioButton";

export default function FilterStatus({
  type,
  register,
  handleFilterStatus,
}: {
  type: string;
  register: any;
  handleFilterStatus: any;
}) {
  return (
    <div className="pr-2 pt-2">
      <div className="flex text-black">
        <p className="leading-5 text-sm font-bold">Status</p>
      </div>
      {type == "order" ? (
        <div className="flex pt-2">
          <RadioButton
            name={"status"}
            id={"pending"}
            register={register}
            value={"pending"}
            label={"Pending"}
            handleInput={handleFilterStatus}
          />

          <RadioButton
            name={"status"}
            id={"delivered"}
            register={register}
            value={"delivered"}
            label={"Delivered"}
            handleInput={handleFilterStatus}
          />

          <RadioButton
            name={"status"}
            register={register}
            id={"cancelled"}
            value={"cancelled"}
            label={"Cancelled"}
            handleInput={handleFilterStatus}
          />
        </div>
      ) : type == "message" ? (
        <div className="flex pt-2">
          <RadioButton
            name={"message"}
            id={"unread"}
            register={register}
            value={"unread"}
            label={"Unread"}
            handleInput={handleFilterStatus}
          />
          <RadioButton
            name={"message"}
            id={"replied"}
            register={register}
            value={"replied"}
            label={"Replied"}
            handleInput={handleFilterStatus}
          />
        </div>
      ) : null}
    </div>
  );
}

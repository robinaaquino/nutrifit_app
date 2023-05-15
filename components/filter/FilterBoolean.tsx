import RadioButton from "../forms/RadioButton";

export default function FilterBoolean({
  register,
  handleFilterBoolean,
  type,
}: {
  register: any;
  type: string;
  handleFilterBoolean: any;
}) {
  return (
    <>
      {type == "inStock" ? (
        <div className="pr-2 pt-2">
          <div className="flex text-black">
            <p className="leading-5 text-sm font-bold">In Stock</p>
          </div>
          <div className="flex pt-2">
            <RadioButton
              name={"inputInStock"}
              id={"inputInStockTrue"}
              value={"true"}
              label={"True"}
              register={register}
              handleInput={handleFilterBoolean}
              isBoolean={true}
            />

            <RadioButton
              name={"inputInStock"}
              id={"inputInStockFalse"}
              value={"false"}
              label={"False"}
              register={register}
              handleInput={handleFilterBoolean}
              isBoolean={true}
            />
          </div>
        </div>
      ) : type == "reviewedByAdmin" ? (
        <div className="pr-2 pt-2">
          <div className="flex text-black">
            <p className="leading-5 text-sm font-bold">Reviewed By Admin</p>
          </div>
          <div className="flex pt-2">
            <RadioButton
              name={"inputReviewedByAdmin"}
              id={"inputReviewedByAdminTrue"}
              value={"true"}
              label={"Reviewed"}
              register={register}
              isBoolean={true}
              handleInput={handleFilterBoolean}
            />

            <RadioButton
              name={"inputReviewedByAdmin"}
              id={"inputReviewedByAdminFalse"}
              value={"false"}
              label={"Not reviewed"}
              register={register}
              isBoolean={true}
              handleInput={handleFilterBoolean}
            />
          </div>
        </div>
      ) : null}
    </>
  );
}

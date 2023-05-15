import InputComponent from "../forms/input/InputComponent";

export default function FilterPrice({
  register,
  minimumPrice,
  maximumPrice,
  handleMinPriceFunction,
  handleMaxPriceFunction,
}: {
  register: any;
  minimumPrice: any;
  maximumPrice: any;
  handleMinPriceFunction: any;
  handleMaxPriceFunction: any;
}) {
  return (
    <>
      <div className="pr-2 pt-2">
        <div className="flex text-black">
          <p className="leading-5 text-sm font-bold">Price</p>
        </div>
        <div className="flex pt-2">
          <InputComponent
            id="minimumPrice"
            name="inputMinimumPrice"
            type="number"
            value={minimumPrice}
            register={register}
            rules={{
              onChange: (e: any) => {
                handleMinPriceFunction(parseInt(e.target.value));
              },
            }}
          />
          <p className="text-black px-2 text-lg">-</p>
          <InputComponent
            id="maximumPrice"
            name="inputMaximumPrice"
            type="number"
            value={maximumPrice}
            register={register}
            rules={{
              onChange: (e: any) => {
                handleMaxPriceFunction(parseInt(e.target.value));
              },
            }}
          />
        </div>
      </div>
    </>
  );
}

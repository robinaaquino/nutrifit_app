import RadioButton from "../forms/RadioButton";
import { PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY } from "@/firebase/constants";

export default function FilterCategory({
  register,
  filterCategory,
  handleFilterCategory,
}: {
  register: any;
  filterCategory: any;
  handleFilterCategory: any;
}) {
  return (
    <>
      <div className="p-2">
        <div className="flex text-black">
          <p className="leading-5 text-sm font-bold">Category</p>
        </div>
        <div className="p-2">
          {PRODUCT_CATEGORIES_PUBLIC_NAME_ARRAY.map((e) => {
            return (
              <>
                <RadioButton
                  name={"inputProductCategory"}
                  id={e}
                  value={e}
                  checkedFunction={filterCategory == e ? true : false}
                  register={register}
                  handleInput={handleFilterCategory}
                  label={e}
                />
              </>
            );
          })}
        </div>
      </div>
    </>
  );
}

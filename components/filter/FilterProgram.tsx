import { WellnessRemarksEnum } from "@/firebase/constants/enum_constants";
import RadioButton from "../forms/RadioButton";

export default function FilterProgram({
  register,
  handleFilterProgram,
}: {
  register: any;
  handleFilterProgram: any;
}) {
  return (
    <>
      <div className="pr-2 pt-2">
        <div className="flex text-black">
          <p className="leading-5 text-sm font-bold">Program</p>
        </div>
        <div className="flex pt-2">
          <RadioButton
            name={"inputProgramType"}
            id={"gain"}
            register={register}
            value={WellnessRemarksEnum.GAIN}
            label={WellnessRemarksEnum.GAIN}
            handleInput={handleFilterProgram}
          />
          <RadioButton
            name={"inputProgramType"}
            id={"maintenance"}
            register={register}
            value={WellnessRemarksEnum.MAINTENANCE}
            label={WellnessRemarksEnum.MAINTENANCE}
            handleInput={handleFilterProgram}
          />
          <RadioButton
            name={"inputProgramType"}
            id={"loss"}
            register={register}
            value={WellnessRemarksEnum.LOSS}
            label={WellnessRemarksEnum.LOSS}
            handleInput={handleFilterProgram}
          />
        </div>
      </div>
    </>
  );
}

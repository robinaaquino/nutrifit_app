import { WellnessRemarks } from "@/firebase/constants";
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
            value={WellnessRemarks.GAIN}
            label={WellnessRemarks.GAIN}
            handleInput={handleFilterProgram}
          />
          <RadioButton
            name={"inputProgramType"}
            id={"maintenance"}
            register={register}
            value={WellnessRemarks.MAINTENANCE}
            label={WellnessRemarks.MAINTENANCE}
            handleInput={handleFilterProgram}
          />
          <RadioButton
            name={"inputProgramType"}
            id={"loss"}
            register={register}
            value={WellnessRemarks.LOSS}
            label={WellnessRemarks.LOSS}
            handleInput={handleFilterProgram}
          />
        </div>
      </div>
    </>
  );
}

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import nookies from "nookies";
import admin from "../../firebase/admin-config";
import { useForm } from "react-hook-form";

import { useAuthContext } from "@/context/AuthContext";

import {
  WellnessDatabaseTypeFromDB,
  WellnessDatabaseType,
  WellnessQuestionsKeys,
} from "@/firebase/constants/wellness_constants";

import {
  WellnessRemarksEnum,
  CollectionsEnum,
} from "@/firebase/constants/enum_constants";

import { getDocumentGivenTypeAndIdFunction } from "@/firebase/firebase_functions/general_functions";

import InputComponent from "@/components/forms/input/InputComponent";
import WarningMessage from "@/components/forms/WarningMessage";

export default function WellnessSurveyShow(props: any) {
  const router = useRouter();
  const { id } = router.query;
  const { error, success } = useAuthContext();

  const [userId, setUserId] = useState<string>("");
  const [wellnessSurvey, setWellnessSurvey] = useState<any[]>([]);
  const [name, setName] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [height, setHeight] = useState<number>(0);
  const [age, setAge] = useState<number>(0);
  const [weight, setWeight] = useState<number>(0);

  const [date, setDate] = useState<string>("");
  const [fat, setFat] = useState<string>("");
  const [visceralFat, setVisceralFat] = useState<string>("");
  const [boneMass, setBoneMass] = useState<string>("");
  const [restingMetabolicRate, setRestingMetabolicRate] = useState<string>("");
  const [metabolicAge, setMetabolicAge] = useState<string>("");
  const [muscleMass, setMuscleMass] = useState<string>("");
  const [physiqueRating, setPhysiqueRating] = useState<string>("");
  const [water, setWater] = useState<string>("");

  const [presentWeight, setPresentWeight] = useState(0);
  const [idealWeight, setIdealWeight] = useState(0);
  const [weightStatus, setWeightStatus] = useState("");
  const [weightStatusNumber, setWeightStatusNumber] = useState(0);
  const [idealVisceral, setIdealVisceral] = useState(0);

  const [program, setProgram] = useState("");
  const [mealPlan, setMealPlan] = useState("");

  const [reviewedByAdmin, setReviewedByAdmin] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      wellness: [],

      inputName: "",
      inputContactNumber: "",
      inputGender: "",
      inputAge: 0,
      inputHeight: 0,
      inputWeight: 0,

      inputDate: "",
      inputFat: "",
      inputVisceralFat: "",
      inputBoneMass: "",
      inputRestingMetabolicRate: "",
      inputMetabolicAge: "",
      inputMuscleMass: "",
      inputPhysiqueRating: "",
      inputWater: "",

      inputPresentWeight: 0,
      inputIdealWeight: 0,
      inputWeightStatus: "",
      inputWeightStatusNumber: "",
      inputIdealVisceral: 0,

      inputProgram: "",
      inputMealPlan: "",

      inputReviewedByAdmin: false,
    },
  });

  const handleForm = async (data: any, e: any) => {
    e.preventDefault();

    const {
      wellness,
      inputName,
      inputContactNumber,

      inputGender,
      inputAge,
      inputHeight,
      inputWeight,

      inputDate,
      inputFat,
      inputVisceralFat,
      inputBoneMass,
      inputRestingMetabolicRate,
      inputMetabolicAge,
      inputMuscleMass,
      inputPhysiqueRating,
      inputWater,

      inputReviewedByAdmin,
    } = data;

    const resultObject: WellnessDatabaseType = {
      user_id: userId,
      wellness_survey: wellness,
      name: inputName,
      contact_number: inputContactNumber,
      gender: inputGender,
      height: inputHeight,
      age: inputAge,
      weight: inputWeight,

      wellness_trainer_information: {
        date: inputDate,
        fat: inputFat,
        visceral_fat: inputVisceralFat,
        bone_mass: inputBoneMass,
        resting_metabolic_rate: inputRestingMetabolicRate,
        metabolic_age: inputMetabolicAge,
        muscle_mass: inputMuscleMass,
        physique_rating: inputPhysiqueRating,
        water: inputWater,
      },
    };
  };

  async function fetchWellnessSurveyResult() {
    var idInput = "";
    if (id) {
      if (id[0]) {
        idInput = id.toString();
      } else if (typeof id == "string") {
        idInput = id;
      }
    }

    const result = await getDocumentGivenTypeAndIdFunction(
      CollectionsEnum.WELLNESS,
      idInput
    );
    console.log(result);

    if (!result.isSuccess) {
      error(result.message);
    } else {
      const wellnessSurveyResultObject: WellnessDatabaseTypeFromDB =
        result.result as WellnessDatabaseTypeFromDB;

      if (
        wellnessSurveyResultObject.user_id &&
        wellnessSurveyResultObject.user_id != props.user
      ) {
        error("Unauthorized access");
        router.push("/");
      }

      setUserId(wellnessSurveyResultObject.user_id);
      setWellnessSurvey(wellnessSurveyResultObject.wellness_survey);
      setName(wellnessSurveyResultObject.name);
      setContactNumber(wellnessSurveyResultObject.contact_number);
      setGender(wellnessSurveyResultObject.gender);
      setHeight(wellnessSurveyResultObject.height);
      setAge(wellnessSurveyResultObject.age);
      setWeight(wellnessSurveyResultObject.weight);

      setDate(wellnessSurveyResultObject.wellness_trainer_information.date);
      setFat(wellnessSurveyResultObject.wellness_trainer_information.fat);
      setVisceralFat(
        wellnessSurveyResultObject.wellness_trainer_information.visceral_fat
      );
      setBoneMass(
        wellnessSurveyResultObject.wellness_trainer_information.bone_mass
      );
      setRestingMetabolicRate(
        wellnessSurveyResultObject.wellness_trainer_information
          .resting_metabolic_rate
      );
      setMetabolicAge(
        wellnessSurveyResultObject.wellness_trainer_information.metabolic_age
      );
      setMuscleMass(
        wellnessSurveyResultObject.wellness_trainer_information.muscle_mass
      );
      setPhysiqueRating(
        wellnessSurveyResultObject.wellness_trainer_information.physique_rating
      );
      setWater(wellnessSurveyResultObject.wellness_trainer_information.water);

      setPresentWeight(
        wellnessSurveyResultObject.wellness_remarks.present_weight
      );
      setIdealWeight(wellnessSurveyResultObject.wellness_remarks.ideal_weight);
      setWeightStatus(
        wellnessSurveyResultObject.wellness_remarks.weight_status
      );
      console.log(wellnessSurveyResultObject.wellness_remarks.weight_status);
      setWeightStatusNumber(
        wellnessSurveyResultObject.wellness_remarks.weight_status_number
      );
      setIdealVisceral(
        wellnessSurveyResultObject.wellness_remarks.ideal_visceral
      );
      setProgram(wellnessSurveyResultObject.program);
      setMealPlan(wellnessSurveyResultObject.meal_plan);

      setReviewedByAdmin(wellnessSurveyResultObject.reviewed_by_admin);
    }
  }

  useEffect(() => {
    fetchWellnessSurveyResult();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit(handleForm)} className="w-1/2 mx-auto">
        <h2 className="mt-6 mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
          Wellness Survey
        </h2>
        <h3 className="mb-2 ml-2 text-2xl font-bold tracking-tight text-gray-900">
          Personal Details
        </h3>
        {/* Personal Details */}
        <div>
          {/* Name */}
          <InputComponent
            id={"name"}
            name={"inputName"}
            label={"Name"}
            type={"text"}
            placeholder={"Type your name..."}
            value={name}
            register={register}
            rules={{
              required: "Name is required",
              onChange: (e: any) => setName(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputName ? "true" : "false"}
          />
          {/* Contact Number */}
          <InputComponent
            id={"contactNumber"}
            name={"inputContactNumber"}
            label={"Contact Number"}
            type={"text"}
            placeholder={"Type your contact number..."}
            value={contactNumber}
            register={register}
            rules={{
              required: "Contact number is required",
              onChange: (e: any) => setContactNumber(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputContactNumber ? "true" : "false"}
          />
          {/* Gender */}
          <InputComponent
            id={"gender"}
            name={"inputGender"}
            label={"Gender"}
            type={"text"}
            placeholder={"Type your gender..."}
            value={gender}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setGender(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputGender ? "true" : "false"}
          />
          {/* Age */}
          <InputComponent
            id={"age"}
            name={"inputAge"}
            label={"Age"}
            type={"number"}
            placeholder={"Type your age..."}
            value={age}
            register={register}
            rules={{
              required: "Age is required",
              onChange: (e: any) => setAge(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputAge ? "true" : "false"}
          />
          {/* Height */}
          <InputComponent
            id={"height"}
            name={"inputHeight"}
            label={"Height (meters)"}
            type={"number"}
            placeholder={"Type your height..."}
            value={height}
            register={register}
            rules={{
              required: "Height is required",
              onChange: (e: any) => setHeight(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputHeight ? "true" : "false"}
          />
          {/* Weight */}
          <InputComponent
            id={"weight"}
            name={"inputWeight"}
            label={"Weight (kilograms)"}
            type={"number"}
            placeholder={"Type your weight..."}
            value={weight}
            register={register}
            rules={{
              required: "Weight is required",
              onChange: (e: any) => setWeight(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputWeight ? "true" : "false"}
          />
        </div>
        {/* Questions */}
        <h3 className="mt-5 mb-2 ml-2 text-2xl font-bold tracking-tight text-gray-900">
          Wellness Questions
        </h3>
        <p className="mb-2 ml-2 tracking-tight text-gray-900">
          Please check the boxes for YES answers
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 grid-rows-7">
          {Object.keys(WellnessQuestionsKeys).map((key: string) => {
            return (
              <>
                <div className="flex text-black items-center mb-2">
                  <input
                    id={key}
                    type="checkbox"
                    checked={wellnessSurvey.includes(key)}
                    value={key}
                    {...register("wellness")}
                    className="mx-3 block checkbox checkbox-success"
                  />
                  <label htmlFor={key}>{WellnessQuestionsKeys[key]}</label>
                </div>
              </>
            );
          })}
        </div>
        <h3 className="mt-5 mb-2 ml-2 text-2xl font-bold tracking-tight text-gray-900">
          Results
        </h3>
        <p className="mb-2 ml-2 tracking-tight text-gray-900">
          This section is not necessary to be filled by customers unless in the
          presence of employees.
        </p>
        {/* Wellness Trainer Information */}
        <div>
          {/* Date */}
          <InputComponent
            id={"date"}
            name={"inputDate"}
            label={"Date"}
            type={"date"}
            placeholder={"Type your date..."}
            value={date}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setDate(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputDate ? "true" : "false"}
          />

          {/* Fat */}
          <InputComponent
            id={"fat"}
            name={"inputFat"}
            label={"Fat %"}
            type={"text"}
            placeholder={"Type the fat %..."}
            value={fat}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setFat(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputFat ? "true" : "false"}
          />

          {/* Visceral Fat */}
          <InputComponent
            id={"visceralFat"}
            name={"inputVisceralFat"}
            label={"Visceral Fat"}
            type={"text"}
            placeholder={"Type the visceral fat..."}
            value={visceralFat}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setVisceralFat(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputVisceralFat ? "true" : "false"}
          />

          {/* Bone Mass */}
          <InputComponent
            id={"boneMass"}
            name={"inputBoneMass"}
            label={"Bone Mass"}
            type={"text"}
            placeholder={"Type the bone mass..."}
            value={boneMass}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setBoneMass(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputBoneMass ? "true" : "false"}
          />

          {/* Resting Metabolic Rate (Calories burned at rest) */}
          <InputComponent
            id={"restingMetabolicRate"}
            name={"inputRestingMetabolicRate"}
            label={"Resting Metabolic Rate (Calories burned at rest)"}
            type={"text"}
            placeholder={"Type the resting metabolic rate..."}
            value={restingMetabolicRate}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setRestingMetabolicRate(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputRestingMetabolicRate ? "true" : "false"}
          />

          {/* Metabolic Age */}
          <InputComponent
            id={"metabolicAge"}
            name={"inputMetabolicAge"}
            label={"Metabolic Age"}
            type={"text"}
            placeholder={"Type the metabolic age..."}
            value={metabolicAge}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setMetabolicAge(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputMetabolicAge ? "true" : "false"}
          />

          {/* Muscle Mass */}
          <InputComponent
            id={"muscleMass"}
            name={"inputMuscleMass"}
            label={"Muscle Mass"}
            type={"text"}
            placeholder={"Type the muscle mass..."}
            value={muscleMass}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setMuscleMass(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputMuscleMass ? "true" : "false"}
          />

          {/* Physique Rating */}
          <InputComponent
            id={"physiqueRating"}
            name={"inputPhysiqueRating"}
            label={"Physique Rating"}
            type={"text"}
            placeholder={"Type the physique rating..."}
            value={physiqueRating}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setPhysiqueRating(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputPhysiqueRating ? "true" : "false"}
          />

          {/* Water % */}
          <InputComponent
            id={"water"}
            name={"inputWater"}
            label={"Water %"}
            type={"text"}
            placeholder={"Type the water %..."}
            value={water}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setWater(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputWater ? "true" : "false"}
          />
        </div>

        {/* Wellness Remarks */}
        <h3 className="mt-5 mb-2 ml-2 text-2xl font-bold tracking-tight text-gray-900">
          Wellness Remarks
        </h3>
        <div>
          {/* Admin Review Status */}
          <InputComponent
            id={"reviewedByAdmin"}
            name={"inputReviewedByAdmin"}
            label={"Admin Review Status"}
            type={"text"}
            placeholder={""}
            value={
              reviewedByAdmin
                ? "Reviewed by admin"
                : "Pending review from admin"
            }
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setReviewedByAdmin(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputReviewedByAdmin ? "true" : "false"}
          />

          {/* Present Weight % */}
          <InputComponent
            id={"presentWeight"}
            name={"inputPresentWeight"}
            label={"Present Weight"}
            type={"text"}
            placeholder={"Type the present weight..."}
            value={presentWeight}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setPresentWeight(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputPresentWeight ? "true" : "false"}
          />

          {/* Ideal Weight */}
          <InputComponent
            id={"idealWeight"}
            name={"inputIdealWeight"}
            label={"Ideal Weight"}
            type={"text"}
            placeholder={"Type the ideal weight..."}
            value={idealWeight}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setIdealWeight(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputIdealWeight ? "true" : "false"}
          />

          {/* Weight */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="weight_status"
            >
              Weight Status
            </label>
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="weight_status"
              {...register("inputWeightStatus", {
                required: "Weight status is required",
                onChange: (e: any) => setWeightStatus(e.target.value),
                disabled: true,
              })}
              aria-invalid={errors.inputWeightStatus ? "true" : "false"}
            >
              <option
                value="excess"
                key="excess"
                selected={weightStatus == "excess" ? true : false}
                // selected={true}
              >
                Excess
              </option>

              <option
                value="lack"
                key="lack"
                selected={weightStatus == "lack" ? true : false}
              >
                Lack
              </option>
            </select>
          </div>

          {/* Weight Status Number */}
          <InputComponent
            id={"weightStatusNumber"}
            name={"inputWeightStatusNumber"}
            label={"Weight (in excess or lacking of)"}
            type={"text"}
            placeholder={"Type the weight in excess or lacking weight..."}
            value={weightStatusNumber}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setWeightStatusNumber(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputWeightStatusNumber ? "true" : "false"}
          />

          {/* Ideal Visceral */}
          <InputComponent
            id={"idealVisceral"}
            name={"inputIdealVisceral"}
            label={"Ideal Visceral Fat"}
            type={"text"}
            placeholder={"Type the ideal visceral fat..."}
            value={idealVisceral}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setIdealVisceral(e.target.value),
              disabled: true,
            }}
            error={errors}
            disabled={true}
            aria-invalid={errors.inputIdealVisceral ? "true" : "false"}
          />
        </div>

        <div>
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="program"
            >
              Program
            </label>
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="program"
              {...register("inputProgram", {
                required: "Program is required",
                onChange: (e: any) => setProgram(e.target.value),
                disabled: true,
              })}
              aria-invalid={errors.inputProgram ? "true" : "false"}
            >
              <option
                value={WellnessRemarksEnum.GAIN}
                key="gain"
                selected={program == WellnessRemarksEnum.GAIN ? true : false}
              >
                {WellnessRemarksEnum.GAIN}
              </option>

              <option
                value={WellnessRemarksEnum.MAINTENANCE}
                key="maintenance"
                selected={
                  program == WellnessRemarksEnum.MAINTENANCE ? true : false
                }
              >
                {WellnessRemarksEnum.MAINTENANCE}
              </option>

              <option
                value={WellnessRemarksEnum.LOSS}
                key="loss"
                selected={program == WellnessRemarksEnum.LOSS ? true : false}
              >
                {WellnessRemarksEnum.LOSS}
              </option>
            </select>
          </div>

          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="meal_plan"
            >
              Meal Plan
            </label>
            <textarea
              className="w-full px-4 py-3 text-xs border border-gray-300 rounded lg:text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 bg-white text-black"
              cols={20}
              rows={4}
              value={mealPlan}
              {...register("inputMealPlan", {
                required: "Meal plan is required",
                onChange: (e: any) => setMealPlan(e.target.value),
                disabled: true,
              })}
              aria-invalid={errors.inputMealPlan ? "true" : "false"}
            ></textarea>
            {errors.inputMealPlan && (
              <WarningMessage text={errors.inputMealPlan?.message} />
            )}
          </div>
        </div>
        {/* <div className="text-center p-2">
          <input
            type="submit"
            value="Submit Survey"
            className="cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
          />
        </div> */}

        {/* Wellness Results */}
      </form>
    </>
  );
}

export async function getServerSideProps(context: any) {
  let props: any = {
    user: "",
    userInfo: null,
    isError: true,
    message: "Unauthorized access",
    redirect: "/login",
  };

  try {
    const cookies = nookies.get(context);
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    props.user = uid;
    props.isError = false;
    props.message = `Your email is ${email} and your UID is ${uid}.`;
    props.message = "";
    props.redirect = "";

    const getUserInfoResult = await getDocumentGivenTypeAndIdFunction(
      CollectionsEnum.USER,
      uid
    );

    if (getUserInfoResult.isSuccess) props.userInfo = getUserInfoResult.result;

    return { props };
  } catch (err) {
    return { props };
  }
}

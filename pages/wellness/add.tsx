import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import nookies from "nookies";
import admin from "../../firebase/admin-config";

import {
  WellnessDatabaseType,
  WellnessQuestionsKeys,
} from "@/firebase/constants/wellness_constants";
import { getDocumentGivenTypeAndIdFunction } from "@/firebase/firebase_functions/general_functions";
import { addWellnessSurveyResult } from "@/firebase/firebase_functions/wellness_functions";

import InputComponent from "@/components/forms/input/InputComponent";
import InputSubmit from "@/components/forms/input/InputSubmit";
import { CollectionsEnum } from "@/firebase/constants/enum_constants";

export default function WellnessSurvey(props: any) {
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

  const { error, success } = useAuthContext();
  const router = useRouter();

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

    const addResultResult = await addWellnessSurveyResult(resultObject);

    if (addResultResult.isSuccess) {
      success(addResultResult.message);

      router.push("/");
    } else {
      error(addResultResult.message);
    }
  };

  useEffect(() => {
    if (props.user) {
      setUserId(props.user);
    }

    if (props.userInfo) {
      if (props.userInfo.shipping_details) {
        if (
          props.userInfo.shipping_details.first_name &&
          props.userInfo.shipping_details.last_name
        ) {
          setName(
            props.userInfo.shipping_details.first_name +
              " " +
              props.userInfo.shipping_details.last_name
          );
        }

        if (props.userInfo.shipping_details.contact_number) {
          setContactNumber(props.userInfo.shipping_details.contact_number);
        }
      }
    }
  }, [props]);

  if (props.isError) {
    error(props.message);
    router.push(props.redirect);
    return null;
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleForm)} className="w-1/2 mx-auto py-2">
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
            }}
            error={errors}
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
              pattern: {
                value: /^[+]?[0-9]*$/,
                message: "Please, enter a valid contact number",
              },
              onChange: (e: any) => setContactNumber(e.target.value),
            }}
            error={errors}
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
            }}
            error={errors}
            aria-invalid={errors.inputGender ? "true" : "false"}
          />
          {/* <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="gender"
            >
              Gender
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="gender"
              type="text"
              placeholder="Type your gender..."
              value={gender}
              {...(register("inputGender"),
              {
                required: false,
                onChange: (e: any) => setGender(e.target.value),

              })}
            />
          </div> */}
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
              pattern: {
                value: /^[0-9]*$/,
                message: "Please, enter a valid number",
              },
              onChange: (e: any) => setAge(e.target.value),
            }}
            error={errors}
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
              pattern: {
                value: /^[0-9]*$/,
                message: "Please, enter a valid number",
              },
              onChange: (e: any) => setHeight(e.target.value),
            }}
            error={errors}
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
              pattern: {
                value: /^[0-9]*$/,
                message: "Please, enter a valid number",
              },
              onChange: (e: any) => setWeight(e.target.value),
            }}
            error={errors}
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
            placeholder={"Type the date..."}
            value={date}
            register={register}
            rules={{
              required: false,
              onChange: (e: any) => setDate(e.target.value),
            }}
            error={errors}
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
              pattern: {
                value: /^[0-9]*.?[0-9]+$/,
                message: "Please, enter a valid number",
              },
              onChange: (e: any) => setFat(e.target.value),
            }}
            error={errors}
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
              pattern: {
                value: /^[0-9]*.?[0-9]+$/,
                message: "Please, enter a valid number",
              },
              onChange: (e: any) => setVisceralFat(e.target.value),
            }}
            error={errors}
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
              pattern: {
                value: /^[0-9]*.?[0-9]+$/,
                message: "Please, enter a valid number",
              },
              onChange: (e: any) => setBoneMass(e.target.value),
            }}
            error={errors}
            aria-invalid={errors.inputBoneMass ? "true" : "false"}
          />
          {/* <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="bone_mass"
            >
              Bone Mass
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="bone_mass"
              type="text"
              placeholder="Type the bone mass..."
              value={boneMass}
              {...register("inputBoneMass", {
                required: false,
                onChange: (e: any) => setBoneMass(e.target.value),

              })}
              aria-invalid={errors.inputBoneMass ? "true" : "false"}
            />
            {errors.inputBoneMass && (
              <WarningMessage text={errors.inputBoneMass?.message} />
            )}
          </div> */}

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
              pattern: {
                value: /^[0-9]*.?[0-9]+$/,
                message: "Please, enter a valid number",
              },
              onChange: (e: any) => setRestingMetabolicRate(e.target.value),
            }}
            error={errors}
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
              pattern: {
                value: /^[0-9]*.?[0-9]+$/,
                message: "Please, enter a valid number",
              },
              onChange: (e: any) => setMetabolicAge(e.target.value),
            }}
            error={errors}
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
              pattern: {
                value: /^[0-9]*.?[0-9]+$/,
                message: "Please, enter a valid number",
              },
              onChange: (e: any) => setMuscleMass(e.target.value),
            }}
            error={errors}
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
            }}
            error={errors}
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
              pattern: {
                value: /^[0-9]*.?[0-9]+$/,
                message: "Please, enter a valid number",
              },
              onChange: (e: any) => setWater(e.target.value),
            }}
            error={errors}
            aria-invalid={errors.inputWater ? "true" : "false"}
          />
        </div>

        {/* <div className="mx-auto"> */}
        <InputSubmit label="Submit Survey" />
        {/* </div> */}

        {/* Wellness Results */}
      </form>
    </>
  );
}

export async function getServerSideProps(context: any) {
  let props: any = {
    user: "",
    userInfo: null,
    message: "",
    isError: false,
    redirect: "",
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

import { useContext, useState, useEffect } from "react";
import { WellnessOverallResults } from "../../firebase/constants";
import { addProductFunction } from "@/firebase/firebase_functions/products_functions";
import { useRouter } from "next/navigation";
import { useAuthContext, AuthContext } from "@/context/AuthContext";
import nookies from "nookies";
import admin from "../../firebase/admin-config";
import { getUserFunction } from "@/firebase/firebase_functions/users_functions";

import { useForm } from "react-hook-form";
import WarningMessage from "@/components/forms/WarningMessage";
import { WellnessQuestions } from "../../firebase/constants";

import { addWellnessSurveyResult } from "@/firebase/firebase_functions/wellness_functions";

export default function WellnessSurvey(props: any) {
  const [userId, setUserId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");

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

    const resultObject: WellnessOverallResults = {
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
      success(addResultResult.resultText);
      router.push("/");
    } else {
      error(addResultResult.resultText);
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
    error(props.errorMessage);
    router.push(props.redirect);
    return null;
  }

  return (
    <>
      <form onSubmit={handleSubmit(handleForm)}>
        <h2 className="mt-6 mb-10 text-center text-3xl font-bold tracking-tight text-gray-900">
          Wellness Survey
        </h2>
        <h3 className="mb-2 ml-2 text-2xl font-bold tracking-tight text-gray-900">
          Personal Details
        </h3>
        {/* Personal Details */}
        <div>
          {/* Name */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="name"
              type="text"
              placeholder={"Type your name..."}
              value={name}
              {...register("inputName", {
                required: "Name is required",
                onChange: (e: any) => setName(e.target.value),
              })}
              aria-invalid={errors.inputName ? "true" : "false"}
            />
            {errors.inputName && (
              <WarningMessage text={errors.inputName?.message} />
            )}
          </div>
          {/* Contact Number */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="contactNumber"
            >
              Contact Number
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="name"
              type="contactNumber"
              value={contactNumber}
              placeholder="Type your contact number..."
              {...register("inputContactNumber", {
                required: "Contact number is required",
                onChange: (e: any) => setContactNumber(e.target.value),
              })}
              aria-invalid={errors.inputContactNumber ? "true" : "false"}
            />
            {errors.inputContactNumber && (
              <WarningMessage text={errors.inputContactNumber?.message} />
            )}
          </div>
          {/* Gender */}
          <div className="w-full px-3 mb-6">
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
              {...(register("inputGender"),
              {
                required: false,
              })}
            />
          </div>
          {/* Age */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="age"
            >
              Age
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="age"
              type="number"
              placeholder="Type your age..."
              {...register("inputAge", {
                required: "Age is required",
              })}
              aria-invalid={errors.inputAge ? "true" : "false"}
            />
            {errors.inputAge && (
              <WarningMessage text={errors.inputAge?.message} />
            )}
          </div>
          {/* Height */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="height"
            >
              Height in meters
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="height"
              type="number"
              placeholder="Type your height..."
              {...register("inputHeight", {
                required: "Height is required",
              })}
              aria-invalid={errors.inputHeight ? "true" : "false"}
            />
            {errors.inputHeight && (
              <WarningMessage text={errors.inputHeight?.message} />
            )}
          </div>
          {/* Weight */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="weight"
            >
              Weight in kilograms
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="weight"
              type="number"
              placeholder="Type your weight..."
              {...register("inputWeight", {
                required: "Weight is required",
              })}
              aria-invalid={errors.inputWeight ? "true" : "false"}
            />
            {errors.inputWeight && (
              <WarningMessage text={errors.inputWeight?.message} />
            )}
          </div>
        </div>
        {/* Questions */}
        <h3 className="mt-5 mb-2 ml-2 text-2xl font-bold tracking-tight text-gray-900">
          Wellness Questions
        </h3>
        <p className="mb-2 ml-2 tracking-tight text-gray-900">
          Please check the boxes for YES answers
        </p>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 grid-rows-7">
          {Object.keys(WellnessQuestions).map((key: string) => {
            return (
              <>
                <div className="flex items-center mb-2 text-black">
                  <input
                    id={key}
                    type="checkbox"
                    value={key}
                    {...register("wellness")}
                    className="mx-3 block checkbox checkbox-success"
                  />
                  <label htmlFor={key}>{WellnessQuestions[key]}</label>
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
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="date"
            >
              Date
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="date_trainer_info"
              type="date"
              {...register("inputDate", {
                required: false,
              })}
              aria-invalid={errors.inputDate ? "true" : "false"}
            />
            {errors.inputDate && (
              <WarningMessage text={errors.inputDate?.message} />
            )}
          </div>

          {/* Fat */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="fat"
            >
              Fat %
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="fat"
              type="text"
              placeholder="Type the fat %..."
              {...register("inputFat", {
                required: false,
              })}
              aria-invalid={errors.inputFat ? "true" : "false"}
            />
            {errors.inputFat && (
              <WarningMessage text={errors.inputFat?.message} />
            )}
          </div>

          {/* Visceral Fat */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="visceral_fat"
            >
              Visceral Fat
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="visceral_fat"
              type="text"
              placeholder="Type the visceral fat..."
              {...register("inputVisceralFat", {
                required: false,
              })}
              aria-invalid={errors.inputVisceralFat ? "true" : "false"}
            />
            {errors.inputVisceralFat && (
              <WarningMessage text={errors.inputVisceralFat?.message} />
            )}
          </div>

          {/* Bone Mass */}
          <div className="w-full px-3 mb-6">
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
              {...register("inputBoneMass", {
                required: false,
              })}
              aria-invalid={errors.inputBoneMass ? "true" : "false"}
            />
            {errors.inputBoneMass && (
              <WarningMessage text={errors.inputBoneMass?.message} />
            )}
          </div>

          {/* Resting Metabolic Rate (Calories burned at rest) */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="resting_metabolic_rate"
            >
              Resting Metabolic Rate {`(Calories burned at rest)`}
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="resting_metabolic_rate"
              type="text"
              placeholder="Type the resting metabolic rate..."
              {...register("inputRestingMetabolicRate", {
                required: false,
              })}
              aria-invalid={errors.inputRestingMetabolicRate ? "true" : "false"}
            />
            {errors.inputRestingMetabolicRate && (
              <WarningMessage
                text={errors.inputRestingMetabolicRate?.message}
              />
            )}
          </div>

          {/* Metabolic Age */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="metabolic_age"
            >
              Metabolic Age
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="metabolic_age"
              type="text"
              placeholder="Type the metabolic age..."
              {...register("inputMetabolicAge", {
                required: false,
              })}
              aria-invalid={errors.inputMetabolicAge ? "true" : "false"}
            />
            {errors.inputMetabolicAge && (
              <WarningMessage text={errors.inputMetabolicAge?.message} />
            )}
          </div>

          {/* Muscle Mass */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="muscle_mass"
            >
              Muscle Mass
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="muscle_mass"
              type="text"
              placeholder="Type the muscle mass..."
              {...register("inputMuscleMass", {
                required: false,
              })}
              aria-invalid={errors.inputMuscleMass ? "true" : "false"}
            />
            {errors.inputMuscleMass && (
              <WarningMessage text={errors.inputMuscleMass?.message} />
            )}
          </div>

          {/* Physique Rating */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="physique_rating"
            >
              Physique Rating
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="physique_rating"
              type="text"
              placeholder="Type the physique rating..."
              {...register("inputPhysiqueRating", {
                required: false,
              })}
              aria-invalid={errors.inputPhysiqueRating ? "true" : "false"}
            />
            {errors.inputPhysiqueRating && (
              <WarningMessage text={errors.inputPhysiqueRating?.message} />
            )}
          </div>

          {/* Water % */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="water"
            >
              Water %
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="water"
              type="text"
              placeholder="Type the water %..."
              {...register("inputWater", {
                required: false,
              })}
              aria-invalid={errors.inputWater ? "true" : "false"}
            />
            {errors.inputWater && (
              <WarningMessage text={errors.inputWater?.message} />
            )}
          </div>
        </div>
        <div className="text-center p-2">
          <input
            type="submit"
            value="Submit Survey"
            className="cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
          />
        </div>

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
    errorMessage: "",
    redirect: "",
  };

  try {
    const cookies = nookies.get(context);
    const token = await admin.auth().verifyIdToken(cookies.token);

    const { uid, email } = token;

    props.user = uid;
    props.isError = false;
    props.message = `Your email is ${email} and your UID is ${uid}.`;
    props.errorMessage = "";
    props.redirect = "";

    const getUserInfoResult = await getUserFunction(uid);

    if (getUserInfoResult.isSuccess) props.userInfo = getUserInfoResult.result;

    return { props };
  } catch (err) {
    return { props };
  }
}

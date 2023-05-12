import { useState, useEffect } from "react";
import { WellnessOverallResults } from "../../../firebase/constants";
import { useRouter } from "next/router";
import { useAuthContext } from "@/context/AuthContext";
import nookies from "nookies";
import admin from "../../../firebase/admin-config";
import { getUserFunction } from "@/firebase/firebase_functions/users_function";

import { useForm } from "react-hook-form";
import WarningMessage from "@/components/forms/WarningMessage";
import {
  WellnessQuestions,
  WellnessRemarks,
} from "../../../firebase/constants";

import {
  getWellnessSurveyResultsViaIdFunction,
  updateWellnessSurveyResultFunction,
} from "@/firebase/firebase_functions/wellness_function";

export default function AdminWellnessSurveyShow(props: any) {
  const router = useRouter();
  const { id } = router.query;
  const { error, success } = useAuthContext();

  const [originalSurveyResult, setOriginalSurveyResult] = useState<any>(null);

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

    var idInput = "";
    if (id) {
      if (id[0]) {
        idInput = id.toString();
      } else if (typeof id == "string") {
        idInput = id;
      }
    }

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

      inputPresentWeight,
      inputIdealWeight,
      inputWeightStatus,
      inputWeightStatusNumber,
      inputIdealVisceral,

      inputProgram,
      inputMealPlan,

      inputReviewedByAdmin,
    } = data;

    const resultObject: WellnessOverallResults = {
      user_id: userId,
      wellness_survey: wellness,
      name: name,
      contact_number: contactNumber,
      gender: gender,
      height: height,
      age: age,
      weight: weight,

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

      wellness_remarks: {
        present_weight: inputPresentWeight,
        ideal_weight: inputIdealWeight,
        weight_status: inputWeightStatus,
        weight_status_number: inputWeightStatusNumber,
        ideal_visceral: inputIdealVisceral,
      },

      program: inputProgram,
      meal_plan: inputMealPlan,

      reviewed_by_admin: inputReviewedByAdmin == "true" ? true : false,
    };

    console.log(resultObject);

    const updateWellnessSurveyResult = await updateWellnessSurveyResultFunction(
      resultObject,
      idInput
    );

    if (updateWellnessSurveyResult.isSuccess) {
      success(updateWellnessSurveyResult.resultText);
      router.push("/");
    } else {
      error(updateWellnessSurveyResult.resultText);
    }
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

    const result = await getWellnessSurveyResultsViaIdFunction(idInput);

    if (!result.isSuccess) {
      error(result.resultText);
    } else {
      const wellnessSurveyResultObject = result.result;
      setOriginalSurveyResult(wellnessSurveyResultObject);

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

  const discardChanges = async (e: any) => {
    e.preventDefault();

    setUserId(originalSurveyResult.user_id);
    setWellnessSurvey(originalSurveyResult.wellness_survey);
    setName(originalSurveyResult.name);
    setContactNumber(originalSurveyResult.contact_number);
    setGender(originalSurveyResult.gender);
    setHeight(originalSurveyResult.height);
    setAge(originalSurveyResult.age);
    setWeight(originalSurveyResult.weight);

    setDate(originalSurveyResult.wellness_trainer_information.date);
    setFat(originalSurveyResult.wellness_trainer_information.fat);
    setVisceralFat(
      originalSurveyResult.wellness_trainer_information.visceral_fat
    );
    setBoneMass(originalSurveyResult.wellness_trainer_information.bone_mass);
    setRestingMetabolicRate(
      originalSurveyResult.wellness_trainer_information.resting_metabolic_rate
    );
    setMetabolicAge(
      originalSurveyResult.wellness_trainer_information.metabolic_age
    );
    setMuscleMass(
      originalSurveyResult.wellness_trainer_information.muscle_mass
    );
    setPhysiqueRating(
      originalSurveyResult.wellness_trainer_information.physique_rating
    );
    setWater(originalSurveyResult.wellness_trainer_information.water);

    setPresentWeight(originalSurveyResult.wellness_remarks.present_weight);
    setIdealWeight(originalSurveyResult.wellness_remarks.ideal_weight);
    setWeightStatus(originalSurveyResult.wellness_remarks.weight_status);
    setWeightStatusNumber(
      originalSurveyResult.wellness_remarks.weight_status_number
    );
    setIdealVisceral(originalSurveyResult.wellness_remarks.ideal_visceral);
    setProgram(originalSurveyResult.program);
    setMealPlan(originalSurveyResult.meal_plan);

    setReviewedByAdmin(originalSurveyResult.reviewed_by_admin);
  };

  useEffect(() => {
    fetchWellnessSurveyResult();
  }, []);

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
                disabled: true,
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
                disabled: true,
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
              value={gender}
              {...(register("inputGender"),
              {
                required: false,
                onChange: (e: any) => setGender(e.target.value),
                disabled: true,
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
              value={age}
              placeholder="Type your age..."
              {...register("inputAge", {
                required: "Age is required",
                onChange: (e: any) => setAge(e.target.value),
                disabled: true,
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
              value={height}
              placeholder="Type your height..."
              {...register("inputHeight", {
                required: "Height is required",
                onChange: (e: any) => setHeight(e.target.value),
                disabled: true,
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
              value={weight}
              placeholder="Type your weight..."
              {...register("inputWeight", {
                required: "Weight is required",
                onChange: (e: any) => setWeight(e.target.value),
                disabled: true,
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
                <div className="flex text-black items-center mb-2">
                  <input
                    id={key}
                    type="checkbox"
                    checked={wellnessSurvey.includes(key)}
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
              value={date}
              {...register("inputDate", {
                required: false,
                onChange: (e: any) => setDate(e.target.value),
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
              value={fat}
              {...register("inputFat", {
                required: false,
                onChange: (e: any) => setFat(e.target.value),
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
              value={visceralFat}
              {...register("inputVisceralFat", {
                required: false,
                onChange: (e: any) => setVisceralFat(e.target.value),
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
              value={restingMetabolicRate}
              {...register("inputRestingMetabolicRate", {
                required: false,
                onChange: (e: any) => setRestingMetabolicRate(e.target.value),
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
              value={metabolicAge}
              {...register("inputMetabolicAge", {
                required: false,
                onChange: (e: any) => setMetabolicAge(e.target.value),
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
              value={muscleMass}
              {...register("inputMuscleMass", {
                required: false,
                onChange: (e: any) => setMuscleMass(e.target.value),
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
              value={physiqueRating}
              {...register("inputPhysiqueRating", {
                required: false,
                onChange: (e: any) => setPhysiqueRating(e.target.value),
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
              value={water}
              {...register("inputWater", {
                required: false,
                onChange: (e: any) => setWater(e.target.value),
              })}
              aria-invalid={errors.inputWater ? "true" : "false"}
            />
            {errors.inputWater && (
              <WarningMessage text={errors.inputWater?.message} />
            )}
          </div>
        </div>

        {/* Wellness Remarks */}
        <h3 className="mt-5 mb-2 ml-2 text-2xl font-bold tracking-tight text-gray-900">
          Wellness Remarks
        </h3>
        <div>
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="reviewed_by_admin"
            >
              Admin Review Status
            </label>

            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              id="reviewed_by_admin"
              {...register("inputReviewedByAdmin", {
                required: "Status is required",
                onChange: (e: any) =>
                  setReviewedByAdmin(e.target.value == "true" ? true : false),
              })}
              aria-invalid={errors.inputReviewedByAdmin ? "true" : "false"}
            >
              <option
                value={"true"}
                key="reviewed"
                selected={reviewedByAdmin ? true : false}
              >
                Reviewed
              </option>

              <option
                value={"false"}
                key="unreviewed"
                selected={reviewedByAdmin == false ? true : false}
              >
                Unreviewed
              </option>
            </select>
          </div>
          {/* Present Weight % */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="present_weight"
            >
              Present Weight
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="present_weight"
              type="number"
              placeholder="Type the present weight"
              value={presentWeight}
              {...register("inputPresentWeight", {
                required: false,
                onChange: (e: any) => setPresentWeight(e.target.value),
              })}
              aria-invalid={errors.inputPresentWeight ? "true" : "false"}
            />
            {errors.inputPresentWeight && (
              <WarningMessage text={errors.inputPresentWeight?.message} />
            )}
          </div>

          {/* Ideal Weight */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="ideal_weight"
            >
              Ideal Weight
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="ideal_weight"
              type="number"
              placeholder="Type the ideal weight..."
              value={idealWeight}
              {...register("inputIdealWeight", {
                required: false,
                onChange: (e: any) => setIdealWeight(e.target.value),
              })}
              aria-invalid={errors.inputIdealWeight ? "true" : "false"}
            />
            {errors.inputIdealWeight && (
              <WarningMessage text={errors.inputIdealWeight?.message} />
            )}
          </div>

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
              })}
              aria-invalid={errors.inputWeightStatus ? "true" : "false"}
            >
              <option
                value="excess"
                key="excess"
                selected={weightStatus == "excess" ? true : false}
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
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="weight_status_number"
            >
              Weight
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="weight_status_number"
              type="number"
              placeholder="Type the weight value..."
              value={weightStatusNumber}
              {...register("inputWeightStatusNumber", {
                required: false,
                onChange: (e: any) => setWeightStatusNumber(e.target.value),
              })}
              aria-invalid={errors.inputWeightStatusNumber ? "true" : "false"}
            />
            {errors.inputWeightStatusNumber && (
              <WarningMessage text={errors.inputWeightStatusNumber?.message} />
            )}
          </div>

          {/* Ideal Visceral */}
          <div className="w-full px-3 mb-6">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="ideal_visceral"
            >
              Ideal Visceral
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white"
              id="ideal_visceral"
              type="number"
              placeholder="Type the ideal visceral..."
              value={idealVisceral}
              {...register("inputIdealVisceral", {
                required: false,
                onChange: (e: any) => setIdealVisceral(e.target.value),
              })}
              aria-invalid={errors.inputIdealVisceral ? "true" : "false"}
            />
            {errors.inputIdealVisceral && (
              <WarningMessage text={errors.inputIdealVisceral?.message} />
            )}
          </div>
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
              })}
              aria-invalid={errors.inputProgram ? "true" : "false"}
            >
              <option
                value={WellnessRemarks.GAIN}
                key="gain"
                selected={program == WellnessRemarks.GAIN ? true : false}
              >
                {WellnessRemarks.GAIN}
              </option>

              <option
                value={WellnessRemarks.MAINTENANCE}
                key="maintenance"
                selected={program == WellnessRemarks.MAINTENANCE ? true : false}
              >
                {WellnessRemarks.MAINTENANCE}
              </option>

              <option
                value={WellnessRemarks.LOSS}
                key="loss"
                selected={program == WellnessRemarks.LOSS ? true : false}
              >
                {WellnessRemarks.LOSS}
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
              })}
              aria-invalid={errors.inputMealPlan ? "true" : "false"}
            ></textarea>
            {errors.inputMealPlan && (
              <WarningMessage text={errors.inputMealPlan?.message} />
            )}
          </div>
        </div>
        <div className="text-center p-2">
          <input
            type="button"
            value="Discard Changes"
            className="cursor-pointer rounded-md border bg-nf_green py-3 px-5 text-base text-white transition hover:bg-nf_dark_green"
            onClick={(e: any) => discardChanges(e)}
          />
          <input
            type="submit"
            value="Edit Survey"
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
    isError: true,
    errorMessage: "Unauthorized access",
    redirect: "/login",
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

    const isAdmin = getUserInfoResult.result.role == "admin" ? true : false;

    if (!isAdmin) {
      return {
        props: {
          isError: true,
          errorMessage: "Unauthorized access",
          redirect: "/",
        },
      };
    }

    return { props };
  } catch (err) {
    return { props };
  }
}

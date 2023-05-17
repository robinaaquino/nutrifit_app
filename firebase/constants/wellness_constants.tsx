import { WellnessRemarksEnum } from "./enum_constants";

export const WellnessQuestionsKeys: { [key: string]: string } = {
  tired: "Do you easily get tired?",
  sick: "Do you feel sick or get sick often?",
  chronicHealthProblems:
    "Do you suffer from chronic health problems such as headaches, backaches or constipation?",
  stressed: "Do you feel your workplace-home-life stressful?",
  constantlyHungry:
    "Do you often feel hungry or have a constant craving for food?",
  processedFood:
    "Do yo eat fast food, instant food or processed food regularly?",
  connectionFoodLevel:
    "Do you believe there is a connection between the food you eat and the level of your health?",
  eightWater: "Do you drink at least eight glass of plain water each day?",
  doctorLoseWeight: "Have your doctor suggested that you lose weight?",
  wantsToLoseWeight: "Would you like to lose excess inches and pounds?",
  wantsToAddWeight: "Would you like to add some pounds to your weight?",
  smoking: "Do you smoke?",
  alcohol: "Do you drink alcohol?",
};

export const WellnessTrainerInformationKeys: { [key: string]: string } = {
  date: "Date",
  fat: "Fat %",
  visceral_fat: "Visceral Fat",
  bone_mass: "Bone Mass",
  resting_metabolic_rate: "Resting Metabolic Rate (Calories burned at rest)",
  metabolic_age: "Metabolic Age",
  muscle_mass: "Muscle Mass",
  physique_rating: "Physique Rating",
  water: "Water %",
};

export type WellnessCustomerInformationTypeUserType = {
  userId: string | null;
  email: string;
};

export type WellnessCustomerInformationType = {
  name: string;
  contact_number: string;
  gender: string;
  age: number;
  height: number;
  weight: number;
  user_information: WellnessCustomerInformationTypeUserType;
};

export type WellnessTrainerInformationType = {
  date: string;
  fat: string;
  visceral_fat: string;
  bone_mass: string;
  resting_metabolic_rate: string;
  metabolic_age: string;
  muscle_mass: string;
  physique_rating: string;
  water: string;
};

export type WellnessRemarksType = {
  present_weight: number;
  ideal_weight: number;
  weight_status: string;
  weight_status_number: number;
  ideal_visceral: number;
};

export type WellnessDatabaseType = {
  id?: string;
  user_id?: string;
  wellness_survey: [];
  name: string;
  contact_number: string;
  gender?: string;
  height: number;
  age: number;
  weight: number;

  reviewed_by_admin?: boolean;
  wellness_trainer_information?: WellnessTrainerInformationType;
  wellness_remarks?: WellnessRemarksType;
  program?: WellnessRemarksEnum;
  meal_plan?: string;

  created_at?: string;
  updated_at?: string;
};

export type WellnessDatabaseTypeFromDB = {
  id: string;
  user_id: string;
  wellness_survey: [];
  name: string;
  contact_number: string;
  gender: string;
  height: number;
  age: number;
  weight: number;

  reviewed_by_admin: boolean;
  wellness_trainer_information: WellnessTrainerInformationType;
  wellness_remarks: WellnessRemarksType;
  program: WellnessRemarksEnum;
  meal_plan: string;

  created_at: string;
  updated_at: string;
};

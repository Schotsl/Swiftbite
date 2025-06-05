import AppleHealthKit, {
  HealthKitPermissions,
  HealthUnit,
} from "react-native-health";

const OPTIONS = {
  permissions: {
    read: [
      "Height",
      "Weight",
      "DateOfBirth",
      "BodyMassIndex",
      "BasalEnergyBurned",
      "ActiveEnergyBurned",
    ],
    write: [
      "Biotin",
      "Caffeine",
      "Calcium",
      "Carbohydrates",
      "Chloride",
      "Cholesterol",
      "Copper",
      "EnergyConsumed",
      "FatMonounsaturated",
      "FatPolyunsaturated",
      "FatSaturated",
      "FatTotal",
      "Fiber",
      "Folate",
      "Iodine",
      "Iron",
      "Magnesium",
      "Manganese",
      "Molybdenum",
      "Niacin",
      "PantothenicAcid",
      "Phosphorus",
      "Potassium",
      "Protein",
      "Riboflavin",
      "Selenium",
      "Sodium",
      "Sugar",
      "Thiamin",
      "VitaminA",
      "VitaminB12",
      "VitaminB6",
      "VitaminC",
      "VitaminD",
      "VitaminE",
      "VitaminK",
      "Zinc",
    ],
  },
} as HealthKitPermissions;

// I've asked Gemini to implement the health service although I did refactor it
class HealthService {
  async initHealthKit(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      AppleHealthKit.initHealthKit(OPTIONS, (error, results) => {
        if (error) {
          resolve(false);

          return;
        }

        resolve(true);
      });
    });
  }

  async getTotalCalories(): Promise<number> {
    const [active, basal] = await Promise.all([
      this.getActiveCalories(),
      this.getBasalCalories(),
    ]);

    const caloriesSummed = active + basal;
    return caloriesSummed;
  }

  private startToday(): string {
    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const nowISO = nowDate.toISOString();

    return nowISO;
  }

  private endToday(): string {
    const now = new Date();
    const nowISO = now.toISOString();

    return nowISO;
  }

  public async getActiveCalories(): Promise<number> {
    const options = {
      startDate: this.startToday(),
      endDate: this.endToday(),
    };

    return new Promise((resolve, reject) => {
      AppleHealthKit.getActiveEnergyBurned(options, (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        const total = results.reduce((acc, curr) => acc + curr.value, 0);
        const totalRounded = Math.round(total);

        resolve(totalRounded);
      });
    });
  }

  private async getBasalCalories(): Promise<number> {
    const options = {
      startDate: this.startToday(),
      endDate: this.endToday(),
    };

    return new Promise((resolve, reject) => {
      AppleHealthKit.getBasalEnergyBurned(options, (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        const total = results.reduce((acc, curr) => acc + curr.value, 0);
        const totalRounded = Math.round(total);

        resolve(totalRounded);
      });
    });
  }

  async getLatestWeight(): Promise<number> {
    const options = {
      unit: "g" as HealthUnit,
    };

    return new Promise((resolve, reject) => {
      AppleHealthKit.getLatestWeight(options, (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        // Weight is in kg
        const weight = results.value;
        resolve(weight);
      });
    });
  }
}

export default new HealthService();

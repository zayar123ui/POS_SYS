import { helper } from "../helper/helper";
import { User } from "../models/user.model";
import userData from "./user.json";

export async function seedUsers() {
  const findUser = await User.find();
  if (findUser.length > 0) {
    return;
  }

  const users = await Promise.all(
    userData.map(async (data) => {
      return {
        name: data.name,
        email: data.email,
        role: data.role,
        password: await helper.encrypt(data.password),
        otp: "123456",
        verified: true,
      };
    })
  );
  await User.insertMany(users);
}

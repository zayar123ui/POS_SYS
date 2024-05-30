import { UserRole } from "../enums/user.enum";
import { helper } from "../helper/helper";
import { User } from "../models/user.model";
import { UserWallet } from "../models/userWallet.model";
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

  const insertedUsers = await User.insertMany(users);

    for (const user of insertedUsers) {
      if (user.role === UserRole.USER) {
        await UserWallet.create({
          user_id: user._id,
          point: 0,
        });
      }
    }
}

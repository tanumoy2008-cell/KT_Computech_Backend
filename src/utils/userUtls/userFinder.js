import userModel from "../../models/user.model.js";
import { NotFoundError } from "../error.js";

const userFinder = async ({
  key,
  query,
  includePassword = false,
  lean = false,
  select = null,
}) => {
  try {
    if (!key || !query)
      throw new NotFoundError("Key or query missing in userFinder");

    let selectFields = select || (includePassword ? "+password" : "-password");
    let userQuery = userModel.findOne({ [key]: query }).select(selectFields);

    if (lean) {
      userQuery = userQuery.lean();
    }

    const user = await userQuery;
    return user || null;
  } catch (err) {
    console.error("adminFinder error:", err.message);
    throw new NotFoundError("User not found or error in query");
  }
};
export default userFinder;
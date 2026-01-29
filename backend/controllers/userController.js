import { TryCatch } from "../middlewares/error.js";
import { ErrorHandler } from '../utils/utility.js'
import { User } from '../models/userModel.js'
import { uploadFilesToCloudinary, deletFilesFromCloudinary } from '../utils/features.js'

const getUser = TryCatch(async (req, res, next) => {
  const userId = req.params.id;

  const user = await User.findById(userId);
  if (!user) return next(new ErrorHandler('User not found', 404));

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
});

const loggedInUser = TryCatch(async (req, res, next) => {
  const userId = req.user.userId;
  const user = await User.findById(userId);
  if (!user) return next(new ErrorHandler('User not found', 404));

  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
});

const deleteUser = TryCatch(async (req, res, next) => {
  const userId = req.params.id;
  const user = await User.findById(userId);

  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  const deletePhotoPromise = deletFilesFromCloudinary([user.photo]);
  const userDeletePromise = user.deleteOne();

  await Promise.all([deletePhotoPromise, userDeletePromise]);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

const updateUser = TryCatch(async (req, res, next) => {
  const userId = req.params.id;
  const { username, email, phone, city, state, role } = req.body;


  if (!username || !email || !phone || !city || !state) {
    return next(new ErrorHandler("Not provided fields", 400));
  }

  const user = await User.findById(userId);
  if (!user) return next(new ErrorHandler("User not found", 400));

  const duplicateEmailOrPhoneUser = await User.findOne({
    $or: [{ email }, { phone }],
    _id: { $ne: userId }, // Exclude current user from duplicate check
  });

  if (duplicateEmailOrPhoneUser) {
    return next(
      new ErrorHandler(
        "Email or phone already exists. Try with another phone or email.",
        400
      )
    );
  }

  user.username = username;
  user.email = email;
  user.phone = phone;
  user.city = city;
  user.state = state;
  if(role) user.role = role;

  await user.save();

  res.status(200).json({
    success: true,
    message: "User updated successfully",
  });
});


const changeUserRole = TryCatch(async (req, res, next) => {
  const userId = req.params.id;
  const newRole = req.body.role;

  if (!newRole) {
    return next(new ErrorHandler("Role is not provided. To change role, a new role is required.", 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new ErrorHandler('User not found', 404));
  }

  user.role = newRole;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
  });
});

const getFilteredUsers = TryCatch(async (req, res, next) => {
  const { search, city, state, role } = req.query;
  const limit = Number(process.env.USER_PER_PAGE) || 10;
  const page = req.query.page || 1;
  const skip = (page - 1) * limit;

  const regEx = new RegExp(search, "i");

  const baseQuery = {};

  if (search) baseQuery.username = { $regex: regEx };
  if (city) baseQuery.city = city;
  if (role) baseQuery.role = role;
  if (state) baseQuery.state = state;

  const userPromise = User.find(baseQuery).limit(limit).skip(skip);
  const filteredOnlyUser = User.find(baseQuery);

  const users = await userPromise;
  const totalPage = Math.ceil((await filteredOnlyUser).length / limit) || 1;

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    users,
    totalPage,
  });
});

const getAdminUser = TryCatch(async (req, res, next) => {


  const { keywords = "" } = req.query;
  const limit = Number(process.env.USER_PER_PAGE) || 5;
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * limit;


  const regEx = new RegExp(keywords, "i"); // Case-insensitive search

  // If keyword is provided, apply OR search on multiple fields
  const baseQuery = keywords
    ? {
        $or: [
          { username: { $regex: regEx } },
          { role: { $regex: regEx } },
          { email: { $regex: regEx } },
          { phone: { $regex: regEx } },
          { city: { $regex: regEx } },
          { state: { $regex: regEx } },
        ],
      }
    : {};


  const userPromise = User.find(baseQuery).limit(limit).skip(skip);
  const totalUsersPromise = User.countDocuments(baseQuery);

  const [users, totalUsers] = await Promise.all([userPromise, totalUsersPromise]);
  const totalPage = Math.ceil(totalUsers / limit) || 1;

  return res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    users,
    totalPage,
  });
});



const addPhoto = TryCatch(async (req, res, next) => {
  const userId = req.params.id;

  if (!res.file) return next(new ErrorHandler("Avatar not provided", 400));

  const user = await User.findById(userId);
  if (!user) return next(new ErrorHandler('User not found', 404));

  const existUserPhotoPublicId = user.photo.public_id;
  await deletFilesFromCloudinary([existUserPhotoPublicId]);

  const photo = await uploadFilesToCloudinary();
  user.photo = {
    public_id: photo[0].public_id,
    url: photo[0].url,
  };

  await user.save();

  res.status(200).json({
    success: true,
    message: "Photo uploaded successfully",
  });
});

export {
  getUser,
  deleteUser,
  updateUser,
  loggedInUser,
  changeUserRole,
  getFilteredUsers,
  addPhoto,
  getAdminUser
};

const User = require("./../models/userModel");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  // SEND RESPONSE
  res.status(200).json({
    status: "success",
    results: users.length,
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword",
        400
      )
    );
  }

  const filteredObj = filterObj(req.body, "name", "email");

  const user = await User.findByIdAndUpdate(req.user.id, filteredObj, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.postUser = (req, res) => {
  const newId = usersData.length - 1;
  const newUser = Object.assign({ id: newId }, req.body);
  usersData.push(newUser);
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(usersData),
    (err) => res.status(201).json({ status: "success", data: newUser })
  );
};

exports.getSingleUser = (req, res) => {
  const data = usersData.find((item) => item.id * 1 === req.params.id * 1);
  res.status(200).json({ status: "success", data });
};

exports.updateUser = (req, res) => {
  res.status(200).json({ status: "success", user: "updated user" });
};

exports.deleteUser = (req, res) => {
  const updatedUsers = usersData.filter(
    (item) => item.id * 1 !== req.params.id * 1
  );
  fs.writeFile(
    `${__dirname}/dev-data/data/users.json`,
    JSON.stringify(updatedUsers),
    (err) => res.status(204).json({ status: "success", data: null })
  );
};

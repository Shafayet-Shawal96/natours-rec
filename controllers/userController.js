const fs = require("fs");

const usersData = JSON.parse(
  fs.readFileSync("./dev-data/data/users.json", "utf8")
);

exports.getAllUsers = (req, res) => {
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    total: usersData.length,
    data: usersData,
  });
};

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

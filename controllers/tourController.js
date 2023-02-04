const fs = require("fs");

const toursData = JSON.parse(
  fs.readFileSync("./dev-data/data/tours.json", "utf8")
);

exports.checkID = (req, res, next, val) => {
  if (val * 1 > toursData.length) {
    return res.status(404).json({
      status: "failed",
      message: "Invalid ID",
    });
  }
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.duration) {
    return res.status(400).json({
      status: "failed",
      message: "name or duration is empty",
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: "success",
    requestTime: req.requestTime,
    total: toursData.length,
    data: toursData,
  });
};

exports.postTour = (req, res) => {
  const newId = toursData.length - 1;
  const newTour = Object.assign({ id: newId }, req.body);
  toursData.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(toursData),
    (err) => res.status(201).json({ status: "success", data: newTour })
  );
};

exports.getSingleTour = (req, res) => {
  const data = toursData.find((item) => item.id * 1 === req.params.id * 1);
  res.status(200).json({ status: "success", data });
};

exports.updateTour = (req, res) => {
  res.status(200).json({ status: "success", tour: "updated tour" });
};

exports.deleteTour = (req, res) => {
  const updatedTours = toursData.filter(
    (item) => item.id * 1 !== req.params.id * 1
  );

  fs.writeFile(
    `${__dirname}/dev-data/data/tours.json`,
    JSON.stringify(updatedTours),
    (err) => res.status(204).json({ status: "success", data: null })
  );
};

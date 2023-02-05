const Tour = require("./../models/tourModel");

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage,price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortStr = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortStr);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select("-__v");
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

exports.getAllTours = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(404).json({ status: "fail", message: err });
  }
};

exports.creatTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({ status: "success", newTour });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
};

exports.getSingleTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: "success", tour });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: "success", tour });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: "success", data: null });
  } catch (err) {
    res.status(400).json({ status: "fail", message: err });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } },
      },
      {
        $group: {
          _id: { $toUpper: "$difficulty" },
          numTours: { $sum: 1 },
          numRating: { $sum: "$ratingsQuantity" },
          avgRating: { $avg: "$ratingsAverage" },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
      {
        $sort: { avgPrice: -1 },
      },
    ]);
    res.status(200).json({ status: "success", stats });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year;
    const plan = await Tour.aggregate([
      {
        $unwind: "$startDates",
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: "$startDates" },
          numTourStarts: { $sum: 1 },
          tours: { $push: "$name" },
        },
      },
      {
        $addFields: { month: "$_id" },
      },
      {
        $project: { _id: 0 },
      },
      {
        $sort: { numTourStarts: -1 },
      },
      {
        $limit: 12,
      },
    ]);
    res.status(200).json({ status: "success", plan });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error });
  }
};

// const fs = require("fs");

// const toursData = JSON.parse(
//   fs.readFileSync("./dev-data/data/tours.json", "utf8")
// );

// exports.checkID = (req, res, next, val) => {
//   if (val * 1 > toursData.length) {
//     return res.status(404).json({
//       status: "failed",
//       message: "Invalid ID",
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.duration) {
//     return res.status(400).json({
//       status: "failed",
//       message: "name or duration is empty",
//     });
//   }
//   next();
// };

// exports.getAllTours = (req, res) => {
//   console.log(req.requestTime);
//   res.status(200).json({
//     status: "success",
//     requestTime: req.requestTime,
//     total: toursData.length,
//     data: toursData,
//   });
// };

// exports.postTour = (req, res) => {
//   const newId = toursData.length - 1;
//   const newTour = Object.assign({ id: newId }, req.body);
//   toursData.push(newTour);
//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours.json`,
//     JSON.stringify(toursData),
//     (err) => res.status(201).json({ status: "success", data: newTour })
//   );
// };

// exports.getSingleTour = (req, res) => {
//   const data = toursData.find((item) => item.id * 1 === req.params.id * 1);
//   res.status(200).json({ status: "success", data });
// };

// exports.updateTour = (req, res) => {
//   res.status(200).json({ status: "success", tour: "updated tour" });
// };

// exports.deleteTour = (req, res) => {
//   const updatedTours = toursData.filter(
//     (item) => item.id * 1 !== req.params.id * 1
//   );

//   fs.writeFile(
//     `${__dirname}/dev-data/data/tours.json`,
//     JSON.stringify(updatedTours),
//     (err) => res.status(204).json({ status: "success", data: null })
//   );
// };

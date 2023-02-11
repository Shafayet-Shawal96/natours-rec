const Review = require("./../models/reviewModel");
const factory = require("./handlerFactory");

exports.setTourIds = (req, res, next) => {
  if (req.params.tourId) req.query = { ...req.query, tour: req.params.tourId };
  next();
};

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.getReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
exports.updateReview = factory.updateOne(Review);

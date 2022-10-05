const router = require("express").Router();
const isAuth = require("../middleware/middleware");
const fileUploader = require("../config/cloudinary.config");
const Article = require("../models/Article.model");

router.get("/", async (req, res, next) => {
  try {
    const articles = await Article.find().limit(3);
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
router.get("/more/:skip", async (req, res, next) => {
  try {
    const articles = await Article.find().skip(req.params.skip).limit(3);
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/all", isAuth, async (req, res, next) => {
  try {
    const articles = await Article.find();
    res.status(200).json(articles);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post(
  "/new",
  isAuth,
  fileUploader.single("image"),
  async (req, res, next) => {
    try {
      const {
        title,
        image,
        city,
        publisher,
        other,
        link,
        food,
        seasonal,
        lifestyle,
        guide,
        review,
        recipes,
        publicationDate,
      } = req.body;
      const newArticle = await Article.create({
        title: title,
        image: image,
        city: city,
        publisher: publisher,
        other: other,
        link: link,
        category: {
          food: food,
          lifestyle: lifestyle,
          guide: guide,
          review: review,
          recipes: recipes,
          seasonal: seasonal,
        },
        image: req.file.path,
        publicationDate: publicationDate,
      });
      res.status(200).json(newArticle);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

router.delete("/delete/:id", isAuth, async (req, res, next) => {
  try {
    const deleteArticle = await Article.findOneAndDelete({
      _id: req.params.id,
    });
    res.status(204).json(deleteArticle);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;

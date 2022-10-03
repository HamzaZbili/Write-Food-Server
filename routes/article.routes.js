const router = require("express").Router();
const isAuth = require("../middleware/middleware");
const Article = require("../models/Article.model");

router.get("/", async (req, res, next) => {
  try {
    const eateries = await Article.find();
    res.status(200).json(eateries);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.post("/new", isAuth, async (req, res) => {
  try {
    const {
      title,
      image,
      city,
      publisher,
      other,
      link,
      food,
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
      },
      publicationDate: publicationDate,
    });
    res.status(200).json(newArticle);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = router;

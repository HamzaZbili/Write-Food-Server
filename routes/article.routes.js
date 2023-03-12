const router = require("express").Router();
const isAuth = require("../middleware/middleware");
const fileUploader = require("../config/cloudinary.config");
const Article = require("../models/Article.model");

router.get("/", async (req, res, next) => {
  try {
    const articles = await Article.find().limit(6);
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

router.get("/lifestyle", async (req, res, next) => {
  try {
    const lifeStyle = await Article.find({
      "category.lifestyle": true,
    });
    res.status(200).json(lifeStyle);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/guides", async (req, res, next) => {
  try {
    const guides = await Article.find({
      "category.guide": true,
    });
    console.log(guides.length);
    res.status(200).json(guides);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/reviews", async (req, res, next) => {
  try {
    const reviews = await Article.find({
      "category.review": true,
    });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/recipes", async (req, res, next) => {
  try {
    const recipes = await Article.find({
      "category.recipe": true,
    });
    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

router.get("/seasonal", async (req, res, next) => {
  try {
    const seasonal = await Article.find({
      "category.seasonal": true,
    });
    res.status(200).json(seasonal);
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
        recipe,
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
          recipe: recipe,
          seasonal: seasonal,
        },
        image: req.file.path,
        publicationDate: publicationDate,
      });
      res.status(201).json(newArticle);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

router.patch("/update/:id", isAuth, async (req, res, next) => {
  try {
    const {
      title,
      image,
      city,
      publicationDate,
      publisher,
      other,
      link,
      food,
      seasonal,
      lifestyle,
      guide,
      review,
      recipe,
    } = req.body;
    const id = req.params.id;
    const updatedArticle = await Article.findOneAndUpdate(
      { _id: id },
      {
        title: title,
        image: image,
        city: city,
        publisher: publisher,
        publicationDate: publicationDate,
        other: other,
        link: link,
        category: {
          food: food,
          lifestyle: lifestyle,
          guide: guide,
          review: review,
          recipe: recipe,
          seasonal: seasonal,
        },
      },
      { new: true }
    );
    res.status(202).json(updatedArticle);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

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

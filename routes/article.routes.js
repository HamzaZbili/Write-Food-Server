const router = require("express").Router();
const isAuth = require("../middleware/middleware");
const fileUploader = require("../config/cloudinary.config");
const Article = require("../models/Article.model");

router.get("/", async (req, res) => {
  const { category, publisher, city, order, search } = req.query;

  // Build query object
  const query = {};

  // Checkboxes for city, publisher, and category
  if (city) {
    query.city = { $in: city };
  }

  if (publisher) {
    query.publisher = { $in: publisher };
  }

  if (category) {
    const categories = category.split(",");
    query.category = { $in: categories };
  }

  if (search) {
    query.title = new RegExp(search, "i");
  }

  // Build sort object
  const sort = {};

  if (order === "asc") {
    sort.publicationDate = 1;
  } else if (order === "desc") {
    sort.publicationDate = -1;
  }

  try {
    const articles = await Article.find(query).sort(sort);
    res.send(articles);
  } catch (err) {
    res.status(500).send(err.message);
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

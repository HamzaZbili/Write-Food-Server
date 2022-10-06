const { Schema, model } = require("mongoose");

const articleSchema = new Schema(
  {
    title: String,
    image: String,
    city: String,
    publisher: String,
    other: String,
    link: String,
    category: {
      lifestyle: Boolean,
      guide: Boolean,
      review: Boolean,
      recipe: Boolean,
      seasonal: Boolean,
    },
    publicationDate: Date,
  },
  {
    timestamps: true,
  }
);

const Article = model("Article", articleSchema);

module.exports = Article;

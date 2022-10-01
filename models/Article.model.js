const { Schema, model } = require("mongoose");

const articleSchema = new Schema(
  {
    title: String,
    image: String,
    city: String,
    publisher: String,
    category: [String],
    publicationDate: Date,
  },
  {
    timestamps: true,
  }
);

const Article = model("Article", articleSchema);

module.exports = Article;

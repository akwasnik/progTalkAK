const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      required: true,
      index: true
    },

    login: {
      type: String,
      required: true,
      index: true
    },

    content: {
      type: String,
      required: true
    },

    references: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ],

    tags: [
      {
        type: String,
        index: true
      }
    ],

    likes: {
      type: [String],
      default: []
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Post", PostSchema);

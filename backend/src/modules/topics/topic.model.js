const mongoose = require("mongoose");

const TopicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
      default: null
    },

    path: {
      type: [mongoose.Schema.Types.ObjectId],
      required: true,
      index: true
    },

    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
      }
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    moderators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    blockedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    isClosed: {
      type: Boolean,
      default: false
    },

    isHidden: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Topic", TopicSchema);

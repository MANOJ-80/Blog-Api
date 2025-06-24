const postRoute = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

const { isAuthenticated } = require("../controllers/authController");

postRoute.get("/", isAuthenticated, async (req, res) => {
  console.log("get post");
  try {
    const posts = await db.post.findMany({
      include: {
        comments: true,
      },
    });
    console.log(posts);
    res.json(posts);
  } catch (error) {
    console.log(error);
  }
});

postRoute.post("/add", isAuthenticated, async (req, res) => {
  const post = req.body;
  const newPost = await db.post.create({
    data: {
      title: post.title,
      content: post.content,

      author: {
        connect: {
          id: req.user.id,
        },
      },
    },
  });
  res.json(newPost);
});

postRoute.delete("/delete/:id", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  try {
    await db.comment.deleteMany({
      where: { postId: Number(postId) },
    });
    const deletedPost = await db.post.delete({
      where: { id: Number(postId) },
    });
    res.json(deletedPost);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to delete post" });
  }
});

postRoute.put("/update/:id", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  const updatedPost = await db.post.update({
    where: {
      id: Number(postId),
    },
    data: {
      title: req.body.title,
      content: req.body.content,
    },
  });
  res.json(updatedPost);
});
postRoute.get("/:id", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  try {
    const post = await db.post.findUnique({
      where: {
        id: Number(postId),
      },
      include: {
        comments: true,
      },
    });
    res.json(post);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch post" });
  }
});
postRoute.post("/:id/comment", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  const { content } = req.body;
  try {
    const newComment = await db.comment.create({
      data: {
        content: content,
        post: {
          connect: {
            id: Number(postId),
          },
        },
        author: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });
    res.json(newComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

postRoute.delete(
  "/:id/comment/:commentId",
  isAuthenticated,
  async (req, res) => {
    const commentId = req.params.commentId;
    try {
      const deletedComment = await db.comment.delete({
        where: {
          id: Number(commentId),
        },
      });
      res.json(deletedComment);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete comment" });
    }
  }
);

postRoute.put("/:id/comment/:commentId", isAuthenticated, async (req, res) => {
  const commentId = req.params.commentId;
  const updatedComment = await db.comment.update({
    where: {
      id: Number(commentId),
    },
    data: {
      content: req.body.content,
    },
  });
  res.json(updatedComment);
});
postRoute.get("/:id/comment/:commentId", isAuthenticated, async (req, res) => {
  const commentId = req.params.commentId;
  try {
    const comment = await db.comment.findUnique({
      where: {
        id: Number(commentId),
      },
    });
    res.json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch comment" });
  }
});
postRoute.get("/:id/comments", isAuthenticated, async (req, res) => {
  const postId = req.params.id;
  try {
    const comments = await db.comment.findMany({
      where: {
        postId: Number(postId),
      },
    });
    res.json(comments);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to fetch comments" });
  }
});

module.exports = postRoute;

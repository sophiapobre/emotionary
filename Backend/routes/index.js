import express from 'express';
import entry from "./entry.js"
import tag from "./tag.js";
import user from "./user.js";
import email from "./email.js";

// exports router

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello from Node API");
});

router.use('/entries', entry);
router.use('/tags', tag);
router.use('/users', user);
router.use('/email', email);

export { router };
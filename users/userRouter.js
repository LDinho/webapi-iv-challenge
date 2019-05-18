const express = require('express');

const router = express.Router();

const db = require('./userDb');
const db_posts = require('../posts/postDb');

const {
  get,
  getById,
  getUserPosts,
  insert,
  remove,
  update
} = db;

/*
@ROOT-ROUTE: "/api/users"
*/

/*
@POST: New user
@PARAMS: name[STRING]!
@ROUTE: "/"
*/

router.post('/', validateUser, (req, res) => {
  const user = req.body;

  if (user) {
    console.log("NEW USER:", user);
    insert(user);
    res.status(201).json(user);

  } else {
    res.status(500).json({
      message: `Server error - unable to save new user!`
    })
  }

});

/*
@POST: Create New Post From User with id
@PARAMS: text[STRING]!
@ROUTE: "/:id/posts"
*/

router.post(
  '/:id/posts',
  validateUserId,
  validatePost,
  async (req, res) => {

  const { id } = req.params;

  let post = {...req.body, user_id: id};

  try {

    if (post.text !== '') { // prevents empty text string to be inserted
      post = await db_posts.insert(post);
      res.status(201).json(post)
    }

  }
  catch (err) {
    res.status(500)
       .json({error: `Unable to post message`})
  }

});

/*
@GET: All Users
@PARAMS: none
@ROUTE: "/"
*/

router.get('/', async (req, res) => {
  try {
    const users = await get();

    if (users.length) {
      res.status(200).json(users)

    } else {
      res.status(400).json({message: `No users found`})

    }
  }
  catch (err) {
    res.status(500).json({error: `Unable to retrieve users`})
  }

});

/*
@GET: User
@PARAMS: id[STRING]!
@ROUTE: "/:id"
*/

router.get('/:id', validateUserId, (req, res) => {
  console.log(req.user);
  res.status(200).json(req.user)

});

/*
@GET:  A User's Posts
@PARAMS: id[STRING]!
@ROUTE: "/:id/posts"
*/

router.get('/:id/posts', validateUserId, async (req, res) => {
  const { id } = req.params;

  try {
    const posts = await getUserPosts(id);

    if (posts.length) {
      res.status(200).json(posts);

    } else {
      res.status(200)
         .json({
           message: `User has no posts.`
         })
    }
  }
  catch (err) {
    res.status(500)
       .json({
         error: `Unable to retrieve user's posts.`
       })
  }

});

/*
@DELETE: User
@PARAMS: id[STRING]!
@ROUTE: "/:id"
*/

router.delete('/:id', validateUserId, async (req, res) => {
  const { id } = req.params;

  try {
    await remove(id)
      ?   res.status(200)
             .json({message: `user has been deleted`})
      :   res.status(404)
             .json({message: `user does not exist.`})
  }
  catch (err) {
    res.status(500)
       .json({error: `Unable to process the request`})
  }

});

/*
@UPDATE: User
@PARAMS: id[STRING]! name[STRING]!
@ROUTE: "/:id"
*/

router.put('/:id', validateUserId, async (req, res) => {

  const { id } = req.params;
  const user = req.body;

  try {
    await update(id, user)
      ?   res.status(200).json(user)
      :   res.status(404)
             .json({message: `user does not exist`})
  }
  catch (err) {
    res.status(500)
       .json({error: `Unable to process the request`})
  }

});

//custom middleware

async function validateUserId(req, res, next) {
  const { id } = req.params;

  try {
    const user = await getById(id);

    if (user) {
      req.user = user;
      next();

    } else {
      res.status(404).json({message: 'invalid user id'})
    }
  }
  catch (err) {
    res.status(500).json({message: 'server unable to process your request'})
  }

}

function validateUser(req, res, next) {

  if (req.body && Object.keys(req.body).length) {
    next();

  } else {
    res.status(400).json({message: 'missing user data'})
  }

  if (req.body.name !== '') {
    next();

  } else {
    res.status(400).json({message: 'missing required name field'})
  }

}

function validatePost(req, res, next) {

  if (req.body && Object.keys(req.body).length) {
    next();

  } else {
    res.status(400).json({message: 'missing post data'})
  }

  if (req.body.text !== '') {
    next();

  } else {
    res.status(400).json({message: 'missing required text field'})
  }

};

module.exports = router;

const express=require('express');
const router=express.Router();
const {check,validationResult}=require('express-validator');
const auth=require('../../middleware/auth');
const Post=require('../../models/Posts');
const Profile=require('../../models/Profile');
const User=require('../../models/User');
const { route } = require('./users');
//@route get api/users
router.post('/',[auth,[
    check('text','Text is req').not()
    .isEmpty()
]],async(req,res)=>{
   const errors=validationResult(req);
   if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()});
   }
     try{
     const user=await User.findById(req.user.id).select('-password');
 console.log(user);
 const newPost=new Post({
  text:req.body.text,
  name:user.name,
  avatar:req.user.id,
  user:req.user.id
});
  const post=await newPost.save();
  res.send(post);
}
  catch(err){
 res.status(500).send("kashish");
  }
 }
)
router.get('/:id',auth,async (req,res)=>{
  try{
   const post=await Post.findById(req.params.id).sort({date:-1});
   if(!post)
   return res.status(404).send('Post not found');
   res.json(post);
  }
  catch(err){
    if(err.kind==='ObjectId')
   return res.status(404).send('Not valid user');
    console.log(err)
 res.status(500).send(err);
  }
});
router.get("/", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

router.delete('/:id',auth,async (req,res)=>{
  try{
   const post=await Post.findById(req.params.id);
   if(!post)
   return res.status(404).send('Post not found');
  await post.remove();
  res.send({msg:'Post removed'});
  }
  catch(err){
    if(err.kind==='ObjectId')
   return res.status(404).send('Not valid Post');
    console.log(err)
 res.status(500).send(err);
  }
});
router.put('/like/:id', auth,  async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes.unshift({ user: req.user.id });

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.put('/unlike/:id', auth,  async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Check if the post has already been liked
    if (!post.likes.some((like) => like.user.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Post already liked' });
    }

    post.likes = post.likes.filter(
      ({ user }) => user.toString() !== req.user.id
    );

    await post.save();

    return res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.post(
  '/comment/:id',
  auth,
  check('text', 'Text is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const user = await User.findById(req.user.id).select('-password');
      const post = await Post.findById(req.params.id);

      const newComment = {
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      };

      post.comments.unshift(newComment);

      await post.save();

      res.json(post.comments);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete comment
// @access   Private
router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    // Pull out comment
    const comment = post.comments.find(
      (comment) => comment.id === req.params.comment_id
    );
    // Make sure comment exists61f3f24392a10b362079bb08
    if (!comment) {
      return res.status(404).json({ msg: 'Comment does not exist' });
    }
    // Check user
    if (comment.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    post.comments = post.comments.filter(
      ({ id }) => id !== req.params.comment_id
    );

    await post.save();

    return res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});
module.exports=router; 
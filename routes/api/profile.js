const express=require('express');
const router=express.Router();
const auth=require('../../middleware/auth');
//@route get api/users
const Profile=require('../../models/Profile');
const User=require('../../models/User');
router.get('/me',auth,async(req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);
       if(!profile){
           return res.status(400).json({msg:'no profile'});
       }res.send(profile);
    }
    catch(err){
        console.log(err.message);
        res.status(500).send('Server error');
    }
})
module.exports=router;
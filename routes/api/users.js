const express=require('express');
const router=express.Router();
//@route get api/users
const jwt=require('jsonwebtoken');
const User=require('../../models/User')
const gravatar=require('gravatar');
const {check,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const config=require('config')
router.get('/',(req,res)=>{
    res.send('User route');
})
router.post('/u',[
    check('name','Name is required').not().isEmpty(),
    check('email','please include a valid email').isEmail(),
    check('password','please include a password').isLength({
        min:6
    })
],async(req,res)=>{
    const error=validationResult(req);
    if(!error.isEmpty()){
     return res.status(400).json({errors:error.array()})
    }
    console.log(req.body);
    const{name,email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(user){
           return res.status(400).json({errors:[{msg:'user already exist'}]});
        }
        
        const avatar=gravatar.url(email,{
            s:'200',
            r:'pg',
            d:'mm'
        })
        user=new User({name,email,avatar,password});
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password,salt);
        await user.save();
        const payload={
            user:{
                id:user.id
            }
        }
        jwt.sign(payload,
            config.get('jwtSecret'),{
                expiresIn:360000
            },(err,token)=>{
                if(err) throw err;

                res.json({token});
            });
        
    }
    catch(err){
    console.log(err.message);
    res.status(500).send("server error");
    process.exit(1);
    }
})
module.exports=router;
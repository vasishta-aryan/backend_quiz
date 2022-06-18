const express=require('express');
const router=express.Router();
const User=require('../../models/User');
const auth=require('../../middleware/auth');
const config=require('config')
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const {check,validationResult}=require('express-validator');
router.get('/',auth,async (req,res)=>{console.log("123");
    try{
     const user=await User.findById(req.user.id).select('-password');
     res.json(user);
    }
    catch(err){
     console.log(err.message);
     res.send(500).send('Server error');
    }
})

router.post('/',[
    check('email','please include a valid email').isEmail(),
    check('password','please include a password').exists()
],async(req,res)=>{
    
    console.log(req.body);
    const{email,password}=req.body;
    try{
        let user=await User.findOne({email});
        if(!user){
           return res.status(400).json({errors:[{msg:'user not exist'}]});
        }
        
        const isMatch=await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({errors:[{msg:'Invalid credentials'}]});
         }
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
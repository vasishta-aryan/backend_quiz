const express=require('express');
const router=express.Router();
//@route get api/users
const jwt=require('jsonwebtoken');
const Survey=require('../../models/Survey')
const {check,validationResult}=require('express-validator');
const bcrypt=require('bcryptjs');
const config=require('config');
const auth=require('../../middleware/auth');
router.get('/getdata',(req,res)=>{
    res.send('Survey route');
})
router.post('/surveydata',auth,async(req,res)=>{
    console.log(req.body);
    if(req.body.name ==null || req.body.lastname ==null || req.body.age == null ||req.body.vaccinated ==null ||(req.body.vaccinated==true  || req.body.vaccinated==false ))
    {
    res.status(400);
    res.send("Failure");
    }
    else
    {
    survey=new Survey(
        {name:req.body.name,
        lastname:req.body.lastname,
        vaccinated:req.body.vaccinated,
        age:req.body.age
        });
    try{
    await survey.save();
    res.send("success");}
    catch{
    res.status(400);
    res.send("Failure");
    }
    }

    })
module.exports=router;

router.get("/survey", auth, async (req, res) => {
    try {
      const posts = await Survey.find();
      res.json(posts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  });
const UserModel = require("../models/usersModel");
const asyncWrapper = require("../middlewares/asyncWrapper");
const httpStatusText = require("../utils/httpStatusText");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const generatJWT = require("../utils/generateJWT");

exports.getAllUsers = asyncWrapper( async (req, res ,next) =>{
    const query = req.query;
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = (page-1)*limit;
    
    const users = await UserModel.find({},{"__v":false, "password":false}).limit(limit).skip(skip);
    res.status(200).json({status: httpStatusText.SUCCESS, data: {users}});
});

exports.register = asyncWrapper(async (req, res, next) =>{
    const {firstName, lastName, email, password, role} = req.body;

    const oldUser = await UserModel.findOne({email: email})

    if(oldUser){
    const error = appError.create("user aleady exists", 404, httpStatusText.FAIL);
    return next(error);
    }
    // password hash
    const hashedPassord = await bcrypt.hash(password, 10);
    const newUser = new UserModel({firstName, lastName, email, password: hashedPassord, role, avatar: req.file.filename});
    // generate JWT
    const token = await generatJWT({eamil: newUser.email, id:newUser._id, role: newUser.role});
    newUser.token = token;
    await newUser.save()
    res.status(201).json({status: httpStatusText.SUCCESS, data: {newUser}});

});

exports.login = asyncWrapper( async (req, res, next) =>{
    const {email, password} = req.body;
    if(!email && !password){
    const error = appError.create("email and password are required", 404, httpStatusText.FAIL);
    return next(error);
    }
    const user = await UserModel.findOne({email: email});
    if(!user){
        const error = appError.create("user not fouond", 500, httpStatusText.FAIL);
        return next(error);
    }

    const matchedpassword = bcrypt.compare(password, user.password);
    if(user && matchedpassword){
    // logged in successfully
        const token = await generatJWT({eamil: user.email, id:user._id, role: user.role});
        return res.status(201).json({status: httpStatusText.SUCCESS, data: {token}});
    }else{
        const error = appError.create("something worng", 500, httpStatusText.FAIL);
        return next(error);
    }
});
const User = require("../../models/user");
const bcrypt = require("bcrypt");

exports.getUsers = (req, res) => {
    
    User.find({role: "user"}).exec((error, users) => {
        if(error) return res.status(500).json({error});

        if(users) return res.status(200).json({users});
    });
}

exports.updateUser = async (req, res) => {
    if(!req.body._id) return res.status(500).json({error: "Can not find user id"});
    
    const { _id, firstName, lastName, password, email } = req.body;
    const user = {
        _id,
        firstName,
        lastName,
        email,
    }
    if(password){
        const hashPassword = await bcrypt.hash(password, 10);
        user.hashPassword = hashPassword;
    }
    


    User.findOneAndUpdate({_id: req.body._id}, user, {new: true}).exec( (error, updatedUser) => {
        if(error) return res.status(500).json({error});

        if(updatedUser) return res.status(201).json(updatedUser);
    });
}
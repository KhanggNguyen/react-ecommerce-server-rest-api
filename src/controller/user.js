const User = require('../models/user');

exports.getUserById = (req, res) => {
    if(req.user.role === "user"){

        if (!req.user?._id)
            return res.status(500).json({ error: "Cannot find user id" });

        User.find({_id: req.user._id}).exec( (error, _user) => {
            if(error) return res.status(500).json({error});

            if(_user) return res.status(200).json(_user);
        });
    }else if(req.user.role === "admin"){
        
        if(!req.body._id) return res.status(500).json({error: "Please provide an user id."});
        
        User.find({_id: req.body._id}).exec( (error, _user) => {
            if(error) return res.status(500).json({error});

            if(_user) return res.status(200).json(_user);
        });
    }

};

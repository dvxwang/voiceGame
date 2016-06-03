var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req,res,next){
	res.sendFile(path.join(__dirname, './index.html'));
})

router.use('/', function (req, res, next) {
    res.status(500).send("Internal Server Error");
});

module.exports=router;
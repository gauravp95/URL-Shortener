const urlModel = require('../models/urlModel');
const shortid = require('shortid');
const baseUrl = "https://localhost:3000";
const {isValid, isValidRequestBody} = require('../validator/validator')


const urlShort = async function (req,res) {
    try {
        let requestBody = req.body;
        let longUrl = req.body.longUrl;
        const shortCode = shortid.generate().toLowerCase();
        longUrl = longUrl.trim();

        if(!isValidRequestBody(requestBody)) {
            return res.staus(400).send({status: false, message: 'Invalid request parameters. Please provide long url'});
        }

        if(!isValid(longUrl)) {
            return res.status(400).send({status: false, message: 'Please provide longUrl'});
        }
        const shortUrl = baseUrl + '/' + shortCode;
        const shortUrlData = await urlModel.create({
            longUrl: longUrl,
            shortUrl: shortUrl,
            urlCode: shortCode
        });
        
        const data = {
            longUrl: shortUrlData.longUrl,
            shortUrl: shortUrlData.shortUrl,
            urlCode: shortUrlData.urlCode
        }

        return res.status(201).send({status: true, message: 'Successfully shortened the URL', data: data});

    } catch (error) {
        return res.status(500).send({status: false, message: error.message});
    }
};

const getUrlDetails = async function (req,res) {
    try {
        let urlCode = req.params;
        
        const urlDetails = await urlModel.findOne(urlCode).select({_id:0,createdAt:0,updatedAt:0,__v:0});
        
        if(!urlDetails) {
            return res.status(400).send({status: false, message: 'No such URL details available for this urlCode'});
        }
        return res.status(200).send({status: true, data: urlDetails});

    } catch (error) {
        return res.status(500).send({status: false, message: error.message})
    }
}

module.exports = {urlShort, getUrlDetails}
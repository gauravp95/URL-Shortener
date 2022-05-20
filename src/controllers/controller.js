const urlModel = require('../models/urlModel');
const shortid = require('shortid');
const baseUrl = "http://localhost:3000";
const {isValid, isValidRequestBody,isValidLongURL} = require('../validator/validator');
const {promisify} = require('util');
const {redisClient} = require('../server');

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient)
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient)


const urlShort = async function (req,res) {
    try {
        let requestBody = req.body;
        let longUrl = req.body.longUrl;
        const shortCode = shortid.generate().toLowerCase();
        longUrl = longUrl.trim();

        if(!isValidRequestBody(requestBody)) {
            return res.staus(400).send({status: false, message: 'Invalid request parameters. Please provide long url'});
        };

        if(!isValid(longUrl)) {
            return res.status(400).send({status: false, message: 'Please provide longUrl'});
        };

        if(!isValidLongURL(longUrl) ) { 
            return res.status(400).send({status:false , message: 'Invalid long URL'})    
        };

        const shortUrl = baseUrl + '/' + shortCode;
        const shortUrlData = await urlModel.create({
            longUrl: longUrl,
            shortUrl: shortUrl,           
            urlCode: shortCode
        });
        
        //setting in cache new entries
        await SET_ASYNC(`${shortCode}`,JSON.stringify(longUrl));

        const data = {
            longUrl: shortUrlData.longUrl,
            shortUrl: shortUrlData.shortUrl,
            urlCode: shortUrlData.urlCode
        };

        return res.status(201).send({status: true, message: 'Successfully shortened the URL', data: data});

    } catch (error) {
        return res.status(500).send({status: false, message: error.message});
    }
};

const getUrlDetails = async function (req,res) {
    try {
        let {urlCode} = req.params;
        let cachedLongURL = await GET_ASYNC(urlCode);
        
        let parsedcachedLongURL = JSON.parse(cachedLongURL);
        
        if (parsedcachedLongURL) {
            return res.redirect(307, parsedcachedLongURL);
        } else {
            const urlDetails = await urlModel.findOne({urlCode:urlCode}).select({_id:0,createdAt:0,updatedAt:0,__v:0});
            
            if(urlDetails) {
                return res.redirect(307, urlDetails.longUrl)
            } else {
                return res.status(400).send({status: false, message:'No such URL details available for this urlCode'})
            }
        }

    } catch (error) {
        return res.status(500).send({status: false, message: error.message});
    };
};

module.exports = {urlShort, getUrlDetails};
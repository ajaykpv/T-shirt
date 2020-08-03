const Product =require("../models/product");
const formidable = require("formidable");
const _ =require("lodash");
const fs =require("fs");
const { error } = require("console");


exports.getProductById = (req,res,next,id) =>{
        Product.findById(id)
        .populate("category")
        .exec((err,product)=>{
            if(err){
                return res.status(400).json({
                    error:"Product not found"
                });
            }
            req.product = product;
            next();
        })
};

exports.createProduct = (req,res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req,(err,fields,file)=>{
           if(err){
               return res.status(400).json({
                   error:"problem with image"
               })
           }
           //destructuring fields

           const {price,name,description,category,stock} = fields;
           if(
               !name ||
               !description ||
               !price ||
               !category ||
               !stock
           ){
                return res.status(400).json({
                    error:"please include all fields"
                })
           }

           

           let product = new Product(fields);

           //handle file here

           if(file.photo){
               if(file.photo.size>3000000){
                   return res.status(400).json({
                       error:"file size is too big!"
                   })
               }
               product.photo.data=fs.readFileSync(file.photo.path);
               product.photo.contentType = file.photo.type
           }

           //save to the DB
           product.save((err,product)=>{
               if(err){
                   res.status(400).json({
                       error:"saving T-shirt is failed"
                   })
               }
               res.json(product);
           })
    });
};
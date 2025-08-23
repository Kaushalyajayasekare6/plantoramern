import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productId : {
        type : String,
        required : true,
        unique : true
    },
    name : {
        type : String,
        required : true
    },
    price : {
        type : Number,
        required : true
    },
    images : {
        type : [String],
        default : ["/uploads/products/default-product.jpg"]
    },
    description : {
        type : String,
        required : true
    },
    isAvailable : {
        type : Boolean,
        default : true
    },
    category : {
        type : String,
        required : true,
        default : "cosmetics"
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    }
});

const Product = mongoose.model("products", productSchema);
export default Product;
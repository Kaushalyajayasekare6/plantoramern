import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
});

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [cartItemSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
cartSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for total price (requires population of products)
cartSchema.virtual('totalPrice').get(function() {
    return this.items.reduce((total, item) => {
        if (item.productId && item.productId.price) {
            return total + (item.productId.price * item.quantity);
        }
        return total;
    }, 0);
});

// Ensure virtual fields are serialized
cartSchema.set('toJSON', {
    virtuals: true
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
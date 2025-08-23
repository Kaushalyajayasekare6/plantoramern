import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  productId: { type: String, required: true, ref: 'Product' },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true, maxlength: 1000 },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  replies: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    comment: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });
reviewSchema.virtual('likeCount').get(function() { return this.likes.length; });
reviewSchema.methods.isLikedByUser = function(userId) { return this.likes.includes(userId); };

const Review = mongoose.model('Review', reviewSchema);
export default Review;

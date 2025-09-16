const Product = require('../models/product');
const User = require('../models/user');
const Comment = require('../models/comment');

async function incrementView(productId) {
  return Product.findByIdAndUpdate(productId, { $inc: { views: 1 } }, { new: true });
}

async function incrementPurchased(productId, qty = 1) {
  return Product.findByIdAndUpdate(productId, { $inc: { purchasedCount: qty } }, { new: true });
}

async function incrementCommentCount(productId, delta = 1) {
  return Product.findByIdAndUpdate(productId, { $inc: { commentCount: delta } }, { new: true });
}

async function toggleFavorite(userId, productId) {
  // Determine if product is already favorited
  const user = await User.findById(userId).select('favorites');
  if (!user) throw new Error('User not found');
  const exists = user.favorites?.some(f => f.toString() === productId.toString());
  if (exists) {
    // remove
    await User.findByIdAndUpdate(userId, { $pull: { favorites: productId } });
    await Product.findByIdAndUpdate(productId, { $inc: { favoritedCount: -1 } });
    return { favorited: false };
  } else {
    // add
    await User.findByIdAndUpdate(userId, { $addToSet: { favorites: productId } });
    await Product.findByIdAndUpdate(productId, { $inc: { favoritedCount: 1 } });
    return { favorited: true };
  }
}

async function addComment(userId, productId, content) {
  const comment = await Comment.create({ userId, productId, content });
  await incrementCommentCount(productId, 1);
  return comment;
}

module.exports = {
  incrementView,
  incrementPurchased,
  incrementCommentCount,
  toggleFavorite,
  addComment
};

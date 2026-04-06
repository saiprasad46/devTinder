const mongoose = require('mongoose');

const connectionRequest = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    status: {
      type: String,
      require: true,
      enum: {
        values: ['ignored', 'interested', 'accepeted', 'rejected'],
        message: `{VALUE} is Invalid Status`,
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('ConnectionRequest', connectionRequest);

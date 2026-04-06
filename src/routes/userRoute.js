const userRoute = require('express').Router();
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../modals/connectionRequest');
const User = require('../modals/user');

// API to fetch the requestes with intrested status to the logged-in user
userRoute.get('/user/requests/received', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: 'interested',
    }).populate('fromUserId', 'firstName lastName photoUrl age gender about skills');

    res.json({
      message: 'Data fetched successfully',
      data: connectionRequests,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});
// API to fetch the requestes with accepted status to the logged-in user
userRoute.get('/user/connections', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: 'accepeted',
        },
        {
          fromUserId: loggedInUser._id,
          status: 'accepeted',
        },
      ],
    }).populate('fromUserId', 'firstName lastName photoUrl age gender about skills');

    res.json({
      message: 'Data fetched successfully',
      data: connectionRequests,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: e.message });
  }
});

userRoute.get('/user/feed', userAuth, async (req, res) => {
  try {
    const loggedInUser = req?.user;
    // users not included in feed
    //already connection
    const loggedInUserConnections = await ConnectionRequest.find({
      $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
    });
    console.log('loggedInUserConnections', loggedInUserConnections);
    const loggedInUserConnectionFromIds = loggedInUserConnections.map((i) => i.fromUserId);
    const loggedInUserConnectionToIds = loggedInUserConnections.map((i) => i.toUserId);
    const hideUsersFromFeed = new Set();
    loggedInUserConnections.forEach((item) => {
      hideUsersFromFeed.add(item.fromUserId.toString());
      hideUsersFromFeed.add(item.toUserId.toString());
    });
    const feedData = await User.find({
      $and: [
        { _id: { $nin: loggedInUserConnectionFromIds } },
        { _id: { $nin: loggedInUserConnectionToIds } },
      ],
    });
    console.log('FEEED', feedData.length);
  } catch (error) {
    console.log('EEEEEEEEEEE', error.message);
    res.status(500).json({ message: error.message });
  }
});
module.exports = userRoute;

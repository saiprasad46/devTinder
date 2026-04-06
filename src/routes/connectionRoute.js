const connectionRoute = require('express').Router();
const { validateConnectionReqPayload, validateConnectionReqfromDB } = require('../utils/validator');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequest = require('../modals/connectionRequest');

connectionRoute.post('/request/send/:status/:userId', userAuth, async (req, res) => {
  try {
    const toUserId = req?.params?.userId;
    const status = req?.params?.status;
    const fromUserId = req?.user?._id?.toString();
    //validating payload data
    validateConnectionReqPayload(req, res);
    await validateConnectionReqfromDB(req);
    const data = new ConnectionRequest({
      fromUserId,
      toUserId,
      status,
    });
    if (data) {
      data.save();
      res.json({ message: 'Connection Request sent Successfully' });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: error.message });
  }
});

connectionRoute.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { status, requestId } = req.params;
    const allowedStatus = ['accepeted', 'rejected'];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ messaage: 'Status not allowed!' });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedInUser._id,
      status: 'interested',
    });
    if (!connectionRequest) {
      return res.status(404).json({ message: 'Connection request not found' });
    }
    connectionRequest.status = status;
    const data = await connectionRequest.save();
    if (data) {
      res.json({ mesage: 'Request was accepted' });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: error.message });
  }
});

module.exports = connectionRoute;

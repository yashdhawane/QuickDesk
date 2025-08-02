const Ticket = require('../model/Ticket');
const User = require('../model/User');
const TagCategory = require('../model/TagCategory');
const { Role, Status } = require('../model/enums/enum');
const RoleRequest = require('../model/RoleRequest');

const getadmin =(req,res)=>{
    res.send('List of admin');
}


const getTicketsCounts = async (req, res) => {
    try {
    const result = await Ticket.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const formatted = result.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
    }, {});

    res.json(formatted);
     } catch (err) {
    console.error("Aggregation error:", err);
    res.status(500).json({ error: "Server error" });
  }
}

const getTicketCountPerUser = async (req, res) => {
  try {
    const result = await Ticket.aggregate([
      {
        $group: {
          _id: "$assignTo", // this is ObjectId of the user or null
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          count: 1,
          email: "$user.email"
        }
      }
    ]);

    // Format output
    const formatted = {};
    result.forEach(entry => {
      const key = entry.email || "Unassigned";
      formatted[key] = entry.count;
    });

    res.json(formatted);
  } catch (err) {
    console.error("Error during aggregation:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTicketsFromLastXHours = async (req, res) => {
  try {
    const hours = parseInt(req.body.hours) || 24; // default to 24 hours
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    const count = await Ticket.countDocuments({ createdAt: { $gte: since } });

    res.json({ count, since });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const getTicketCountsByInterval = async (req, res) => {
  try {
    const { hours = 1, interval = 5 } = req.body;

    const since = new Date(Date.now() - hours * 60 * 60 * 1000); // x hours ago

    const result = await Ticket.aggregate([
      {
        $match: {
          createdAt: { $gte: since }
        }
      },
      {
        $group: {
          _id: {
            $dateTrunc: {
              date: "$createdAt",
              unit: "minute",
              binSize: parseInt(interval)
            }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Format output
    const formatted = {};
    result.forEach(entry => {
      const key = entry._id || "Unassigned";
      formatted[key] = entry.count;
    });
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getUsersWithTicketCount = async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $match: { role:  Role.USER}
      },
      {
        $lookup: {
          from: "tickets",
          localField: "_id",
          foreignField: "createdBy",
          as: "tickets"
        }
      },
      {
        $project: {
          _id: 1,
          email: 1,
          ticketCount: { $size: "$tickets" }
        }
      },
      {
        $sort: { ticketCount: -1 }
      }
    ]);

    const formatted = result.map(user => ({
      email: user.email,
      ticketCount: user.ticketCount
    }));
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



const getSupportUsersWithTicketCount = async (req, res) => {
  try {
    const result = await User.aggregate([
  {
    $match: { role: Role.SUPPORT }
  },
  {
    $lookup: {
      from: "tickets",
      localField: "_id",
      foreignField: "assignTo",
      as: "tickets"
    }
  },
  {
    $project: {
      email: 1,
      openCount: {
        $size: {
          $filter: {
            input: "$tickets",
            as: "ticket",
            cond: { $eq: ["$$ticket.status", Status.CLOSED] }
          }
        }
      },
      closedCount: {
        $size: {
          $filter: {
            input: "$tickets",
            as: "ticket",
            cond: { $eq: ["$$ticket.status", Status.CLOSED] }
          }
        }
      },
      inProressCount: {
        $size: {
          $filter: {
            input: "$tickets",
            as: "ticket",
            cond: { $eq: ["$$ticket.status", Status.IN_PROGRESS] }
          }
        }
      }
    }
  }
]);

    // const formatted = result.map(user => ({
    //   email: user.email,
    //   ticketCount: user.ticketCount
    // }));
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};


// const createTagCategory = async (req, res) => {
//   try {
//     const { categoryName } = req.body;
//     if (!categoryName) {
//       return res.status(400).json({ message: 'Category name is required' });
//     }

//     const exists = await TagCategory.findOne({ categoryName });
//     if (exists) {
//       return res.status(409).json({ message: 'Tag already exists' });
//     }

//     const newTag = await TagCategory.create({ categoryName });

//     res.status(201).json({ message: 'Tag created successfully', tag: newTag });
//   } catch (err) {
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// };


const getTicketsCountClosedByUser = async (req,res) => {
  try {
    const result = await User.aggregate([
  {
    $match: { role: Role.SUPPORT }
  },
  {
    $lookup: {
      from: "tickets",
      localField: "_id",
      foreignField: "createdBy",
      as: "tickets"
    }
  },
  {
    $project: {
      _id: 0,
      email: 1,
      closedTicketCount: {
        $size: {
          $filter: {
            input: "$tickets",
            as: "ticket",
            cond: { $eq: ["$$ticket.status", Status.CLOSED] }
          }
        }
      }
    }
  }
]);
     res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'email name profilePic role');
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllPendingRoleRequests = async (req, res) => {
  try {
    const requests = await RoleRequest.find({ status: 'pending' })
      .populate('userId', 'email name role requestedRole');

    res.json(requests);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

const updateRoleRequestStatus = async (req, res) => {
  const { requestId, status } = req.body;

  if (!requestId || !status) {
    return res.status(400).json({ message: 'Request ID and status are required' });
  }

  try {
    const updatedRequest = await RoleRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true }
    );

    if(updatedRequest.status === 'accepted') {
        await User.findByIdAndUpdate(
          updatedRequest.userId,
            { role: updatedRequest.requestedRole },
            { new: true }
        );

        
    }else{
        
        res.send('Role request rejected');
      
    }

    

    if (!updatedRequest) {
      return res.status(404).json({ message: 'Role request not found' });
    }

    


    



    res.json({ message: 'Role request updated successfully', request: updatedRequest });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



module.exports = {getadmin,
  getTicketsCounts,
  getTicketCountPerUser,
  getTicketsFromLastXHours,
  getTicketCountsByInterval,
  getUsersWithTicketCount,
  // createTagCategory,
  getSupportUsersWithTicketCount,
  getTicketsCountClosedByUser,
  getAllUsers,
    getAllPendingRoleRequests,
    updateRoleRequestStatus
};
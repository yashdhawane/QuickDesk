const Ticket = require('../model/Ticket');


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

module.exports = {getadmin,getTicketsCounts,getTicketCountPerUser,getTicketsFromLastXHours,getTicketCountsByInterval};
// const Goal = require('../models/goal');
// const multer = require('multer');
// const path = require('path');
// const fs = require('fs');

// // Ensure uploads directory exists
// const UPLOADS_DIR = path.join(__dirname, '../uploads');
// if (!fs.existsSync(UPLOADS_DIR)) {
//   fs.mkdirSync(UPLOADS_DIR);
// }

// // Configure multer storage and file naming
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, UPLOADS_DIR);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });

// const upload = multer({ storage: storage }).single('documents'); // Handle single file upload

// // GET all goals
// // const getGoals = async (req, res) => {
// //   try {
// //     const goals = await Goal.find();
// //     res.json(goals);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };


// // GET all goals or by date
// // const getGoals = async (req, res) => {
// //   const { date } = req.query;
// //   try {
// //     const query = date ? { date } : {};
// //     const goals = await Goal.find(query);
// //     res.json(goals);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // };
// const getGoals = async (req, res) => {
//   const { date } = req.query;
//   console.log(`Received request for goals on date: ${date}`); // Log incoming request

//   try {
//     const goals = await Goal.find({ date });
//     console.log(`Goals found for date ${date}:`, goals); // Log found goals
//     res.json(goals);
//   } catch (error) {
//     console.error('Error fetching goals:', error);
//     res.status(500).send('Server error');
//   }

// };



// // POST a new goal
// const createGoal = async (req, res) => {
//   const goal = new Goal(req.body);

//   try {
//     const newGoal = await goal.save();
//     res.status(201).json(newGoal);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // Update goal with file upload
// const updateGoal = async (req, res) => {
//   upload(req, res, async (err) => {
//     if (err) {
//       return res.status(400).json({ message: err.message });
//     }

//     const { addtopic, websiteLink, youtubeLink, summary } = req.body;
//     const documents = req.file ? req.file.filename : null;

//     try {
//       const goal = await Goal.findById(req.params.id);

//       if (!goal) {
//         return res.status(404).json({ message: 'Goal not found' });
//       }

//       // Ensure goal.content exists
//       if (!goal.content) {
//         goal.content = {};
//       }

//       // Conditionally update each field if provided in the request body
//       if (addtopic !== undefined) {
//         goal.content.addtopic = addtopic;
//       }
//       if (websiteLink !== undefined) {
//         goal.content.websiteLink = websiteLink;
//       }
//       if (youtubeLink !== undefined) {
//         goal.content.youtubeLink = youtubeLink;
//       }
//       if (documents !== null) {
//         goal.content.documents = documents ? `/uploads/${documents}` : goal.content.documents;
//       }
//       if (summary !== undefined) {
//         goal.content.summary = summary;
//       }

//       await goal.save();

//       res.json(goal);
//     } catch (err) {
//       res.status(400).json({ message: err.message });
//     }
//   });
// };

// // DELETE a goal
// const deleteGoal = async (req, res) => {
//   try {
//     const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
//     if (!deletedGoal) return res.status(404).json({ message: 'Goal not found' });
//     res.json({ message: 'Goal deleted' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = {
//   getGoals,
//   createGoal,
//   updateGoal,
//   deleteGoal,
//   upload // Export upload for use in routes
// };





const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const Goal = require('../models/goal'); // Adjust the path as needed

const app = express();

// Ensure uploads directory exists
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(UPLOADS_DIR));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR); // This should be the directory where files are saved
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Ensure filenames are set correctly
  }
});

const upload = multer({ storage: storage }).single('documents'); // Handle single file upload

app.post('/upload', (req, res) => {
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }
    return res.status(200).send(req.file);
  });
});

const getGoals = async (req, res) => {
  const { date } = req.query;
  console.log(`Received request for goals on date: ${date}`);

  if (date && isNaN(new Date(date).getTime())) {
    return res.status(400).json({ message: 'Invalid date format. Please provide a valid date.' });
  }

  try {
    let goals;
    if (date) {
      // Parse the date string to Date objects
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);  // Set endDate to the start of the next day

      console.log('Start Date:', startDate);
      console.log('End Date:', endDate);

      // Fetch goals within the date range
      goals = await Goal.find({
        date: {
          $gte: startDate,
          $lt: endDate,
        },
      });
    } else {
      // Fetch all goals if no date is provided
      goals = await Goal.find({});
    }

    console.log(`Goals found for date ${date}:`, goals);
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).send('Server error');
  }
};


const createGoal = async (req, res) => {
  try {
    // Extract fields from the request body
    const { addtopic,date } = req.body;

    // Validate that date is provided and in the correct format
    if (!date) {
      return res.status(400).json({ message: 'Date is required' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format' });
    }

    // Create a new goal with the provided data
    const goal = new Goal({
      addtopic,
      
      date: parsedDate,  // Include the date field
     
    });

    // Save the new goal to the database
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    console.error('Error creating goal:', err);
    res.status(400).json({ message: err.message });
  }
};


//Update goal with file upload
const updateGoal = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({ message: err.message });
    }

    const { websiteLink, youtubeLink, summary } = req.body;
    console.log('Request body:', req.body);
    const documents = req.file ? req.file.filename : null;
    console.log('Uploaded file:', req.file);

    try {
      const goal = await Goal.findById(req.params.id);
      if (!goal) {
        return res.status(404).json({ message: 'Goal not found' });
      }

      console.log('Existing goal:', goal);

      // Ensure goal.content exists
      if (!goal.content) {
        goal.content = {};
      }

      // Conditionally update each field if provided in the request body
      if (websiteLink !== undefined) {
        goal.websiteLink = websiteLink;
      }
      if (youtubeLink !== undefined) {
        goal.youtubeLink = youtubeLink;
      }
      if (documents !== null) {
        console.log("doc checkkkkkkkkkkkkkkk",documents);
        goal.documents = documents ? `/uploads/${documents}` : goal.documents;
      }
      if (summary !== undefined) {
        goal.summary = summary;
      }

      console.log('Updated goal:', goal);

      await goal.save();

      res.json(goal);
    } catch (err) {
      console.error('Error updating goal:', err);
      res.status(400).json({ message: err.message });
    }
  });
};




// DELETE a goal
const deleteGoal = async (req, res) => {
  try {
    const deletedGoal = await Goal.findByIdAndDelete(req.params.id);
    if (!deletedGoal) return res.status(404).json({ message: 'Goal not found' });
    res.json({ message: 'Goal deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  upload // Export upload for use in routes
};

// GET all goals or by date
// const getGoals = async (req, res) => {
//   const { date } = req.query;
//   const allGoals = await Goal.find({});
// console.log("All Goals:", allGoals);
//   // Log incoming request date
//   console.log(`Received request for goals on date: ${date}`);

//   // Check if the date is provided and is valid
//   if (!date || isNaN(new Date(date).getTime())) {
//     return res.status(400).json({ message: 'Invalid date format. Please provide a valid date.' });
//   }

//   try {
//     // Parse the date string to Date objects
//     const startDate = new Date(date);
//     const endDate = new Date(date);
//     endDate.setDate(endDate.getDate() + 1);  // Set endDate to the start of the next day

//     // Fetch goals within the date range
//     const goals = await Goal.find({
//       date: {
//         $gte: startDate,
//         $lt: endDate,
//       },
//     });

//     // Log found goals
//     console.log(`Goals found for date ${date}:`, goals);

//     // Send the found goals in response
//     res.json(goals);
//   } catch (error) {
//     console.error('Error fetching goals:', error);
//     res.status(500).send('Server error');
//   }
// };



// const getGoals = async (req, res) => {
//   const { date } = req.query;
//   console.log(`Received request for goals on date: ${date}`);

//   if (date && isNaN(new Date(date).getTime())) {
//     return res.status(400).json({ message: 'Invalid date format. Please provide a valid date.' });
//   }

//   try {
//     let goals;
//     if (date) {
//       // Parse the date string to Date objects
//       const startDate = new Date(date);
//       const endDate = new Date(date);
//       endDate.setDate(endDate.getDate() + 1);  // Set endDate to the start of the next day

//       // Fetch goals within the date range
//       goals = await Goal.find({
//         date: {
//           $gte: startDate,
//           $lt: endDate,
//         },
//       });
//     } else {
//       // Fetch all goals if no date is provided
//       goals = await Goal.find({});
//     }

//     console.log(`Goals found for date ${date}:`, goals);
//     res.json(goals);
//   } catch (error) {
//     console.error('Error fetching goals:', error);
//     res.status(500).send('Server error');
//   }
// };
// Configure multer storage and file naming
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, UPLOADS_DIR);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   }
// });




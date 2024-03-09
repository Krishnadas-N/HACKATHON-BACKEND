const mongoose = require('mongoose');

const contactDetailsSchema = new mongoose.Schema({
    address: String,
    phone: String,
    email: String,
});

const reportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    userName: String,
    contactDetails:  {
        type: contactDetailsSchema,
        default: {}
    },
    location: {
        type: String,
        coordinates: [Number] // [longitude, latitude]
    },
    complaintText: {
        type: String
    },
    severity: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    category: { 
        type: String,
        validate: {
          validator: async function(value) {
            const predefinedOptions = ['Physical Abuse', 'Sexual Abuse', 'Emotional Abuse', 'Financial Abuse', 'Isolation', 'Stalking'];
            if (!predefinedOptions.includes(value)) {
              predefinedOptions.push(value);
              console.log(`Added new category: ${value}`);
            }
            return true;
          },
          message: props => `${props.value} is not a valid category.`
        }
    },
    audio: {
        url: String, 
        duration: Number // Duration of the audio in seconds
      },
      video: {
        url: String,
        duration: Number // Duration of the video in seconds
    },
    images: [String],
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Pending', 'Completed', 'Cancelled', 'In Progress', 'Failed', 'On Hold'], // Update status options
        default: 'Pending' 
    },
    feedback: String,
    assignedOfficial: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Official'
    },
    comments: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now } ,
});
  
const Report = mongoose.model('Complaint', reportSchema);


module.exports=Report;
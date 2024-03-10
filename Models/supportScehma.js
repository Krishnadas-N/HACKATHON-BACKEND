const mongoose =require('mongoose')

const supportContactSchema = new mongoose.Schema({
    hotline: {
      type: String,
      required: true,
      trim: true 
    },
    counselingService: {
      type: String,
      required: true,
      trim: true
    },
    localSupportOrg: {
      type: String,
      required: true,
      trim: true
    },
  }, { timestamps: true }); 

const  SupportContact = mongoose.model("SupportContact",supportContactSchema);
module.exports=SupportContact;
  
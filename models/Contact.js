import mongoose, { mongo } from "mongoose";

const ContactSchema = new mongoose.Schema({
    phone : {
        type : String
    },
    locationName : {
        type : String
    },
    
});

export default mongoose.model("Contact", ContactSchema);

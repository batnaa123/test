import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    transactionAmount: {
        type: Number,
      },
    bonusAmount: {
        type: Number,
    },
    findUser: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    countTourist: {
        type: Number,
    },
    counrtyType: {
        type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    transactionType : {
        type : String,
    },
    isActive : {
        type : Boolean,
        default : true,
    },
    type : {
      type : String,
      enum : ["Pending","Success","Canceled"],
      default : "Pending",
    },
    isPaid : {
      type : Boolean,
      default : false,
    }

  });

  export default mongoose.model("Transaction", TransactionSchema);

import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import MyError from "../utils/myErrors.js";
import asyncHandler from "express-async-handler";
import paginate from "../utils/paginate.js";
import axios from "axios";

export const getTransactions = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const sort = req.query.sort;
    const select = req.query.select;
  
    const startDate = req.query.bonusPaidDate;

    ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  
    const query = { ...req.query };
    if (bonusPaidDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
  
    const pagination = await paginate(page, limit, Transaction.find(req.query));
    const transaction = await Transaction.find(req.query, select)
      .sort(sort)
      .skip(pagination.start - 1)
      .limit(limit);

      res.status(200).json({
        success: true,
        data: transaction,
        pagination,
      });
    });

    export const createTransaction = asyncHandler(async ( req, res, next) => {
      const { transactionAmount , findUser} = req.body;
      const user = await User.findById(findUser);
      if(!user) {
        throw new Error("Харилцагчийн мэдээлэл илэрсэнгүй",400);
      }
      if(!transactionAmount) {
        throw new Error("Худалдан авалтийн дүн олдсонгүй",400)
      };

      const bonusAmount = req.body.transactionAmount * 0.05;
      const transaction = await Transaction.create({findUser: findUser,bonusAmount: bonusAmount,transactionAmount: transactionAmount});
      user.bonusAmount = user.bonusAmount + bonusAmount;
      user.transactionAmount = user.transactionAmount + transactionAmount;
      user.save();

      // const addAmountWithUser = await User.findByIdAndUpdate({_id : findUser} , {bonusAmount : bonusAmount},  {
      //   new: true,
      //   runValidators: true,
      // });
      res.status(200).json({
        success : true,
        trans : transaction,
      })
    });

    export const getUserTransactions = asyncHandler(async (req, res, next) => {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10000;
      const sort = req.query.sort;
      const select = req.query.select;
    
      ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
    
      // Pagination
      const pagination = await paginate(
        page,
        limit,
        Transaction.find({ findUser: req.params.id })
      );
    
      // const likes = await Like.find(req.query, select).sort(sort).skip(pagination.start - 1).limit(limit).populate("post share").populate({path: "post", populate: {path: "createUser", select: "lastName firstName profile"}}).populate({path: "share", populate: {path: "createUser", select: "lastName firstName profile"}})
      const transactions = await Transaction.find({
        findUser: req.params.id,
      })
    
      res.status(200).json({ success: true, data: transactions, pagination });
    });
    
    // export const getTransaction = asyncHandler(async (req, res, next) => {
    //   const transaction = await Transaction.findById(req.params.id).populate("books");
    
    //   if (!transaction) {
    //     throw new MyError(req.params.id + " ID-тай like байхгүй.", 400);
    //   }
    
    //   // like.name += "-"
    //   // like.save(function (err) {
    //   // if (err) console.log("error: ", err)
    //   // console.log("saved...")
    //   // })
    //   res.status(200).json({ success: true, data: transaction });
    // });

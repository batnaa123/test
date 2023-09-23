import { Router } from "express";
import { authorize, protect } from "../middleware/protect.js";

import {
    getTransactions,
    createTransaction,
    getUserTransactions,
    confirmTransaction,
    confirmAllTrans
} from "../controller/transaction.js"

const router = Router();

router.route("/getTransactions").get(protect,getTransactions);
router.route("/createTransaction").post(createTransaction);
router.route("/:id").get(getUserTransactions).put(confirmTransaction);
router.use(protect);
router.route("/confirmAllTrans").post(confirmAllTrans);
export default router;
import { Router } from "express";
import { authorize, protect } from "../middleware/protect.js";

import {
    getTransactions,
    createTransaction,
    getUserTransactions
} from "../controller/transaction.js"

const router = Router();

router.route("/getTransactions").get(protect,getTransactions);
router.route("/createTransaction").post(createTransaction);
router.route("/:id").get(getUserTransactions);

router.use(protect);

export default router;
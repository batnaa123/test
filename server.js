import dotenv from "dotenv";
import express from "express";
import rfs from "rotating-file-stream";
import morgan from "morgan";
import logger from "./middleware/logger.js";
import fileupload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import colors from "colors";
// Router оруулж ирэх
// import categoriesRoutes from "./routes/categories.js";
// import articlesRoutes from "./routes/articles.js";
import userRoutes from "./routes/user.js";
import transactionRoutes from "./routes/transaction.js";
// import adsRoutes from "./routes/ads.js";
// import postsRoutes from "./routes/posts.js";
// import commentsRoutes from "./routes/comments.js";
// import likesRoutes from "./routes/likes.js";
// import errorHandler from "./middleware/error.js";
import connectDB from "./config/db.js";
// import walletsRoutes from "./routes/wallets.js";
// Аппын тохиргоог process.env рүү ачаалах
dotenv.config({ path: "./config/config.env" });

// Mysql тэй ажиллах обьект

// Express апп үүсгэх
const app = express();

// MongoDB өгөгдлийн сантай холбогдох
connectDB();

var whitelist = [
  "http://localhost:4040",
  "http://139.59.115.72",
  "http://139.59.115.72:4040",
  "http://192.168.1.8:4040",
];

// Өөр домэйн дээр байрлах клиент вэб аппуудаас шаардах шаардлагуудыг энд тодорхойлно
var corsOptions = {
  // Ямар ямар домэйнээс манай рест апиг дуудаж болохыг заана
  origin: function (origin, callback) {
    if (origin === undefined || whitelist.indexOf(origin) !== -1) {
      // Энэ домэйнээс манай рест рүү хандахыг зөвшөөрнө
      callback(null, true);
    } else {
      // Энэ домэйнд хандахыг хориглоно.
      callback(new Error("Horigloj baina.."));
    }
  },
  // Клиент талаас эдгээр http header-үүдийг бичиж илгээхийг зөвшөөрнө
  allowedHeaders: "Authorization, Set-Cookie, Content-Type",
  // Клиент талаас эдгээр мэссэжүүдийг илгээхийг зөвөөрнө
  methods: "GET, POST, PUT, DELETE",
  // Клиент тал authorization юмуу cookie мэдээллүүдээ илгээхийг зөвшөөрнө
  credentials: true,
};

// index.html-ийг public хавтас дотроос ол гэсэн тохиргоо
// app.use(express.static(new URL("public", import.meta.url).pathname));

// // Express rate limit : Дуудалтын тоог хязгаарлана
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 500, // limit each IP to 100 requests per windowMs
//   message: "15 минутанд 3 удаа л хандаж болно! ",
// });
// app.use(limiter);
// http parameter pollution халдлагын эсрэг articles?name=aaa&name=bbb  ---> name="bbb"
app.use(hpp());
// Cookie байвал req.cookie рүү оруулж өгнө0
app.use(cookieParser());
// Бидний бичсэн логгер
app.use(logger);
// Body дахь өгөгдлийг Json болгож өгнө
app.use(express.json());
// Өөр өөр домэйнтэй вэб аппуудад хандах боломж өгнө
app.use(cors(corsOptions));
// Клиент вэб аппуудыг мөрдөх ёстой нууцлал хамгаалалтыг http header ашиглан зааж өгнө
app.use(helmet());
// клиент сайтаас ирэх Cross site scripting халдлагаас хамгаална
// app.use(xss());
// Клиент сайтаас дамжуулж буй MongoDB өгөгдлүүдийг халдлагаас цэвэрлэнэ
app.use(mongoSanitize());
// Сэрвэр рүү upload хийсэн файлтай ажиллана
app.use(fileupload());

// Morgan logger-ийн тохиргоо
var accessLogStream = rfs.createStream("access.log", {
  interval: "1d", // rotate daily
  path: new URL("log", import.meta.url).pathname,
});
app.use(morgan("combined", { stream: accessLogStream }));

// REST API RESOURSE
// app.use("/api/v1/categories", categoriesRoutes);
// app.use("/api/v1/articles", articlesRoutes);
app.use("/user", userRoutes);
app.use("/transaction", transactionRoutes);

// app.use("/api/v1/ads", adsRoutes);
// app.use("/api/v1/wallets", walletsRoutes);
// app.use("/api/v1/posts", postsRoutes);
// app.use("/api/v1/comments", commentsRoutes);
// app.use("/api/v1/likes", likesRoutes);
// Алдаа үүсэхэд барьж авч алдааны мэдээллийг клиент тал руу автоматаар мэдээлнэ
// app.use(errorHandler);

// express сэрвэрийг асаана.
const server = app.listen(
  process.env.PORT,
  console.log(`Express сэрвэр ${process.env.PORT} порт дээр аслаа... `.rainbow)
);

// Баригдалгүй цацагдсан бүх алдаануудыг энд барьж авна
process.on("unhandledRejection", (err, promise) => {
  console.log(err);
  console.log(`Алдаа гарлаа : ${err.message}`.underline.red.bold);
  server.close(() => {
    process.exit(1);
  });
});

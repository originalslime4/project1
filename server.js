import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import dotenv from "dotenv";
dotenv.config();
console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
  origin: "https://project1-n922.onrender.com", // 또는 Render 배포 주소
  credentials: true
}));

app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));
app.use(session({
  secret: "tmffkdlavmfhwprxm",
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    sameSite: "None"
  }
}));

const DATA_FILE = path.join(__dirname, "fileList.json");
let fileList = fs.existsSync(DATA_FILE) ? JSON.parse(fs.readFileSync(DATA_FILE)) : [];

const upload = multer({ dest: "temp/" }); // 임시 저장 폴더

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);




app.get("/login", (req, res) => {
const authUrl = oauth2Client.generateAuthUrl({
  access_type: "offline",
  scope: ["https://www.googleapis.com/auth/drive.file"],
});
  res.redirect(authUrl);
});

app.get("/auth/check", (req, res) => {
  if (req.session.tokens) {
    res.json({ loggedIn: true });
  } else {
    res.status(401).json({ loggedIn: false });
  }
});

// 인증 코드 처리
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  req.session.tokens = tokens;
  res.redirect("/"); // 로그인 후 메인 페이지로 이동
});

// 업로드 API → 사용자 Drive에 저장
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.session.tokens) return res.status(401).json({ error: "로그인 필요" });
  console.log("1")
  oauth2Client.setCredentials(req.session.tokens);
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const { title, name } = req.body;
  const filePath = req.file.path;
console.log(drive)
  try {
    const fileMetadata = { name: req.file.originalname };
    const media = {
      mimeType: req.file.mimetype,
      body: fs.createReadStream(filePath)
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media,
      fields: "id"
    });

    const fileId = response.data.id;

    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" }
    });

    const fileUrl = `https://drive.google.com/uc?id=${fileId}`;
    const newFile = {
      id: Date.now(),
      title,
      name,
      url: fileUrl,
      createdAt: new Date().toLocaleString()
    };

    fileList.push(newFile);
    fs.writeFileSync(DATA_FILE, JSON.stringify(fileList, null, 2));
    res.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error("Drive 업로드 실패", err);
    res.status(500).json({ error: "업로드 실패" });
  } finally {
    fs.unlinkSync(filePath); // 임시 파일 삭제
  }
});

// 목록 조회 API
app.get("/files", (req, res) => {
  res.json(fileList);
});

// SPA 라우팅 처리
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Render 포트 사용
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});


// import express from "express";
// import multer from "multer";
// import cors from "cors";
// import fs from "fs";
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// app.use(cors());
// app.use(express.json());

// // 정적 파일 제공
// app.use(express.static(path.join(__dirname, "dist")));
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// const DATA_FILE = path.join(__dirname, "fileList.json");

// // 기존 목록 불러오기
// let fileList = [];
// if (fs.existsSync(DATA_FILE)) {
//   fileList = JSON.parse(fs.readFileSync(DATA_FILE));
// }

// // multer 저장 설정
// const storage = multer.diskStorage({
//   destination: path.join(__dirname, "uploads"),
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   }
// });
// const upload = multer({ storage });

// // 업로드 API
// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
//   }

//   const { title, name } = req.body;
//   const newFile = {
//     id: Date.now(),
//     title,
//     name,
//     url: `/uploads/${req.file.filename}`, // localhost 제거
//     createdAt: new Date().toLocaleString()
//   };

//   fileList.push(newFile);
//   fs.writeFileSync(DATA_FILE, JSON.stringify(fileList, null, 2));

//   res.json({ success: true });
// });

// // 목록 조회 API
// app.get("/files", (req, res) => {
//   res.json(fileList);
// });

// // SPA 라우팅 처리
// app.get("/{*path}", (req, res) => {
//   res.sendFile(path.join(__dirname, "dist", "index.html"));
// });

// // Render 포트 사용
// const PORT = process.env.PORT || 10000;
// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });

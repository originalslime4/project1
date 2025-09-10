import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { Console } from "console";
dotenv.config();
console.log("CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
console.log("REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.set("trust proxy", 1);
app.use(session({
  secret: "tmffkdlavmfhwprxm",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: true,
    sameSite: "None"
  }
}));
app.use(cors({
  origin: "https://project1-n922.onrender.com", // 또는 Render 배포 주소
  credentials: true
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, "dist")));

// 최상단
const client = new MongoClient(process.env.MONGO_URI);
let db;

async function startServer() {
  try {
    await client.connect();
    db = client.db("project1");
    console.log("✅ MongoDB 연결 성공");

    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB 연결 실패:", err);
  }
}

startServer();

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

app.get("/auth/check", async (req, res) => {
  if (!req.session.tokens) {
    return res.status(401).json({ loggedIn: false });
  }

  try {
    oauth2Client.setCredentials(req.session.tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();

    res.json({
      loggedIn: true,
      name: userInfo.data.name,
      email: userInfo.data.email,
      picture: userInfo.data.picture
    });
  } catch (err) {
    console.error("사용자 정보 가져오기 실패", err);
    res.status(500).json({ error: "서버 내부 오류", detail: err.message });
  }
});

// 인증 코드 처리
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  req.session.tokens = tokens;
  req.session.save(() => {
    console.log("세션 저장 완료:", req.session.tokens);
    res.redirect("https://project1-n922.onrender.com/jjal");
  });

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
  title,
  name,
  url: fileUrl,
  createdAt: new Date().toLocaleString()
};

await db.collection("files").insertOne(newFile);
res.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error("Drive 업로드 실패", err);
    res.status(500).json({ error: "업로드 실패" });
  } finally {
    fs.unlinkSync(filePath); // 임시 파일 삭제
  }
});

// 목록 조회 API
app.get("/files", async (req, res) => {
  const keyword = req.query.q || "";
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const query = keyword
    ? { title: { $regex: keyword, $options: "i" } }
    : {};
  const files = await db.collection("files")
    .find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  res.json(files);
});


// SPA 라우팅 처리
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

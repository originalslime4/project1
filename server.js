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
import MongoStore from "connect-mongo";
import { Console } from "console";
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 10000;
app.set("trust proxy", 1);
app.use(session({
  secret: "tmffkdlavmfhwprxm",
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: "project1",
    collectionName: "sessions"
  }),
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

app.use((req, res, next) => {
  // console.log("세션 객체:", req.session);
  next();
});

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
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/drive.file"
    ]

  });
  res.redirect(authUrl);
});
app.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: "로그아웃 실패" });
    }
    res.clearCookie("connect.sid"); // 세션 쿠키 제거
    res.json({ success: true });
  });
});
app.get("/userdata", async (req, res) => {
  try {
    const email = req.query.email;
    if (!email) {
      return res.status(400).json({ error: "이메일이 필요합니다." });
    }
    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }
    res.json({
      email: user.email,
      picture: user.picture,
      nickname: user.nickname,
      bio: user.bio,
      followers: user.followers
    });
  } catch (err) {
    console.error("사용자 정보 가져오기 실패:", err);
    res.status(500).json({ error: "서버 내부 오류", detail: err.message });
  }
});
app.get("/auth/check", async (req, res) => {
  // console.log("세션 토큰:", req.session.tokens);
  if (!req.session.tokens) {
    return res.status(401).json({ loggedIn: false });
  }
  try {
    oauth2Client.setCredentials(req.session.tokens);
    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const userInfo = await oauth2.userinfo.get();
    const { email, name, picture } = userInfo.data;
    const usersCollection = db.collection("users");
    let user = await usersCollection.findOne({ email });
    if (!user) {
      // 새 사용자 등록
      user = {
        email,
        picture,
        nickname: name,
        bio: "",
        createdAt: new Date(),
        followers: 0
      };
      await usersCollection.insertOne(user);
      console.log("✅ 새 사용자 등록:", email);
    } else {
      console.log("🔎 기존 사용자 불러오기:", email);
    }
    req.session.userEmail = email;
    res.json({
      loggedIn: true,
      email: user.email,
      picture: user.picture,
      nickname: user.nickname,
      bio: user.bio,
      followers: user.followers
    });
  } catch (err) {
    console.error("사용자 정보 가져오기 실패", err.response?.data || err);
    res.status(500).json({ error: "서버 내부 오류", detail: err.message });
  }
});
app.put("/user", async (req, res) => {
  const email = req.session.userEmail;
  const { nickname, bio, picture } = req.body;

  if (!email) return res.status(401).json({ error: "로그인 필요" });

  try {
    const result = await db.collection("users").updateOne(
      { email },
      { $set: { nickname, bio, picture } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ error: "사용자 없음" });
    }

    res.json({ success: true });
  } catch (err) {
    console.error("사용자 정보 수정 실패:", err);
    res.status(500).json({ error: "수정 실패" });
  }
});
app.post("/follow/:targetEmail", async (req, res) => {
  const follower = req.session.userEmail;
  const following = req.params.targetEmail;

  if (!follower) return res.status(401).json({ error: "로그인 필요" });
  if (follower === following) return res.status(400).json({ error: "자기 자신은 팔로우할 수 없음" });

  try {
    const exists = await db.collection("follows").findOne({ follower, following });
    if (exists) return res.status(400).json({ error: "이미 팔로우 중" });

    await db.collection("follows").insertOne({ follower, following, followedAt: new Date() });
    await db.collection("users").updateOne({ email: following }, { $inc: { followers: 1 } });

    res.json({ success: true });
  } catch (err) {
    console.error("팔로우 실패:", err);
    res.status(500).json({ error: "팔로우 실패" });
  }
});
app.delete("/follow/:targetEmail", async (req, res) => {
  const follower = req.session.userEmail;
  const following = req.params.targetEmail;

  if (!follower) return res.status(401).json({ error: "로그인 필요" });

  try {
    const result = await db.collection("follows").deleteOne({ follower, following });
    if (result.deletedCount === 0) return res.status(404).json({ error: "팔로우 관계 없음" });

    await db.collection("users").updateOne({ email: following }, { $inc: { followers: -1 } });

    res.json({ success: true });
  } catch (err) {
    console.error("언팔로우 실패:", err);
    res.status(500).json({ error: "언팔로우 실패" });
  }
});


app.get("/following", async (req, res) => {
  const email = req.session.userEmail;
  if (!email) return res.status(401).json({ error: "로그인 필요" });

  try {
    const follows = await db.collection("follows").find({ follower: email }).toArray();
    res.json(follows.map(f => f.following));
  } catch (err) {
    console.error("팔로잉 목록 조회 실패:", err);
    res.status(500).json({ error: "조회 실패" });
  }
});


// 인증 코드 처리
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  // console.log("받은 토큰:", tokens);
  oauth2Client.setCredentials(tokens);
  req.session.tokens = tokens;
  req.session.save(err => {
    if (err) {
      console.error("❌ 세션 저장 실패:", err);
      return res.status(500).send("세션 저장 실패");
    }
    console.log("✅ 세션 저장 완료:", req.session.tokens);
    res.redirect("/home");
  });
});

app.post("/upload-file-drive", upload.single("file"), async (req, res) => {
  if (!req.session.tokens) return res.status(401).json({ error: "로그인 필요" });

  oauth2Client.setCredentials(req.session.tokens);
  const drive = google.drive({ version: "v3", auth: oauth2Client });

  const filePath = req.file.path;

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
    res.json({ success: true, url: fileUrl });
  } catch (err) {
    console.error("Drive 업로드 실패", err);
    res.status(500).json({ error: "업로드 실패" });
  } finally {
    fs.unlinkSync(filePath); // 임시 파일 삭제
  }
});
app.get("/limittime", async (req, res) => {
  const { path, email, min } = req.query;
  if (!path || !email || !min) {
    return res.status(400).json({ error: "필수 파라미터 누락" });
  }
  try {
    const recent = await db.collection(path)
      .find({ email })
      .sort({ createdAt: -1 })
      .limit(1)
      .toArray();
    if (recent.length > 0) {
      const lastCreated = new Date(recent[0].createdAt);
      const now = new Date();
      const diffMinutes = (now - lastCreated) / (1000 * 60);
      if (diffMinutes < parseInt(min)) {
        return res.json({ allowed: false, remaining: Math.ceil(min - diffMinutes) });
      }
    }
    return res.json({ allowed: true });
  } catch (err) {
    console.error("시간 제한 확인 실패:", err);
    return res.status(500).json({ error: "서버 오류" });
  }
});

app.post("/upload-jjal", async (req, res) => {
  const { title, email, url } = req.body;
  if (!title || !email || !url) {
    return res.status(400).json({ error: "필수 정보 누락" });
  }
  try {
    const newFile = {
      title,
      email,
      url,
      like: 0,
      hate: 0,
      createdAt: new Date() // 날짜 객체로 저장
    };
    await db.collection("jjal").insertOne(newFile);
    res.json({ success: true });
  } catch (err) {
    console.error("DB 저장 실패", err);
    res.status(500).json({ error: "DB 저장 실패" });
  }
});
app.post("/jjallike", async (req, res) => {
  const email = req.session.userEmail;
  const { id, islike, mod } = req.body;
  if (!email) return res.status(401).json({ error: "로그인 필요" });
  const jjalId = new MongoClient.ObjectId(id);
  const likesCollection = db.collection("likes");
  const jjalsCollection = db.collection("jjal");
  try {
    const existing = await likesCollection.findOne({ jjalId, email });
    if (mod) {
      return res.json({
        liked: existing?.type === "like" || false,
        disliked: existing?.type === "hate" || false
      });
    }
    if (existing?.type === (islike ? "like" : "hate")) {
      await likesCollection.deleteOne({ _id: existing._id });
      await jjalsCollection.updateOne(
        { _id: jjalId },
        { $inc: { [islike ? "like" : "hate"]: -1 } }
      );
      return res.json({ success: true, action: "cancel" });
    }
    if (existing) {
      await likesCollection.updateOne(
        { _id: existing._id },
        { $set: { type: islike ? "like" : "hate" } }
      );
      await jjalsCollection.updateOne(
        { _id: jjalId },
        {
          $inc: {
            [islike ? "like" : "hate"]: 1,
            [islike ? "hate" : "like"]: -1
          }
        }
      );
      return res.json({ success: true, action: "switch" });
    }
    await likesCollection.insertOne({
      jjalId,
      email,
      type: islike ? "like" : "hate",
      createdAt: new Date()
    });
    await jjalsCollection.updateOne(
      { _id: jjalId },
      { $inc: { [islike ? "like" : "hate"]: 1 } }
    );
    return res.json({ success: true, action: "new" });
  } catch (err) {
    console.error("추천/비추천 처리 실패:", err);
    res.status(500).json({ error: "서버 오류" });
  }
});
// 목록 조회 API
app.get("/jjals", async (req, res) => {
  const keyword = req.query.q || "";
  const page = parseInt(req.query.page) || 1;
  const pageSize = 10;
  const query = keyword
    ? { title: { $regex: keyword, $options: "i" } }
    : {};
  const totalCount = await db.collection("jjal").countDocuments(query);
  const totalPages = Math.ceil(totalCount / pageSize);
  const files = await db.collection("jjal")
    .find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();
  res.json({
    files,
    totalPages,
  });
});

app.use(express.static(path.join(__dirname, "dist")));
// SPA 라우팅 처리
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

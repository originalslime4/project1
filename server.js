import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import session from "express-session";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import dotenv from "dotenv";
import { Console, debug } from "console";
import vision from "@google-cloud/vision";
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
  cookie: {
    secure: true,
    sameSite: "None"
  }
}));
app.use(cors({
  origin: "https://kmslime.kr", // 또는 Render 배포 주소
  credentials: true
}));
app.use(express.json());
app.use((req, res, next) => {
  console.log("세션 객체:", req.session);
  next();
});
async function startServer() {
  try {
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ 연결 실패:", err);
  }
}
startServer();
const upload = multer({ dest: "temp/" });
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);
async function saveFileToDrive(filePath, fileId) {
  const drive = google.drive({ version: "v3", auth: oauth2Client });
  const media = {
    mimeType: "application/json",
    body: fs.createReadStream(filePath)
  };
  const res = await drive.files.update({
    fileId: fileId,
    media: media
  });
  console.log("✅ Google Drive 저장 완료:", res.data.id);
}
//파일들
oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});
await oauth2Client.getAccessToken();
const drive = google.drive({ version: "v3", auth: oauth2Client });
async function downloadFile(fileId, destPath) {
  const dest = fs.createWriteStream(destPath);
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );
  return new Promise((resolve, reject) => {
    res.data
      .on("end", () => {
        console.log("✅ 다운로드 완료:", destPath);
        resolve();
      })
      .on("error", (err) => {
        console.error("❌ 다운로드 실패:", err);
        reject(err);
      })
      .pipe(dest);
  });
}
await downloadFile("1VnMzqbM6LYMTeBFzlTUUUT8WwZ_UcKeo", path.join(__dirname, "jjal.js"));
await downloadFile("1doHeqgBaHQhRIeAFn6KJkarR2EGFyDSB", path.join(__dirname, "user.js"));
await downloadFile("1oixWdPJTjn8ngSfK5FDzA-ZtmGD9guNK", path.join(__dirname, "follow.js"));
await downloadFile("1EO2faPd7A_bmPIPk8fiOJQCFMIst5HKB", path.join(__dirname, "like.js"));

// // const res = await axios.post("http://localhost:10000/analyze-image", {
//   url: "https://example.com/test.jpg"
// });
// console.log(res.data);

app.post("/analyze-image", async (req, res) => {
  try {
    const { url } = req.body;

    // SafeSearch (유해 이미지 감지)
    const [safeResult] = await visclient.safeSearchDetection(url);
    const safe = safeResult.safeSearchAnnotation;
    // 라벨 태깅
    const [labelResult] = await visclient.labelDetection(url);
    const labels = labelResult.labelAnnotations.map(l => l.description);

    res.json({ safe, labels });
  } catch (err) {
    if (err.code === 429) { // Quota 초과
      return res.status(429).json({
        error: "월간 한도를 소진했으니 이번달엔 게시가 불가합니다"
      });
    }
    throw err;
  }
});
app.get("/login", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/drive"
    ]
//drive.file
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
    const userPath = path.join(__dirname, "user.js");
    const usersCollection = JSON.parse(fs.readFileSync(userPath, "utf-8"));
    const user = usersCollection.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ error: "사용자를 찾을 수 없습니다." });
    }
    res.json({
      email: user.email,
      picture: user.picture,
      nickname: user.nickname,
      bio: user.bio,
      followers: user.followers,
      create: user.createdAt,
      config: user.config
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
    const userPath = path.join(__dirname, "user.js");
    const usersCollection = JSON.parse(fs.readFileSync(userPath, "utf-8"));
    const user = usersCollection.find(u => u.email === email);
    if (!user) {
      // 새 사용자 등록
      user = {
        email,
        picture,
        nickname: name,
        bio: "",
        createdAt: new Date(),
        followers: 0,
        config: {}
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
      followers: user.followers,
      create: user.createdAt,
      config: user.config
    });
  } catch (err) {
    console.error("사용자 정보 가져오기 실패", err.response?.data || err);
    res.status(500).json({ error: "서버 내부 오류", detail: err.message });
  }
});
app.put("/user", async (req, res) => {
  const email = req.session.userEmail;
  const { nickname, bio, picture, config } = req.body;

  if (!email) return res.status(401).json({ error: "로그인 필요" });

  try {
    const userPath = path.join(__dirname, "user.js");
    const users = JSON.parse(fs.readFileSync(userPath, "utf-8"));
    const userIndex = users.findIndex(u => u.email === email);
    if (userIndex === -1) {
      return res.status(404).json({ error: "사용자 없음" });
    }
    users[userIndex] = {
      ...users[userIndex],
      nickname,
      bio,
      picture,
      config
    };
    fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
    await saveFileToDrive(userPath, "1doHeqgBaHQhRIeAFn6KJkarR2EGFyDSB");
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
    const followPath = path.join(__dirname, "follow.js");
    const follows = JSON.parse(fs.readFileSync(followPath, "utf-8"));
    const exists = follows.find(f => f.follower === follower && f.following === following);
    if (exists) return res.status(400).json({ error: "이미 팔로우 중" });
    follows.push({ follower, following, followedAt: new Date() });
    fs.writeFileSync(followPath, JSON.stringify(follows, null, 2));
    await saveFileToDrive(followPath, "1oixWdPJTjn8ngSfK5FDzA-ZtmGD9guNK");
    const userPath = path.join(__dirname, "user.js");
    const users = JSON.parse(fs.readFileSync(userPath, "utf-8"));
    const idx = users.findIndex(u => u.email === following);
    if (idx !== -1) {
      users[idx].followers = (users[idx].followers || 0) + 1;
      fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
      await saveFileToDrive(userPath, "1doHeqgBaHQhRIeAFn6KJkarR2EGFyDSB");
    }
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
    const followPath = path.join(__dirname, "follow.js");
    let follows = JSON.parse(fs.readFileSync(followPath, "utf-8"));
    const beforeCount = follows.length;
    follows = follows.filter(f => !(f.follower === follower && f.following === following));
    if (follows.length === beforeCount) {
      return res.status(404).json({ error: "팔로우 관계 없음" });
    }
    fs.writeFileSync(followPath, JSON.stringify(follows, null, 2));
    await saveFileToDrive(followPath, "1oixWdPJTjn8ngSfK5FDzA-ZtmGD9guNK");
    const userPath = path.join(__dirname, "user.js");
    const users = JSON.parse(fs.readFileSync(userPath, "utf-8"));
    const idx = users.findIndex(u => u.email === following);
    if (idx !== -1) {
      users[idx].followers = Math.max((users[idx].followers || 0) - 1, 0);
      fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
      await saveFileToDrive(userPath, "1doHeqgBaHQhRIeAFn6KJkarR2EGFyDSB");
    }
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
    const followPath = path.join(__dirname, "follow.js");
    const follows = JSON.parse(fs.readFileSync(followPath, "utf-8"));
    const followingList = follows
      .filter(f => f.follower === email)
      .map(f => f.following);
    res.json(followingList);
  } catch (err) {
    console.error("팔로잉 목록 조회 실패:", err);
    res.status(500).json({ error: "조회 실패" });
  }
});

// 인증 코드 처리
app.get("/oauth2callback", async (req, res) => {
  const code = req.query.code;
  const { tokens } = await oauth2Client.getToken(code);
  console.log("받은 토큰:", tokens);
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
app.get("/jjaltime", async (req, res) => {
  const { email, min } = req.query;
  if (!email || !min) {
    return res.status(400).json({ error: "필수 파라미터 누락" });
  }
  try {
    const jjalPath = path.join(__dirname, "jjal.js");
    const jjals = JSON.parse(fs.readFileSync(jjalPath, "utf-8"));
    const recent = jjals
      .filter(j => j.email === email)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    if (recent) {
      const lastCreated = new Date(recent.createdAt);
      const now = new Date();
      const diffMinutes = (now - lastCreated) / (1000 * 60);
      if (diffMinutes < parseInt(min)) {
        return res.json({
          allowed: false,
          remaining: Math.ceil(min - diffMinutes)
        });
      }
    }
    return res.json({ allowed: true });
  } catch (err) {
    console.error("시간 제한 확인 실패:", err);
    return res.status(500).json({ error: "서버 오류" });
  }
});

app.post("/upload-jjal", async (req, res) => {
  const { title, email, url, tags } = req.body;
  if (!title || !email || !url) {
    return res.status(400).json({ error: "필수 정보 누락" });
  }
  try {
    const newFile = {
      _id: uuidv4(),
      title,
      email,
      url,
      like: 0,
      hate: 0,
      tags: tags || [],
      createdAt: new Date() // 날짜 객체로 저장
    };
    const jjalPath = path.join(__dirname, "jjal.js");
const jjalData = JSON.parse(fs.readFileSync(jjalPath, "utf-8"));
    jjalData.push(newFile);
    fs.writeFileSync(jjalPath, JSON.stringify(jjalData, null, 2));
    await saveFileToDrive(path.join(__dirname, "jjal.js"), "1VnMzqbM6LYMTeBFzlTUUUT8WwZ_UcKeo");
    res.json({ success: true });
  } catch (err) {
    console.error("저장 실패", err);
    res.status(500).json({ error: "저장 실패" });
  }
});

app.post("/jjallike", async (req, res) => {
  const email = req.session.userEmail;
  const { id, islike, mod } = req.body;
  if (!email) return res.status(401).json({ error: "로그인 필요" });
  try {
    const likePath = path.join(__dirname, "like.js");
    const jjalPath = path.join(__dirname, "jjal.js");
    let likes = JSON.parse(fs.readFileSync(likePath, "utf-8"));
    let jjals = JSON.parse(fs.readFileSync(jjalPath, "utf-8"));
    const jjalIndex = jjals.findIndex(j => j._id === id);
    if (jjalIndex === -1) return res.status(404).json({ error: "짤 없음" });
    const existingIndex = likes.findIndex(l => l.jjalId === id && l.email === email);
    const existing = existingIndex !== -1 ? likes[existingIndex] : null;
    if (mod) {
      return res.json({
        like: existing?.type === "like" || false,
        hate: existing?.type === "hate" || false
      });
    }
    if (existing?.type === (islike ? "like" : "hate")) {
      likes.splice(existingIndex, 1);
      jjals[jjalIndex][islike ? "like" : "hate"] =
        (jjals[jjalIndex][islike ? "like" : "hate"] || 0) - 1;
      fs.writeFileSync(likePath, JSON.stringify(likes, null, 2));
      fs.writeFileSync(jjalPath, JSON.stringify(jjals, null, 2));
      await saveFileToDrive(likePath, "1EO2faPd7A_bmPIPk8fiOJQCFMIst5HKB");
      await saveFileToDrive(jjalPath, "1VnMzqbM6LYMTeBFzlTUUUT8WwZ_UcKeo");
      return res.json({ success: true, action: "cancel" });
    }
    if (existing) {
      likes[existingIndex].type = islike ? "like" : "hate";
      jjals[jjalIndex][islike ? "like" : "hate"] =
        (jjals[jjalIndex][islike ? "like" : "hate"] || 0) + 1;
      jjals[jjalIndex][islike ? "hate" : "like"] =
        (jjals[jjalIndex][islike ? "hate" : "like"] || 0) - 1;
      fs.writeFileSync(likePath, JSON.stringify(likes, null, 2));
      fs.writeFileSync(jjalPath, JSON.stringify(jjals, null, 2));
      await saveFileToDrive(likePath, "1EO2faPd7A_bmPIPk8fiOJQCFMIst5HKB");
      await saveFileToDrive(jjalPath, "1VnMzqbM6LYMTeBFzlTUUUT8WwZ_UcKeo");
      return res.json({ success: true, action: "switch" });
    }
    likes.push({
      jjalId: id,
      email,
      type: islike ? "like" : "hate",
      createdAt: new Date()
    });
    jjals[jjalIndex][islike ? "like" : "hate"] =
      (jjals[jjalIndex][islike ? "like" : "hate"] || 0) + 1;
    fs.writeFileSync(likePath, JSON.stringify(likes, null, 2));
    fs.writeFileSync(jjalPath, JSON.stringify(jjals, null, 2));
    await saveFileToDrive(likePath, "1EO2faPd7A_bmPIPk8fiOJQCFMIst5HKB");
    await saveFileToDrive(jjalPath, "1VnMzqbM6LYMTeBFzlTUUUT8WwZ_UcKeo");
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
  const safeLevel = parseInt(req.query.safe) || 0;
  try {
    const jjalPath = path.join(__dirname, "jjal.js");
    const jjalData = JSON.parse(fs.readFileSync(jjalPath, "utf-8"));
    let filtered = jjalData;
    if (keyword) {
      const regex = new RegExp(keyword, "i");
      filtered = filtered.filter(
        f => regex.test(f.title) || f.tags.some(tag => regex.test(tag))
      );
    }
    if (safeLevel === -1) {
      filtered = filtered.filter(f => f.tags.includes("기본"));
    } else if (safeLevel === 0) {
      filtered = filtered.filter(f => !f.tags.includes("폭력적") && !f.tags.includes("선정적"));
    } else if (safeLevel === 1) {
      filtered = filtered.filter(f => f.tags.every(tag => tag !== "선정적"));
    } else if (safeLevel === 2) {
      // 모든 데이터 허용
    }
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const totalCount = filtered.length;
    const totalPages = Math.ceil(totalCount / pageSize);
    const files = filtered.slice((page - 1) * pageSize, page * pageSize);
    res.json({ files, totalPages });
  } catch (err) {
    console.error("❌ 목록 조회 실패:", err);
    res.status(500).json({ error: "목록 조회 실패" });
  }
});

app.use(express.static(path.join(__dirname, "dist")));
// SPA 라우팅 처리
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

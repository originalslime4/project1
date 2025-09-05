import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// 정적 파일 제공
app.use(express.static(path.join(__dirname, "dist")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const DATA_FILE = path.join(__dirname, "fileList.json");

// 기존 목록 불러오기
let fileList = [];
if (fs.existsSync(DATA_FILE)) {
  fileList = JSON.parse(fs.readFileSync(DATA_FILE));
}

// multer 저장 설정
const storage = multer.diskStorage({
  destination: path.join(__dirname, "uploads"),
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

// 업로드 API
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "파일이 업로드되지 않았습니다." });
  }

  const { title, name } = req.body;
  const newFile = {
    id: Date.now(),
    title,
    name,
    url: `/uploads/${req.file.filename}`, // localhost 제거
    createdAt: new Date().toLocaleString()
  };

  fileList.push(newFile);
  fs.writeFileSync(DATA_FILE, JSON.stringify(fileList, null, 2));

  res.json({ success: true });
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});

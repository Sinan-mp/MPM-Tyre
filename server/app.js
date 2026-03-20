import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

const app = express();
const port = process.env.PORT || 4000;

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Connected to MongoDB Atlas");
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
    });
} else {
  console.warn("MONGO_URI is missing. Add your MongoDB Atlas connection string in .env.");
}

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    message: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);

app.use(cors());
app.use(express.json());
app.use(express.static(rootDir));

app.get("/api/reviews", async function (_req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503).json({ message: "Database is not connected yet." });
      return;
    }
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Could not load reviews." });
  }
});

app.post("/api/reviews", async function (req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      res.status(503).json({ message: "Database is not connected yet." });
      return;
    }

    const name = (req.body.name || "").trim();
    const rating = Number(req.body.rating);
    const message = (req.body.message || "").trim();

    if (!name || !rating || !message) {
      res.status(400).json({ message: "Name, rating, and review are required." });
      return;
    }

    const review = await Review.create({
      name,
      rating,
      message
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message || "Could not save review." });
  }
});

app.get("*", function (_req, res) {
  res.sendFile(path.join(rootDir, "index.html"));
});

app.listen(port, function () {
  console.log(`Server running at http://localhost:${port}`);
});

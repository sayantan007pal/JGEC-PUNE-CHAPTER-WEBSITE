import mongoose, { Schema, Document, Model } from "mongoose";

export type BlogStatus = "draft" | "pending_review" | "published" | "rejected";

export interface IBlog extends Document {
  // Author info
  authorId: mongoose.Types.ObjectId | null;

  // Content
  title: string;
  slug: string;
  content: object; // Tiptap JSON
  excerpt: string;
  tags: string[];

  // Featured image
  featuredImageUrl?: string;
  featuredImagePublicId?: string;

  // Embedded images (for cleanup)
  contentImagePublicIds: string[];

  // Status
  status: BlogStatus;
  isBestOfMonth: boolean;
  monthYear?: string; // Format: "2026-05"

  // Review info
  reviewNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  publishedAt?: Date;
  submittedAt?: Date;

  // Optimistic locking
  version: number;

  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null, // Allow null for deleted authors
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    content: {
      type: Schema.Types.Mixed,
      required: [true, "Content is required"],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [300, "Excerpt cannot exceed 300 characters"],
      default: "",
    },
    tags: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 5;
        },
        message: "Cannot have more than 5 tags",
      },
      default: [],
    },
    featuredImageUrl: {
      type: String,
      trim: true,
    },
    featuredImagePublicId: {
      type: String,
      trim: true,
    },
    contentImagePublicIds: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["draft", "pending_review", "published", "rejected"],
      default: "draft",
      required: true,
      index: true,
    },
    isBestOfMonth: {
      type: Boolean,
      default: false,
      index: true,
    },
    monthYear: {
      type: String,
      trim: true,
      match: [/^\d{4}-\d{2}$/, "monthYear must be in YYYY-MM format"],
    },
    reviewNotes: {
      type: String,
      trim: true,
      maxlength: [1000, "Review notes cannot exceed 1000 characters"],
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    publishedAt: {
      type: Date,
    },
    submittedAt: {
      type: Date,
    },
    version: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);

// Compound indexes for common queries
blogSchema.index({ status: 1, publishedAt: -1 }); // Public listing
blogSchema.index({ authorId: 1, status: 1 }); // My blogs
blogSchema.index({ isBestOfMonth: 1, monthYear: 1 }); // Best of month queries
blogSchema.index({ tags: 1 }); // Tag filtering
blogSchema.index({ title: "text" }); // Text search

// Pre-save hook to ensure tags are cleaned
blogSchema.pre("save", function (next) {
  if (this.tags) {
    this.tags = this.tags
      .map((tag) => tag.trim().toLowerCase().slice(0, 30))
      .filter((tag) => tag.length > 0)
      .slice(0, 5);
  }
  next();
});

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>("Blog", blogSchema);

export default Blog;

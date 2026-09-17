// Mongoose Models cho Community — Dev 1 sở hữu
// Bao gồm: ForumPost (forum_posts) + ForumComment (forum_comments)
import { Schema, model, Document, Types } from 'mongoose';

// ─── ForumPost ────────────────────────────────────────────────────────────────
export interface IForumPost extends Document {
  authorId: Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  likedBy: Types.ObjectId[];
  likesCount: number;
  commentsCount: number;
  isHidden: boolean;
  reportsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ForumPostSchema = new Schema<IForumPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    tags: {
      type: [String],
      default: [],
    },
    likedBy: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    likesCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isHidden: {
      type: Boolean,
      default: false,
    },
    reportsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

// Text index để hỗ trợ tìm kiếm sau này
ForumPostSchema.index({ title: 'text', content: 'text' });
ForumPostSchema.index({ createdAt: -1 });

export const ForumPost = model<IForumPost>('ForumPost', ForumPostSchema);

// ─── ForumComment ─────────────────────────────────────────────────────────────
export interface IForumComment extends Document {
  postId: Types.ObjectId;
  authorId: Types.ObjectId;
  commentText: string;
  createdAt: Date;
  updatedAt: Date;
}

const ForumCommentSchema = new Schema<IForumComment>(
  {
    postId: {
      type: Schema.Types.ObjectId,
      ref: 'ForumPost',
      required: true,
      index: true,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    commentText: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

export const ForumComment = model<IForumComment>('ForumComment', ForumCommentSchema);

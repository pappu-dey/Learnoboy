/**
 * Central model registration file.
 * Import this instead of individual models to ensure ALL models are registered
 * before any Mongoose populate() calls run.
 */
import Article from "./Article";
import Author from "./Author";
import Category from "./Category";
import Tag from "./Tag";
import User from "./User";
import Feedback from "./Feedback";
import Donor from "./Donor";
import Comment from "./Comment";

// Re-export for convenience
export { Article, Author, Category, Tag, User, Feedback, Donor, Comment };



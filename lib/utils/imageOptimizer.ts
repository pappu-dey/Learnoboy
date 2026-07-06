import sharp from "sharp";
import path from "path";
import fs from "fs/promises";

export interface OptimizedImageResult {
  originalFilename: string;
  optimizedFilename: string;
  filePath: string; // e.g. "/uploads/article-123"
  width: number;
  height: number;
  mimeType: string;
  fileSize: number;
  blurPlaceholder: string;
  responsiveSizes: number[];
}

const RESPONSIVE_WIDTHS = [320, 640, 768, 1024, 1280, 1600];

/**
 * Optimizes an uploaded image buffer:
 * 1. Strips EXIF metadata.
 * 2. Normalizes color profile to sRGB.
 * 3. Restricts maximum width/height to 4000px.
 * 4. Converts to WebP with visually lossless compression (82 quality).
 * 5. Generates multiple responsive widths (320px, 640px, 768px, 1024px, 1280px, 1600px).
 * 6. Generates a base64 inline blur placeholder for next/image blurDataURL.
 * 
 * @param buffer - The raw upload image buffer.
 * @param originalName - The original filename uploaded by the user.
 * @param targetDirectory - Folder directory path relative to 'public' (e.g. "uploads/article-123").
 * @param customBaseName - Optional prefix naming to override original filename on disk.
 */
export async function optimizeImage(
  buffer: Buffer,
  originalName: string,
  targetDirectory: string,
  customBaseName?: string
): Promise<OptimizedImageResult> {
  // Ensure the target directory exists inside Next.js public directory
  const publicDir = path.join(process.cwd(), "public");
  const fullTargetDir = path.join(publicDir, targetDirectory);
  await fs.mkdir(fullTargetDir, { recursive: true });

  // Probe original metadata
  const initialSharp = sharp(buffer);
  const metadata = await initialSharp.metadata();

  const isAnimated = !!(metadata.pages && metadata.pages > 1);

  // Auto-rotate utilizing EXIF orientation and strip other metadata automatically
  let pipeline = sharp(buffer, { animated: isAnimated })
    .rotate();

  let width = metadata.width || 0;
  let height = metadata.height || 0;

  // Limit extremely large uploads to 4000px bounding box
  if (width > 4000 || height > 4000) {
    pipeline = pipeline.resize(4000, 4000, {
      fit: "inside",
      withoutEnlargement: true,
    });
    // Realize limits by fetching metadata of resized result
    const resizedInfo = await pipeline.toBuffer({ resolveWithObject: true });
    width = resizedInfo.info.width;
    height = resizedInfo.info.height;
    pipeline = sharp(resizedInfo.data, { animated: isAnimated });
  }

  // Create clean URL-safe naming structure
  const cleanBaseName = customBaseName
    ? customBaseName.toLowerCase().replace(/[^a-z0-9_-]/g, "")
    : path.parse(originalName).name.toLowerCase().replace(/[^a-z0-9_-]/g, "") || "image";
  const uniqueId = Math.random().toString(36).substring(2, 9);
  const optimizedBaseName = `${cleanBaseName}-${uniqueId}`;

  // 1. Output original optimized WebP
  const originalFileName = `${optimizedBaseName}-original.webp`;
  const originalFilePath = path.join(fullTargetDir, originalFileName);

  const originalWebp = pipeline.clone().webp({ quality: 82, effort: 5 });
  const originalResult = await originalWebp.toFile(originalFilePath);
  const finalOriginalSize = originalResult.size;

  // 2. Output responsive sizes (skip widths larger than original width)
  const savedSizes: number[] = [];
  for (const targetWidth of RESPONSIVE_WIDTHS) {
    if (targetWidth < width) {
      const fileName = `${optimizedBaseName}-${targetWidth}.webp`;
      const filePath = path.join(fullTargetDir, fileName);

      await pipeline
        .clone()
        .resize(targetWidth, null, { withoutEnlargement: true })
        .webp({ quality: 80, effort: 5 })
        .toFile(filePath);

      savedSizes.push(targetWidth);
    }
  }

  // 3. Generate tiny WebP placeholder (12x12) converted to Base64
  const blurBuffer = await sharp(buffer)
    .resize(12, 12, { fit: "inside" })
    .webp({ quality: 20 })
    .toBuffer();
  const blurPlaceholder = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  return {
    originalFilename: originalName,
    optimizedFilename: originalFileName,
    filePath: `/${targetDirectory.replace(/\\/g, "/")}`, // Normalized URL path
    width,
    height,
    mimeType: "image/webp",
    fileSize: finalOriginalSize,
    blurPlaceholder,
    responsiveSizes: savedSizes,
  };
}

export interface OptimizedBufferResult {
  buffer: Buffer;
  width: number;
  height: number;
  blurPlaceholder: string;
}

/**
 * Optimizes an image buffer in-memory to WebP format.
 * Returns the optimized buffer, dimensions, and inline base64 blur placeholder.
 */
export async function optimizeImageBuffer(
  buffer: Buffer,
  options: { width?: number; height?: number; fit?: "cover" | "inside"; quality?: number } = {}
): Promise<OptimizedBufferResult> {
  const metadata = await sharp(buffer).metadata();
  const isAnimated = !!(metadata.pages && metadata.pages > 1);

  let pipeline = sharp(buffer, { animated: isAnimated }).rotate();

  let targetWidth = metadata.width || 0;
  let targetHeight = metadata.height || 0;

  if (options.width && options.height) {
    pipeline = pipeline.resize(options.width, options.height, { fit: options.fit || "cover" });
    targetWidth = options.width;
    targetHeight = options.height;
  } else {
    // Limit extremely large uploads to 4000px bounding box
    if (targetWidth > 4000 || targetHeight > 4000) {
      pipeline = pipeline.resize(4000, 4000, {
        fit: "inside",
        withoutEnlargement: true,
      });
      const resizedInfo = await pipeline.toBuffer({ resolveWithObject: true });
      targetWidth = resizedInfo.info.width;
      targetHeight = resizedInfo.info.height;
      pipeline = sharp(resizedInfo.data, { animated: isAnimated });
    }
  }

  // Convert to WebP
  const optimizedBuffer = await pipeline
    .webp({ quality: options.quality || 82, effort: 5 })
    .toBuffer();

  // Generate blur placeholder
  const blurBuffer = await sharp(buffer)
    .resize(12, 12, { fit: "inside" })
    .webp({ quality: 20 })
    .toBuffer();
  const blurPlaceholder = `data:image/webp;base64,${blurBuffer.toString("base64")}`;

  return {
    buffer: optimizedBuffer,
    width: targetWidth,
    height: targetHeight,
    blurPlaceholder,
  };
}

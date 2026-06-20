import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { FileKind } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (!bytes || bytes <= 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(k)),
    sizes.length - 1
  );
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "svg", "heic"];
const DOC_EXT = ["doc", "docx", "txt", "rtf", "odt", "pages"];

export function fileKindFromName(name: string, mime?: string): FileKind {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (mime?.startsWith("image/") || IMAGE_EXT.includes(ext)) return "image";
  if (ext === "pdf" || mime === "application/pdf") return "pdf";
  if (DOC_EXT.includes(ext) || mime?.includes("word")) return "doc";
  return "other";
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

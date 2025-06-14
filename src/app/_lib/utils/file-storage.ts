"use server";

import { writeFile } from "fs/promises";
import path from "path";
import { customAlphabet } from "nanoid";

// Direktori untuk menyimpan gambar yang diunggah
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

// Pastikan direktori uploads ada
import { mkdir } from "fs/promises";

// Fungsi untuk memastikan direktori uploads ada
async function ensureUploadDir() {
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    console.error("Error creating upload directory:", error);
  }
}

// Fungsi untuk menyimpan file gambar
export async function saveImageFile(file: File): Promise<string | null> {
  if (!file || file.size === 0) {
    return null;
  }

  try {
    // Pastikan direktori uploads ada
    await ensureUploadDir();

    // Generate nama file unik
    const nanoId = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", 10);
    const fileExtension = file.name.split(".").pop() || "jpg";
    const fileName = `${nanoId()}.${fileExtension}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // Konversi File ke ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Simpan file ke disk
    await writeFile(filePath, buffer);

    // Kembalikan URL relatif untuk akses publik
    return `/uploads/${fileName}`;
  } catch (error) {
    console.error("Error saving image file:", error);
    return null;
  }
}
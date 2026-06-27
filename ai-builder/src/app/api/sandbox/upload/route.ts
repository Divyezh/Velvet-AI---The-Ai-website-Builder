import { NextRequest, NextResponse } from "next/server";
import { scanUploadedFiles, type UploadedFile } from "@/lib/velvet-agent";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    // Max 10 files, 2MB each
    const MAX_FILES = 10;
    const MAX_SIZE = 2 * 1024 * 1024;

    if (files.length > MAX_FILES) {
      return NextResponse.json({ error: `Max ${MAX_FILES} files allowed` }, { status: 400 });
    }

    const uploadedFiles: UploadedFile[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (file.size > MAX_SIZE) {
        errors.push(`${file.name}: too large (max 2MB)`);
        continue;
      }

      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      const textExtensions = ["tsx", "ts", "jsx", "js", "css", "html", "json", "md", "txt", "env", "yaml", "yml", "toml", "prisma", "graphql", "sql"];

      if (!textExtensions.includes(ext)) {
        // For non-text files, store metadata only
        uploadedFiles.push({
          name: file.name,
          content: `[Binary file: ${file.name}, size: ${file.size} bytes]`,
          type: ext,
          size: file.size,
        });
        continue;
      }

      const content = await file.text();
      uploadedFiles.push({
        name: file.name,
        content,
        type: ext,
        size: file.size,
      });
    }

    // Run AI analysis on the files
    const analysis = uploadedFiles.length > 0
      ? await scanUploadedFiles(uploadedFiles)
      : null;

    return NextResponse.json({
      success: true,
      files: uploadedFiles.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size,
        preview: f.content.slice(0, 200), // first 200 chars for UI display
      })),
      analysis,
      errors,
    });

  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

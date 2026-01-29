// utils/uploadVideoInChunksRTK.ts
export async function uploadVideoInChunksRTK({
  file,
  uploadChunk,
  finalizeUpload,
  onProgress,
}: {
  file: File;
  uploadChunk: any;
  finalizeUpload: any;
  onProgress?: (percent: number) => void;
}) {
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
  const uploadId = crypto.randomUUID();
  const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * CHUNK_SIZE;
    const end = Math.min(file.size, start + CHUNK_SIZE);
    const chunk = file.slice(start, end);

    await uploadChunk({
      uploadId,
      chunkIndex: i,
      chunk,
    }).unwrap();

    const percent = Math.round(((i + 1) / totalChunks) * 100);
    onProgress?.(percent);

    await new Promise(requestAnimationFrame);
  }

  const ext = file.name.split(".").pop();
  const fileName = `${uploadId}.${ext}`;

  const res = await finalizeUpload({
    uploadId,
    fileName,
  }).unwrap();

  return res.data.videoUrl as string;
}
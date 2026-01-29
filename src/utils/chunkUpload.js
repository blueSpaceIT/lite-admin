// Utility to upload video in chunks
export async function uploadVideoInChunksRTK({ file, title, uploadChunk, finalizeUpload, onProgress }) {
    const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB per chunk
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
        onProgress(percent);

        // allow React to repaint
        await new Promise(requestAnimationFrame);
    }

    const ext = file.name.split(".").pop();

    // Finalize upload (backend will handle createdBy)
    const res = await finalizeUpload({
        uploadId,
        totalChunks,
        title,
        ext,
    }).unwrap();

    return res.data._id; 
}

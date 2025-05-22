export interface VideoUpload {
  key: string
  uploadId: string
  parts: { ETag: string; PartNumber: number }[]
}

export interface VideoUploadChunk {
  bucket: string
  key: string
  uploadId: string
  partNumber: string
  body: Buffer
}

export interface VideoUploadCompleteRequest {
  key: string
  uploadId: string
  parts: { ETag: string; PartNumber: number }[]
}

export interface VideoUploadCompleteResponse {
  uploadId: string
}

export interface VideoUploadInit {
  key: string
  bucket: string
}

export interface VideoUploadInitResponse {
  uploadId: string
}

export interface VideoUploadChunkResponse {
  ETag: string
  PartNumber: string
}

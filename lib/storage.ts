import { Storage as GoogleCloudStorage } from '@google-cloud/storage';
import path from 'path';
import { v4 as uuid } from 'uuid';

import { getGCPCredentials } from '~/lib/credentials';
import { env } from '~/lib/env.mjs';

class Storage {
  private storage: GoogleCloudStorage;
  public bucketName: string;

  constructor({ bucketName }: { bucketName: string }) {
    this.storage = new GoogleCloudStorage(getGCPCredentials());
    this.bucketName = bucketName;
  }

  async store(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const bucket = this.storage.bucket(this.bucketName);
      const fileExtension = path.extname(file.name);
      const fileId = uuid() + fileExtension;
      const stream = bucket.file(fileId).createWriteStream();

      file.arrayBuffer().then((arrayBuffer) => {
        const buffer = new Uint8Array(arrayBuffer);
        stream.on('error', (error: Error) => reject(error));
        stream.on('finish', () => resolve(fileId));
        stream.end(buffer);
      });
    });
  }

  getPublicUrl(fileId: string) {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileId);
    return file.publicUrl();
  }

  async delete(fileId?: string) {
    const bucket = this.storage.bucket(this.bucketName);
    const file = bucket.file(fileId || '__DOES_NOT_EXIST__');
    file.delete({ ignoreNotFound: true });
  }
}

export const subjectFileStorage = new Storage({
  bucketName: env.GCP_SUBJECT_FILE_BUCKET_NAME,
});

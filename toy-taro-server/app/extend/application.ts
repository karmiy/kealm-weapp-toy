import { Application } from "egg";
import { extname, join } from "path";
import { existsSync, mkdirSync, renameSync, unlinkSync } from "fs";
import { JsError } from "../utils/error";
import { SERVER_CODE } from "../utils/constants";

const ID_SERIAL = [
  "w",
  "x",
  "c",
  "4",
  "e",
  "b",
  "b",
  "d",
  "e",
  "b",
  "c",
  "f",
  "4",
  "5",
  "c",
  "1",
  "0",
  "8",
];
const SECRET_SERIAL = [
  "c",
  "3",
  "f",
  "5",
  "8",
  "d",
  "2",
  "c",
  "4",
  "4",
  "f",
  "0",
  "f",
  "0",
  "8",
  "2",
  "e",
  "5",
  "e",
  "0",
  "d",
  "f",
  "f",
  "9",
  "b",
  "7",
  "d",
  "0",
  "4",
  "5",
  "9",
  "8",
];

export default {
  getCurrentTime() {
    return new Date().toLocaleString();
  },
  get currentTime() {
    return this.getCurrentTime();
  },
  /* 小程序 */
  get AppID() {
    return ID_SERIAL.join("");
  },
  get AppSecret() {
    return SECRET_SERIAL.join("");
  },
  getFileUrl(filename: string, score: string) {
    return join("public", score, filename);
  },
  getFileDir(this: Application, score: string) {
    return join(this.baseDir, "app", "public", score);
  },
  getFilePath(this: Application, fileUrl: string) {
    return join(this.baseDir, "app", fileUrl);
  },
  async uploadFile(
    this: Application,
    params: {
      file: { filename: string; filepath: string };
      prefix: string;
      score: string;
      userId: string;
    }
  ) {
    try {
      const { file, userId, prefix, score } = params;
      // 获取文件的扩展名
      const extName = extname(file.filename);
      // 生成唯一的文件名
      const filename = `${prefix}-${userId}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}${extName}`;

      const uploadDir = this.getFileDir(score);
      const filePath = join(uploadDir, filename);

      // 确保目标文件夹存在，如果没有则创建
      if (!existsSync(uploadDir)) {
        mkdirSync(uploadDir);
      }

      renameSync(file.filepath, filePath);

      return Promise.resolve({
        filename: this.getFileUrl(filename, score),
      });
    } catch (error) {
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "文件存储失败")
      );
    }
  },
  async deleteFile(this: Application, params: { fileUrl: string }) {
    try {
      const { fileUrl } = params;
      const filePath = this.getFilePath(fileUrl);
      if (existsSync(filePath)) {
        unlinkSync(filePath); // 删除旧头像文件
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "文件删除失败")
      );
    }
  },
};

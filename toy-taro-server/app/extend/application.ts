import { Application } from "egg";
import { extname, posix } from "path";
import {
  existsSync,
  mkdirSync,
  unlinkSync,
  readFileSync,
  writeFileSync,
} from "fs";
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

function recursiveMkdirSync(dirPath: string) {
  // 判断目录是否已存在
  if (existsSync(dirPath)) return;

  // 获取父级目录
  const parentDir = posix.join(dirPath, "..");

  // 如果父级目录不存在，递归创建父级目录
  if (!existsSync(parentDir)) {
    recursiveMkdirSync(parentDir);
  }

  // 创建当前目录
  mkdirSync(dirPath);
}

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
  getFileUrl(params: {
    sourceType: string;
    groupId: string;
    moduleName: string;
    filename: string;
  }) {
    const { filename } = params;
    return posix.join(
      "public",
      this._getFileDirPathRelativePublic(params),
      filename
    );
  },
  _getFileDirPathRelativePublic(params: {
    sourceType: string;
    groupId: string;
    moduleName: string;
  }) {
    const { sourceType, groupId, moduleName } = params;
    return posix.join(sourceType, `group_${groupId}`, moduleName);
  },
  getFileDir(
    this: Application,
    params: {
      sourceType: string;
      groupId: string;
      moduleName: string;
    }
  ) {
    return posix.join(
      this.baseDir,
      "app",
      "public",
      this._getFileDirPathRelativePublic(params)
    );
  },
  getFilePath(this: Application, fileUrl: string) {
    return posix.join(this.baseDir, "app", fileUrl);
  },
  async uploadFile(
    this: Application,
    params: {
      file: { filename: string; filepath: string };
      sourceType: string;
      groupId: string;
      userId: string;
      moduleName: string;
      fileNamePrefix: string;
    }
  ) {
    const { file, sourceType, groupId, userId, moduleName, fileNamePrefix } =
      params;
    try {
      // 获取文件的扩展名
      const extName = extname(file.filename);
      // 生成唯一的文件名
      const filename = `${fileNamePrefix}-${userId}-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}${extName}`;

      const uploadDir = this.getFileDir({
        sourceType,
        groupId,
        moduleName,
      });
      const filePath = posix.join(uploadDir, filename);

      // 确保目标文件夹存在，如果没有则创建
      if (!existsSync(uploadDir)) {
        recursiveMkdirSync(uploadDir);
      }

      const fileData = readFileSync(file.filepath);
      writeFileSync(filePath, fileData);
      // renameSync(file.filepath, filePath);

      return Promise.resolve({
        filename: this.getFileUrl({
          sourceType,
          groupId,
          moduleName,
          filename,
        }),
      });
    } catch (error) {
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "文件存储失败")
      );
    } finally {
      unlinkSync(file.filepath);
    }
  },
  async deleteFile(this: Application, params: { fileUrl: string }) {
    try {
      const { fileUrl } = params;
      const filePath = this.getFilePath(fileUrl);
      if (existsSync(filePath)) {
        unlinkSync(filePath); // 删除旧文件
      }
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(
        new JsError(SERVER_CODE.INTERNAL_SERVER_ERROR, "文件删除失败")
      );
    }
  },
};

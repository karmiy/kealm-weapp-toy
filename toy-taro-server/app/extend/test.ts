// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { existsSync, mkdirSync, renameSync, unlinkSync } = require("fs");

function recursiveMkdirSync(dirPath) {
  // 判断目录是否已存在
  if (existsSync(dirPath)) return;

  // 获取父级目录
  const parentDir = join(dirPath, "..");
  console.log("[test] parentDir", parentDir);

  // 如果父级目录不存在，递归创建父级目录
  if (!existsSync(parentDir)) {
    recursiveMkdirSync(parentDir);
  }

  // 创建当前目录
  console.log("[test] mkdirSync", dirPath);
  mkdirSync(dirPath);
}

console.log("[test]", join("src", "images"));
console.log("[test]", existsSync(join(__dirname, "../public/images")));
console.log(
  "[test]",
  existsSync(join(__dirname, "../public/images/group-123/product"))
);
recursiveMkdirSync(join(__dirname, "../public/images/group-123/product/kk"));

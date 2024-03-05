'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.appendContent = exports.readFileContent = exports.createHost = void 0;
const schematics_1 = require('@angular-devkit/schematics');
const core_1 = require('@angular-devkit/core');
/**
 * create the host workspace before a schematic work
 * @param tree
 */
function createHost(tree) {
  return {
    readFile(path) {
      return __awaiter(this, void 0, void 0, function* () {
        const data = tree.read(path);
        if (!data) {
          throw new schematics_1.SchematicsException('File not found.');
        }
        return core_1.virtualFs.fileBufferToString(data);
      });
    },
    writeFile(path, data) {
      return __awaiter(this, void 0, void 0, function* () {
        return tree.overwrite(path, data);
      });
    },
    isDirectory(path) {
      return __awaiter(this, void 0, void 0, function* () {
        return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
      });
    },
    isFile(path) {
      return __awaiter(this, void 0, void 0, function* () {
        return tree.exists(path);
      });
    },
  };
}
exports.createHost = createHost;
/**
 * read file content as a string from the tree
 * @param tree
 * @param path
 */
function readFileContent(tree, path) {
  let fileBuffer = tree.read(path);
  let fileContent = '';
  if (fileBuffer) {
    fileContent = fileBuffer.toString();
    return fileContent;
  } else {
    throw new schematics_1.SchematicsException(`Invalid File Path : ${path}`);
  }
}
exports.readFileContent = readFileContent;
/**
 * append a string to a file content
 * @param selectKey
 * @param content2Append
 * @param fileContent
 */
function appendContent(selectKey, content2Append, fileContent) {
  const appendIndex = fileContent.indexOf(selectKey);
  return fileContent.slice(0, appendIndex + selectKey.length) + content2Append + fileContent.slice(appendIndex + selectKey.length);
}
exports.appendContent = appendContent;
//# sourceMappingURL=batcoin.schematics.service.js.map

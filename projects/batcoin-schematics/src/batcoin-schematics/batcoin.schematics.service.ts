import { SchematicsException, Tree } from '@angular-devkit/schematics';
import { virtualFs, workspaces } from '@angular-devkit/core';

/**
 * create the host workspace before a schematic work
 * @param tree
 */
export function createHost(tree: Tree): workspaces.WorkspaceHost {
  return {
    async readFile(path: string): Promise<string> {
      const data = tree.read(path);
      if (!data) {
        throw new SchematicsException('File not found.');
      }
      return virtualFs.fileBufferToString(data);
    },
    async writeFile(path: string, data: string): Promise<void> {
      return tree.overwrite(path, data);
    },
    async isDirectory(path: string): Promise<boolean> {
      return !tree.exists(path) && tree.getDir(path).subfiles.length > 0;
    },
    async isFile(path: string): Promise<boolean> {
      return tree.exists(path);
    },
  };
}

/**
 * read file content as a string from the tree
 * @param tree
 * @param path
 */
export function readFileContent(tree: Tree, path: string): string {
  let fileBuffer: Buffer | null = tree.read(path);
  let fileContent: string = '';
  if (fileBuffer) {
    fileContent = fileBuffer.toString();
    return fileContent;
  } else {
    throw new SchematicsException(`Invalid File Path : ${path}`);
  }
}

/**
 * append a string to a file content
 * @param selectKey
 * @param content2Append
 * @param fileContent
 */
export function appendContent(selectKey: string, content2Append: string, fileContent: string): string {
  const appendIndex = fileContent.indexOf(selectKey);
  return fileContent.slice(0, appendIndex + selectKey.length) + content2Append + fileContent.slice(appendIndex + selectKey.length);
}

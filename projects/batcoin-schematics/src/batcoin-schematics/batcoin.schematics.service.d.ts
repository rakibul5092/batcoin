import { Tree } from '@angular-devkit/schematics';
import { workspaces } from '@angular-devkit/core';
/**
 * create the host workspace before a schematic work
 * @param tree
 */
export declare function createHost(tree: Tree): workspaces.WorkspaceHost;
/**
 * read file content as a string from the tree
 * @param tree
 * @param path
 */
export declare function readFileContent(tree: Tree, path: string): string;
/**
 * append a string to a file content
 * @param selectKey
 * @param content2Append
 * @param fileContent
 */
export declare function appendContent(selectKey: string, content2Append: string, fileContent: string): string;

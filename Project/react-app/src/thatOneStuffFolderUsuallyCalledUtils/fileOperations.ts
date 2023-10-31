// Used code from work for reference, my boss said to feel free to use our company code as a learning resource 
// (Sounds odd and very generous until you learn that he was my highschool teacher before he was my boss, then it's just very generous)
// I am making sure the code is my own, there are ways of doing things in here that I know aren't my style, and I almost never think of recursion as a solution (I need to get better at this)
// The main way I made this my own is by making swappable actionMethods. I don't know how this will go, but hopefully it's DRY B)
// I also asked GPT to convert this entire file into typescript
// Written by AI Assistant
import { DirectoryNode, FileSystemTree, FileNode } from "@webcontainer/api";

type ActionMethod = (directory: FileSystemTree, path: string | undefined, ...parameters: any[]) => any;

interface WebContainer {
    fs: {
        readdir: (path: string, options: { withFileTypes: boolean }) => Promise<any[]>;
        readFile: (path: string, encoding: string) => Promise<any>;
    };
}


const fileTraverse = (
    directory: FileSystemTree | null,
    splitPath: string[],
    actionMethod: ActionMethod,
    parameters: any[] = []
): any => {
    if (directory == null) {
        console.log("FileSystemTree is null");
        return;
    }

    let splitPathClone = [...splitPath];
    let path = splitPathClone.shift();

    if (path == '.') {
        path = splitPathClone.shift();
    }

    if (splitPathClone.length == 0) {
        return actionMethod(directory, path, ...parameters);
    }

    let currentFileSystemTree: FileSystemTree;

    if (!directory[path!]) {
        directory[path!] = {
            directory: {}
        };
    }
    // @ts-ignore //This is an uncertainty I don't know how to fix
    // The code works, but typescript doesn't like it
    currentFileSystemTree = directory[path!].directory!;
    return fileTraverse(currentFileSystemTree, splitPathClone, actionMethod, parameters);
};

const setFile = (directory: FileSystemTree, path: string | undefined, contents: any): void => {
    directory[path!] = {
        file: {
            contents: contents,
        }
    };
};

const addFileSystemTree = (directory: FileSystemTree, path: string | undefined): void => {
    directory[path!] = {
        directory: {}
    };
};

const deleteFile = (directory: FileSystemTree, path: string | undefined): void => {
    delete directory[path!];
};

const deleteFileSystemTree = (directory: FileSystemTree, path: string | undefined): void => {
    delete directory[path!];
};

const getFile = (directory: FileSystemTree, path: string | undefined): any => {
    // @ts-ignore
    return directory[path!].file?.contents;
};

const getFileSystemTreeContents = async (
    webContainer: WebContainer,
    tree: FileSystemTree = {},
    path: string = ""
): Promise<FileSystemTree> => {
    const contents = await webContainer.fs.readdir(path, { withFileTypes: true });

    for (const node of contents) {
        if (node.isFile()) {
            tree[node.name] = {
                file: {
                    contents: await webContainer.fs.readFile(`${path}/${node.name}`, 'utf-8')
                }
            };
        } else if (node.isFileSystemTree()) {
            if (node.name === 'node_modules') continue;

            const newPath = `${path}/${node.name}`;
            tree[node.name] = {
                directory: {}
            };
            // @ts-ignore
            await getFileSystemTreeContents(webContainer, tree[node.name].directory!, newPath);
        }
    }

    return tree;
};

export type fileOperationsType = {
    writeFile: (fileTree: FileSystemTree, path: string, contents: any) => void;
    addFileSystemTree: (fileTree: FileSystemTree, path: string) => void;
    deleteFile: (fileTree: FileSystemTree, path: string) => void;
    deleteFileSystemTree: (fileTree: FileSystemTree, path: string) => void;
    getFileContents: (fileTree: FileSystemTree, path: string) => any;
    getFileTree: (webContainer: WebContainer) => Promise<FileSystemTree>;
}

const fileOperations = {
    writeFile: (fileTree: FileSystemTree, path: string, contents: any) => {
        fileTraverse(fileTree, path.split("/"), setFile, [contents]);
    },
    addFileSystemTree: (fileTree: FileSystemTree, path: string) => {
        fileTraverse(fileTree, path.split("/"), addFileSystemTree);
    },
    deleteFile: (fileTree: FileSystemTree, path: string) => {
        fileTraverse(fileTree, path.split("/"), deleteFile);
    },
    deleteFileSystemTree: (fileTree: FileSystemTree, path: string) => {
        fileTraverse(fileTree, path.split("/"), deleteFileSystemTree);
    },
    getFileContents: (fileTree: FileSystemTree, path: string): any => {
        return fileTraverse(fileTree, path.split("/"), getFile);
    },
    getFileTree: async (webContainer: WebContainer): Promise<FileSystemTree> => {
        return await getFileSystemTreeContents(webContainer);
    }
};

export default fileOperations;

// Written by AI Assistant

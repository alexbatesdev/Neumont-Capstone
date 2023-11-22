// Used code from work for reference, my boss said to feel free to use our company code as a learning resource 
// (Sounds odd and very generous until you learn that he was my highschool teacher before he was my boss, then it's just very generous)
// I am making sure the code is my own, there are ways of doing things in here that I know aren't my style, and I almost never think of recursion as a solution (I need to get better at this)
// The main way I made this my own is by making swappable actionMethods. I don't know how this will go, but hopefully it's DRY B)
const fileTraverse = (directory, splitPath, fullTree, actionMethod, parameters = []) => {
    // For some reason fileTraverse is being called with a null directory and I don't know why
    // This patches that issue up, but I wish I knew why it was happening
    if (directory == null) {
        //console.log("Directory is null")
        return;
    }

    //console.log("Entering fileTraverse")
    //console.log("directory: ", directory)
    //console.log("splitpath: ", splitPath)
    // //console.log("actionMethod: ", actionMethod)
    let splitPathClone = [...splitPath];
    //Get the next chunk of the path
    let path = splitPathClone.shift();
    // //console.log("path: ", path);

    if (path == '.') {
        // //console.log("Path is a dot");
        //If it's a dot, thats the same as being at the end
        path = splitPathClone.shift();
        // //console.log("newPath: ", path)
    }

    //If it's the last chunk,
    if (splitPathClone.length == 0) {
        // console.log("Triggering actionMethod");
        // console.log("directory: ", directory)
        // console.log("Action method Path: ", path)
        let output = actionMethod(directory, path, ...parameters);
        // console.log("Output: ", output)
        if (output != undefined) {
            return output;
        } else {
            return fullTree;
        }
    }
    // //console.log("---------")
    //If it's not the last chunk, and the path doesn't exist yet,
    let currentDirectory;
    //If the path doesn't exist yet,
    if (!directory[path]) {
        // create it
        directory[path] = {
            directory: {}
        }
    }
    //Then set the currentDirectory to the next directory
    currentDirectory = directory[path].directory;
    //console.log("newDirectory: ", currentDirectory)
    //console.log("Exiting fileTraverse")
    //Then recurse
    return fileTraverse(currentDirectory, splitPathClone, fullTree, actionMethod, parameters);
}

//Creates or overrides a file at the given path
const setFile = (directory, path, contents) => {
    // //console.log("Setting file")
    directory[path] = {
        file: {
            contents: contents,
        }
    }
    return;
}

const addDirectory = (directory, path) => {
    directory[path] = {
        directory: {}
    }
    return;
}

const deleteFile = (directory, path) => {
    delete directory[path];
    return;
}

const deleteDirectory = (directory, path) => {
    delete directory[path];
    return;
}

const getFile = (directory, path) => {
    // //console.log("Getting file")
    // //console.log(directory)
    // //console.log(path)
    // //console.log(directory[path])
    return directory[path].file.contents;
}

const getDirectoryContents = async (webContainer, tree = {}, path = "") => {
    let contents
    try {
        contents = await webContainer.fs.readdir(path, { withFileTypes: true });
    } catch (e) {
        //console.log("Directory likely does not exist, this may be due to renaming a directory")
        //console.log(e);
        contents = [];
        return;
    }
    // //console.log(tree);
    //console.log(contents);

    for (const node of contents) {
        // //console.log(path + "/" + node.name);

        if (node.isFile()) {
            tree[node.name] = {
                file: {
                    contents: {}
                }
            };
            try {
                tree[node.name].file.contents = await webContainer.fs.readFile(path + "/" + node.name, 'utf-8');
            } catch (e) {
                //console.log("File likely does not exist, this may be due to renaming a file")
                //console.log(e);
            }
        } else if (node.isDirectory()) {
            if (node.name === 'node_modules') {
                tree[node.name] = {
                    directory: {}
                };
                continue;
            }
            const newPath = (path + "/" + node.name);
            tree[node.name] = {
                directory: {}
            };
            await getDirectoryContents(webContainer, tree[node.name].directory, newPath);
        }
    }

    // //console.log(tree);
    return tree;
};

const setDirectoryContents = (directory, path, tree) => {
    // console.log("Setting directory contents")
    // console.log("Path: ", path);
    // console.log("New Contents: ", tree);
    if (path == "") return directory = tree;
    //console.log("Directory to override", directory[path].directory);
    if (tree == undefined || tree == null) tree = {};
    // console.log("Directory: ", directory);
    // console.log("Directory witrh Path: ", directory[path])
    directory[path].directory = tree;
    return;
}

//These functions manipulate the file tree, the rely on pass by reference to do so
//Wrapper functions for easier use
const fileOperations = {
    writeFile: (fileTree, path, contents) => {
        //console.log("File Operations Wrapper")
        //console.log(path)
        fileTraverse(fileTree, path.split("/"), fileTree, setFile, [contents]);
    },
    addDirectory: (fileTree, path) => {
        //console.log("File Operations Wrapper")
        //console.log(path)
        fileTraverse(fileTree, path.split("/"), fileTree, addDirectory);
    },
    deleteFile: (fileTree, path) => {
        //console.log("File Operations Wrapper")
        //console.log(path)
        fileTraverse(fileTree, path.split("/"), fileTree, deleteFile);
    },
    deleteDirectory: (fileTree, path) => {
        //console.log("File Operations Wrapper")
        //console.log(path)
        fileTraverse(fileTree, path.split("/"), fileTree, deleteDirectory);
    },
    getFileContents: (fileTree, path) => {
        //console.log("File Operations Wrapper")
        //console.log(path)
        const filepath = path; //Renaming the variable due to how ... operator works
        return fileTraverse(fileTree, path.split("/"), fileTree, getFile, [filepath]);
    },
    getFileTree: async (webContainer) => {
        return await getDirectoryContents(webContainer);
    },
    setDirectory: async (fileTree, path, newDirectoryContents) => {
        //console.log("File Operations Wrapper")
        //console.log(path)
        return await fileTraverse(fileTree, path.split("/"), fileTree, setDirectoryContents, [newDirectoryContents]);
    },
    getDirectory: async (webContainer, path) => {
        //console.log("File Operations Wrapper")
        //console.log(path)
        return await getDirectoryContents(webContainer, {}, path);
    }
}

export default fileOperations;
const archiver = require('archiver');
const fs = require("fs");

function ArchiveFolder() {
    this.zipFolder = (floderPathToZip, nameFolder, folderPath) => {
        let result = { success: false }
        return new Promise((resolve) => {
            try {
                const output = fs.createWriteStream(`${folderPath}/${nameFolder}`);
                const archive = archiver('zip', {
                    zlib: { level: 9 } // Sets the compression level.
                });

                output.on('close', function () {
                    console.log(archive.pointer() + ' total bytes');
                    console.log('archiver has been finalized and the output file descriptor has closed.');
                    result.success = true;
                    result.data = {
                        nameFile: nameFolder
                    };
                    return resolve(result);
                });

                archive.on('error', (err) => {
                    console.log(err);
                    return resolve(result);
                });

                archive.pipe(output);
                archive.directory(floderPathToZip, false);
                archive.finalize();
            } catch (error) {
                console.log(error);
                return resolve(result);
            }
        });
    }
}

module.exports.ArchiveFolder = new ArchiveFolder();
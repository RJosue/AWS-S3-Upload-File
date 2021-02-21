const AWS = require('aws-sdk');
const path = require('path');
const fs = require('fs');
const archive = require('./archive-folder');
const uuidv1 = require('uuid/v1');

function UploadAWS() {

    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });

    const floderPath = path.join(__dirname, '../public/repo/companyImage');
    const pathFolderSave = path.join(__dirname, '../public/repo');
    const nameZip = `${uuidv1()}__${new Date().toLocaleDateString().replace(/[/]/gi, "-")}.zip`

    this.uploadFile = async () => {
        try {
            let resultZip = await archive.ArchiveFolder.zipFolder(floderPath, nameZip, pathFolderSave);
            if (!resultZip.success)
                return resultZip;

            fs.readFile(`${pathFolderSave}/${resultZip.data.nameFile}`, (err, data) => {
                if (err) throw err
                const params = {
                    Bucket: process.env.BUCKET_NAME,
                    Key: resultZip.data.nameFile,
                    Body: data,
                }
                s3.upload(params, function (s3Err, data) {
                    if (s3Err) throw s3Err
                    console.log(`File uploaded successfully at ${data.Location}`);
                    fs.unlink(`${pathFolderSave}/${resultZip.data.nameFile}`, (errPath, data) => {
                        if (errPath) throw errPath;
                        console.log(`File | ${resultZip.data.nameFile} | deleted successfully `);
                    });
                });
            });
        } catch (error) {
            console.log(error);
        }
    }
}

module.exports.UploadAWS = new UploadAWS();

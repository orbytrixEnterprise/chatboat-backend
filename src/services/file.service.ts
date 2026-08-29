/****************************
 FILE HANDLING OPERATIONS
 ****************************/
import fs from 'fs';
import * as path from 'path';
import { applicationLogger, configuration } from '../configs';

export class FileService {

    static footerFile(folder: any) {
        return new Promise(function (resolve) {
            fs.readdir(path.join(configuration.publicDirectory, 'public', folder), (err, files) => {
                if (err) {
                    applicationLogger.error(`FileService footerFile`, { folder: folder, error: err });
                    resolve([]);
                }
                resolve(files);
            });
        });
    }

    static removeFile(file: any) {
        try {
            fs.unlinkSync(path.join(configuration.publicDirectory, 'public', file));
        } catch (err) {
            applicationLogger.error(`FileService removeFile`, { file: file, error: err });
        }
    }

    static uploadFile(file: any, folder: any, relativePath = true) {
        return new Promise(function (resolve, reject) {
            const fileName = file.originalFilename.split(".");
            const newFileName = Date.now().toString() + Math.floor(100000 + Math.random() * 900000) + '.' + fileName[fileName.length - 1];
            const dir = path.join(configuration.publicDirectory, 'public', folder);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const uploadedFilePath = path.join(configuration.publicDirectory, 'public', folder, newFileName);

            fs.readFile(file.path, (err, data) => {
                if (err) {
                    reject(err.stack);
                } else {
                    fs.writeFile(uploadedFilePath, data, (err) => {
                        if (err) {
                            reject(err.stack);
                        } else {
                            if (relativePath) {
                                resolve(folder + '/' + newFileName);
                            }
                            else {
                                resolve(uploadedFilePath);
                            }
                        }
                    });
                }
            });
        });
    }

    static readFile(filepath: any) {
        return new Promise((resolve, reject) => {
            fs.readFile(filepath, 'utf-8', (err, html) => {
                if (err) { return reject({ message: err, status: 0 }); }

                return resolve(html);

            });
        });
    }

    static writeFile(filepath: any, data: any) {
        const fileContents = fs.writeFileSync(filepath, data);
        return fileContents;
    }

    static appendFile(filepath: any, data: any) {
        const fileContents = fs.appendFileSync(filepath, data);
        return fileContents;
    }

}
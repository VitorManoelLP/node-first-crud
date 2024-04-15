import { readFileSync, readdir } from "fs";

export default class ReadFile {

  readDirectory(path: string, callback: Function) {

    readdir(path, (err, files) => {

      if (err) {
        console.error(err);
        return;
      }

      callback(files);

    });

  }

  readFile(path: string) {
    return readFileSync(path, 'utf8');
  }

}
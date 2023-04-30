import fs from 'fs';

export const createDirIfDoesntExists = (dir: string) => {
  if (fs.existsSync(dir)) {
    return;
  }
  
  try {
    fs.mkdirSync(dir);
  } catch (e) {
    throw new Error('Error creating directory');
  }
}

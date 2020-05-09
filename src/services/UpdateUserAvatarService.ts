import path from 'path';
import { getRepository } from 'typeorm';
import fs from 'fs';

import User from '../models/User';
import AppError from '../errors/AppError';
import uploadConfig from '../config/upload';

interface Request {
  user_id: string;
  avatarFilename: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFilename }: Request): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath); // tras o status de um arquivo, se ele existe.

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath); // se o arquivo existe - delete
      }
    }

    user.avatar = avatarFilename;
    await userRepository.save(user); // update user

    return user;
  }
}

export default UpdateUserAvatarService;

import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PasswordService {

    getPasswordHash(password: string): string {
        return crypto.createHash('sha256').update(password + 'superpetsalt').digest('hex')
    }

    checkSpecialCharacters(password) {
        return /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
    }

}

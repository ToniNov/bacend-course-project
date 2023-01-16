import bcrypt from 'bcrypt';

const HASH_SALT = 10;

export const passwordHash = async (plainPassword: string): Promise<string> => {
    return bcrypt.hashSync(plainPassword, HASH_SALT);
};

export const comparePassword = async (plainPassword: string, passwordHash: string): Promise<boolean> => {
    return  bcrypt.compareSync(plainPassword, passwordHash);
};

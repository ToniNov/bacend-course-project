import bcrypt from 'bcrypt';

const HASH_SALT = 10;

export const passwordHash = (plainPassword: string): string => {
    return  bcrypt.hashSync(plainPassword, HASH_SALT);
};

export const comparePassword = (plainPassword: string, passwordHash: string): boolean => {

    const compared = bcrypt.compareSync(plainPassword, passwordHash);

    console.log(compared)

    return compared;
};

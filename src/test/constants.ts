import { IUser } from "../users/users.interface";

export const testUserData: Omit<IUser, "id"> = {
    "username": "Vasiliy",
    "age": 22,
    "hobbies": ["swimming", "reading"]
}
import { IUser } from "./users.interface"
import { v4 as uuidv4 } from "uuid";

class UsersController {
    private _users: IUser[] = []

    private _setUsers(updatedUserList: IUser[]): void {
        this._users = updatedUserList
    }

    get users(): IUser[] {
        return this._users
    }

    getUser(id: string): IUser | null {
        const user = this.users.find((user) => user.id === id)
        return user ?? null
    }

    createUser(userData: any): IUser | null {
        try {
            const { username, age, hobbies } = JSON.parse(userData)

            if (typeof username === 'string' && typeof age === 'number' && Array.isArray(hobbies)) {
                const user = { username, age, hobbies, id: uuidv4() }
                const newUsers = [...this.users, user]
                this._setUsers(newUsers)

                return user
            }

            return null
        } catch (error) {
            console.error(error)
            return null
        }
    }

    updateUser(updatedUserData: any, id: string): IUser | null {
        try {
            const updatedUser = JSON.parse(updatedUserData)
            updatedUser.id = id
            const { username, age, hobbies } = updatedUser

            if (typeof username === 'string' && typeof age === 'number' && Array.isArray(hobbies)) {
                const index = this.users.findIndex((user) => user.id === id)
                const localUsers = [...this.users]
                localUsers[index] = updatedUser
                this._setUsers(localUsers)

                return updatedUser
            }

            return null
        } catch (error) {
            console.error(error)
            return null
        }
    }

    deleteUser(userId: string): void {
        const index = this.users.findIndex((user) => user.id === userId)
        const localUsers = [...this.users]
        localUsers.splice(index, 1)
        this._setUsers(localUsers)
        console.log(this.users)
    }
}

export const usersController = new UsersController()
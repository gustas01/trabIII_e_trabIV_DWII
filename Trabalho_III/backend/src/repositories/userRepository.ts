import { AppDataSource } from "../config/datasource";
import { User } from "../entities/User";

export const userRepository = AppDataSource.getRepository(User);

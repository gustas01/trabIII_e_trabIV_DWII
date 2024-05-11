import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import ResponseDTO from "src/dtos/ResponseDTO";
import { User } from "src/entities/User";
import { userRepository } from "../repositories/userRepository";

class LoginRequired {
  async validate(req: Request, res: Response, next: NextFunction) {
    const token = LoginRequired.extractJWTFromCookies(req);
    if (!token)
      return res.status(401).json({
        status: 401,
        content: "Login Required",
        success: false,
      } as ResponseDTO);

    try {
      const { id } = jwt.verify(token, String(process.env.TOKEN_SECRET)) as {
        id: string;
      };

      const user: User | null = await userRepository.findOneBy({ id });

      if (!user) {
        throw new Error("Usuário inválido");
      }

      req.body.user = user;
      return next();
    } catch (e) {
      return res.status(401).json({
        status: 401,
        content: "Token expirado ou inválido",
        success: false,
      } as ResponseDTO);
    }
  }

  static extractJWTFromCookies(req: Request) {
    if (req.cookies && "token" in req.cookies && req.cookies.token.length > 0)
      return req.cookies.token;
    return null;
  }
}

export default new LoginRequired();

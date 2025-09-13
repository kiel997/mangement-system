import { Injectable,UnauthorizedException } from "@nestjs/common";
import{PassportStrategy} from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/user/entities/user.entity";
import { UserService } from "src/user/user.service";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor( private userService: UserService,
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow('JWT_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(payload: {email}): Promise<User> {
        const {email} = payload;
        const user = await this.userService.findEmail(email);
        if (!user) {
            throw new UnauthorizedException('Login first to access this endpoint');
        }
        return user;
    }
}
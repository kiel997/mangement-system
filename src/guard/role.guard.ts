/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserService } from "src/user/user.service";

@Injectable()
export class RoleGuard implements CanActivate{
    constructor(private reflector: Reflector, private userService: UserService){}
    
    async canActivate(context: ExecutionContext):Promise<boolean> {
        const roles = this.reflector.get<string[]>('roles', context.getHandler()); 
        

        const request = context.switchToHttp().getRequest();
       

        if(request?.user){
            const headers: Headers= request.headers;
            const user = this.userService.user(headers);
            
            if(!roles.includes((await user).role)) {
                throw new ForbiddenException(roles.join(' or '))
                // throw new ForbiddenException(roles.join(' or '))
            }
            return true;
        }
        return false;
       
    }
}
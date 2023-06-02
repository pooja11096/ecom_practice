import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
// import { Strategy, VerifyCallback } from "passport-google-oauth20"
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { AuthService } from "./auth.service";

@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor(private readonly authService: AuthService) {
        super({
            clientID:"711616076813-nj9uhgdb62agcafu0gfisb32j3nrnqtr.apps.googleusercontent.com",
            clientSecret:"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",
            callbackURL:"http://localhost:3000/auth/google",
            scope:['email', 'profile']
        })
    }

    async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile
        const user = {
          email: emails[0].value,
          firstName: name.givenName,
          lastName: name.familyName,
          picture: photos[0].value,
          accessToken
        }
        done(null, user);
      }
    

}

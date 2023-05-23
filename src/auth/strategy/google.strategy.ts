import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { Strategy, VerifyCallback } from "passport-google-oauth20"

@Injectable()

export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID:"747743989161-mhqnpngqr3eqcle84j84qaqrhb39puve.apps.googleusercontent.com",
            clientSecret:"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",
            callbackURL:"http://localhost:5000/google",
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

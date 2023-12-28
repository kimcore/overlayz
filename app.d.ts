/// <reference types="lucia" />
declare namespace Lucia {
    type Auth = import("./src/auth/lucia").Auth;
    type DatabaseUserAttributes = {
        twitch?: string
        chzzk?: string
    };
    type DatabaseSessionAttributes = {};
}
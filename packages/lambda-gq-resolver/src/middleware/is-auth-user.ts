import { MiddlewareFn } from 'type-graphql';

import { Context, IdentityType } from 'src/types';

const isAuthUser: MiddlewareFn<Context> = async ({ context: { identity } }, next) => {
    if (identity.type !== IdentityType.USER && identity.type !== IdentityType.ROLE) {
        // Role can do anyting
        throw new Error('not authenticated');
    }

    return next();
};

export default isAuthUser;

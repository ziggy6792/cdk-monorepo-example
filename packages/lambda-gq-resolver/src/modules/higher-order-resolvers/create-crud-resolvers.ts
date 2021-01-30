/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Middleware } from 'type-graphql/dist/interfaces/Middleware';
import createCreateResolver from './create-create-resolver';
import createListResolver from './create-list-resolver';

interface IResolverOptions {
    middleware: Middleware<any>[];
}

interface ICreateOptions extends IResolverOptions {
    inputType: any;
}

interface ICrudResolverOptions {
    createOptions?: ICreateOptions;
    listOptions?: IResolverOptions;
}

const createCrudResolvers = (suffix: string, returnType: any, resolverOptions: ICrudResolverOptions): any[] => {
    const { createOptions, listOptions } = resolverOptions;
    const crudResolvers = [];
    if (createOptions) {
        crudResolvers.push(createCreateResolver(suffix, returnType, createOptions.inputType, createOptions.middleware));
    }
    if (listOptions) {
        crudResolvers.push(createListResolver(suffix, returnType, listOptions.middleware));
    }

    return crudResolvers;
};

export default createCrudResolvers;

export {};

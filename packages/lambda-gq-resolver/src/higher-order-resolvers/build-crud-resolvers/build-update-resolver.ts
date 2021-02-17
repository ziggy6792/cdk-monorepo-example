/* eslint-disable max-classes-per-file */
/* eslint-disable import/prefer-default-export */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable class-methods-use-this */
import { Resolver, Mutation, Arg, UseMiddleware } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import pluralize from 'pluralize';
import { createExistsCondition } from 'src/utils/utility';
import { IBuildResolversProps } from './types';

export function buildUpdateResolvers(buildResolversProps: IBuildResolversProps) {
    const retResolvers = [];

    const { suffix, returnType, resolverProps, idFields, inputType } = buildResolversProps;

    if (resolverProps.one) {
        const { middleware } = resolverProps.one;

        @Resolver()
        class UpdateOneResolver {
            @Mutation(() => returnType, { name: `update${suffix}` })
            @UseMiddleware(...(middleware || []))
            async update(@Arg('input', () => inputType) input: any) {
                const entity = Object.assign(new returnType(), input);
                const createdEntity = await mapper.update(entity, { condition: createExistsCondition(idFields) });
                return createdEntity;
            }
        }
        retResolvers.push(UpdateOneResolver);
    }

    if (resolverProps.many) {
        const { middleware } = resolverProps.many;
        @Resolver()
        class DelteManyResolver {
            @Mutation(() => [returnType], { name: `update${pluralize.plural(suffix)}` })
            @UseMiddleware(...(middleware || []))
            async create(@Arg('inputs', () => [inputType]) inputs: any[]) {
                const entities = inputs.map((input) => Object.assign(new returnType(), input));
                const updateFns = entities.map((entity) => async () => mapper.update(entity, { condition: createExistsCondition(idFields) }));
                const updatedEntities = await Promise.all(updateFns.map((fn) => fn()));
                return updatedEntities;
            }
        }
        retResolvers.push(DelteManyResolver);
    }

    return retResolvers;
}

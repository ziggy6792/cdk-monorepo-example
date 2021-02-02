/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */

import { Resolver, Query, Arg, ID } from 'type-graphql';
import { mapper } from 'src/utils/mapper';
import Event from 'src/domain/models/event';
import DataEntity from 'src/domain/models/abstract/data-entity';
import CompetitionModel from 'src/domain/models/competition';
import Heat from 'src/domain/models/heat';

// const doNotFail = async (fu: ()=> Promise<any>) => {
//     await fn()
// }

@Resolver()
class GetDataEntityResolver {
    @Query(() => DataEntity, { nullable: true })
    async getDataEntity(@Arg('id', () => ID) id: string): Promise<DataEntity> {
        console.log(`Id is ${id}`);

        const getFromDb = async (returnType: any) => {
            const entity = Object.assign(new returnType(), { id });
            const ret = await mapper.get(entity);
            return ret;
        };

        const results = await Promise.allSettled([getFromDb(Event), getFromDb(CompetitionModel), getFromDb(Heat)]);

        const fullfilledResults = results.filter((res) => res.status === 'fulfilled');

        if (fullfilledResults.length > 0 && fullfilledResults[0].status === 'fulfilled') {
            return fullfilledResults[0].value;
        }

        return null;
    }
}

export default GetDataEntityResolver;

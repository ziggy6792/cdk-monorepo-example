/* eslint-disable prefer-const */
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { DataMapper } from '@aws/dynamodb-data-mapper';
import { FunctionExpression, AttributePath } from '@aws/dynamodb-expressions';

import models from 'src/domain/models';
import getEnvConfig from 'src/config/get-env-config';

const config = getEnvConfig();

// eslint-disable-next-line import/no-mutable-exports
export let mapper: DataMapper;

let isTablesInitialized = false;

const CREATE_TABLE_ARGS = { readCapacityUnits: 5, writeCapacityUnits: 5 };

export const initMapper = (): void => {
    mapper = new DataMapper({
        client: new DynamoDB({ region: config.REGION }), // the SDK client used to execute operations
        tableNamePrefix: config.TABLE_NAME_PREFIX, // optionally, you can provide a table prefix to keep your dev and prod tables separate
    });
};

const tables = models;

const ensureTableExists = async (table: typeof tables[number]) => {
    try {
        await mapper.ensureTableExists(table, { ...CREATE_TABLE_ARGS });
        await table.createIndexes();
    } catch (err) {
        console.log(err);
    }
};

export const initTables = async (): Promise<void> => {
    try {
        if (!isTablesInitialized) {
            // await mapper.ensureTableExists(User, { ...CREATE_TABLE_ARGS, indexOptions: { email: { projection: { readCapacityUnits: 5 } } } });
            const createTableFunctions = tables.map(async (table) => ensureTableExists(table));
            await Promise.all(createTableFunctions);
        }
        isTablesInitialized = true;
        // console.log(timeB - timeA);
    } catch (err) {
        console.log({ err });
    }
};

// export const deleteTables = async (): Promise<void> => {
//     if (initOptions.region !== 'local' || !initOptions.tableNamePrefix.includes('test')) {
//         throw new Error(`Prevented from deleting database ${JSON.stringify(initOptions)}`);
//     }
//     try {
//         const deleteTableFunctions = tables.map((table) => mapper.ensureTableNotExists(table));
//         await Promise.all(deleteTableFunctions);
//     } catch (err) {
//         console.log({ err });
//     }
// };

export const createUniqueCondition = (attributePath = 'id'): FunctionExpression =>
    new FunctionExpression('attribute_not_exists', new AttributePath(attributePath));

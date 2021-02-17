import isAuthRole from 'src/middleware/is-auth-role';
import createCrudResolvers from 'src/higher-order-resolvers/create-crud-resolvers';
import Heat from 'src/domain/models/heat';

const CrudResolvers = createCrudResolvers('Heat', Heat, {
    get: { resolvers: { one: true, many: true } },
});

export default [...CrudResolvers];

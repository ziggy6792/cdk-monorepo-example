import isAuthRole from 'src/middleware/is-auth-role';
import buildCrudResolvers from 'src/higher-order-resolvers/build-crud-resolvers';
import Heat from 'src/domain/models/heat';

const CrudResolvers = buildCrudResolvers('Heat', Heat, {
    crudProps: { get: { resolverProps: { one: true, many: true } } },
});

export default [...CrudResolvers];

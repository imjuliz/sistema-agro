
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model perfis
 * 
 */
export type perfis = $Result.DefaultSelection<Prisma.$perfisPayload>
/**
 * Model unidades
 * 
 */
export type unidades = $Result.DefaultSelection<Prisma.$unidadesPayload>
/**
 * Model usuarios
 * 
 */
export type usuarios = $Result.DefaultSelection<Prisma.$usuariosPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const TipoUnidade: {
  MATRIZ: 'MATRIZ',
  FAZENDA: 'FAZENDA',
  LOJA: 'LOJA'
};

export type TipoUnidade = (typeof TipoUnidade)[keyof typeof TipoUnidade]

}

export type TipoUnidade = $Enums.TipoUnidade

export const TipoUnidade: typeof $Enums.TipoUnidade

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Perfis
 * const perfis = await prisma.perfis.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Perfis
   * const perfis = await prisma.perfis.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.perfis`: Exposes CRUD operations for the **perfis** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Perfis
    * const perfis = await prisma.perfis.findMany()
    * ```
    */
  get perfis(): Prisma.perfisDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.unidades`: Exposes CRUD operations for the **unidades** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Unidades
    * const unidades = await prisma.unidades.findMany()
    * ```
    */
  get unidades(): Prisma.unidadesDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.usuarios`: Exposes CRUD operations for the **usuarios** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Usuarios
    * const usuarios = await prisma.usuarios.findMany()
    * ```
    */
  get usuarios(): Prisma.usuariosDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    perfis: 'perfis',
    unidades: 'unidades',
    usuarios: 'usuarios'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "perfis" | "unidades" | "usuarios"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      perfis: {
        payload: Prisma.$perfisPayload<ExtArgs>
        fields: Prisma.perfisFieldRefs
        operations: {
          findUnique: {
            args: Prisma.perfisFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$perfisPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.perfisFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$perfisPayload>
          }
          findFirst: {
            args: Prisma.perfisFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$perfisPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.perfisFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$perfisPayload>
          }
          findMany: {
            args: Prisma.perfisFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$perfisPayload>[]
          }
          create: {
            args: Prisma.perfisCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$perfisPayload>
          }
          createMany: {
            args: Prisma.perfisCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.perfisCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$perfisPayload>[]
          }
          delete: {
            args: Prisma.perfisDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$perfisPayload>
          }
          update: {
            args: Prisma.perfisUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$perfisPayload>
          }
          deleteMany: {
            args: Prisma.perfisDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.perfisUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.perfisUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$perfisPayload>[]
          }
          upsert: {
            args: Prisma.perfisUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$perfisPayload>
          }
          aggregate: {
            args: Prisma.PerfisAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePerfis>
          }
          groupBy: {
            args: Prisma.perfisGroupByArgs<ExtArgs>
            result: $Utils.Optional<PerfisGroupByOutputType>[]
          }
          count: {
            args: Prisma.perfisCountArgs<ExtArgs>
            result: $Utils.Optional<PerfisCountAggregateOutputType> | number
          }
        }
      }
      unidades: {
        payload: Prisma.$unidadesPayload<ExtArgs>
        fields: Prisma.unidadesFieldRefs
        operations: {
          findUnique: {
            args: Prisma.unidadesFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unidadesPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.unidadesFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unidadesPayload>
          }
          findFirst: {
            args: Prisma.unidadesFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unidadesPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.unidadesFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unidadesPayload>
          }
          findMany: {
            args: Prisma.unidadesFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unidadesPayload>[]
          }
          create: {
            args: Prisma.unidadesCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unidadesPayload>
          }
          createMany: {
            args: Prisma.unidadesCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.unidadesCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unidadesPayload>[]
          }
          delete: {
            args: Prisma.unidadesDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unidadesPayload>
          }
          update: {
            args: Prisma.unidadesUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unidadesPayload>
          }
          deleteMany: {
            args: Prisma.unidadesDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.unidadesUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.unidadesUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unidadesPayload>[]
          }
          upsert: {
            args: Prisma.unidadesUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$unidadesPayload>
          }
          aggregate: {
            args: Prisma.UnidadesAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUnidades>
          }
          groupBy: {
            args: Prisma.unidadesGroupByArgs<ExtArgs>
            result: $Utils.Optional<UnidadesGroupByOutputType>[]
          }
          count: {
            args: Prisma.unidadesCountArgs<ExtArgs>
            result: $Utils.Optional<UnidadesCountAggregateOutputType> | number
          }
        }
      }
      usuarios: {
        payload: Prisma.$usuariosPayload<ExtArgs>
        fields: Prisma.usuariosFieldRefs
        operations: {
          findUnique: {
            args: Prisma.usuariosFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuariosPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.usuariosFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuariosPayload>
          }
          findFirst: {
            args: Prisma.usuariosFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuariosPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.usuariosFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuariosPayload>
          }
          findMany: {
            args: Prisma.usuariosFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuariosPayload>[]
          }
          create: {
            args: Prisma.usuariosCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuariosPayload>
          }
          createMany: {
            args: Prisma.usuariosCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.usuariosCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuariosPayload>[]
          }
          delete: {
            args: Prisma.usuariosDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuariosPayload>
          }
          update: {
            args: Prisma.usuariosUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuariosPayload>
          }
          deleteMany: {
            args: Prisma.usuariosDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.usuariosUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.usuariosUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuariosPayload>[]
          }
          upsert: {
            args: Prisma.usuariosUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$usuariosPayload>
          }
          aggregate: {
            args: Prisma.UsuariosAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUsuarios>
          }
          groupBy: {
            args: Prisma.usuariosGroupByArgs<ExtArgs>
            result: $Utils.Optional<UsuariosGroupByOutputType>[]
          }
          count: {
            args: Prisma.usuariosCountArgs<ExtArgs>
            result: $Utils.Optional<UsuariosCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    perfis?: perfisOmit
    unidades?: unidadesOmit
    usuarios?: usuariosOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type PerfisCountOutputType
   */

  export type PerfisCountOutputType = {
    usuarios: number
  }

  export type PerfisCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | PerfisCountOutputTypeCountUsuariosArgs
  }

  // Custom InputTypes
  /**
   * PerfisCountOutputType without action
   */
  export type PerfisCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PerfisCountOutputType
     */
    select?: PerfisCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PerfisCountOutputType without action
   */
  export type PerfisCountOutputTypeCountUsuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usuariosWhereInput
  }


  /**
   * Count Type UnidadesCountOutputType
   */

  export type UnidadesCountOutputType = {
    usuarios: number
  }

  export type UnidadesCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | UnidadesCountOutputTypeCountUsuariosArgs
  }

  // Custom InputTypes
  /**
   * UnidadesCountOutputType without action
   */
  export type UnidadesCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UnidadesCountOutputType
     */
    select?: UnidadesCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UnidadesCountOutputType without action
   */
  export type UnidadesCountOutputTypeCountUsuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usuariosWhereInput
  }


  /**
   * Models
   */

  /**
   * Model perfis
   */

  export type AggregatePerfis = {
    _count: PerfisCountAggregateOutputType | null
    _avg: PerfisAvgAggregateOutputType | null
    _sum: PerfisSumAggregateOutputType | null
    _min: PerfisMinAggregateOutputType | null
    _max: PerfisMaxAggregateOutputType | null
  }

  export type PerfisAvgAggregateOutputType = {
    id: number | null
  }

  export type PerfisSumAggregateOutputType = {
    id: number | null
  }

  export type PerfisMinAggregateOutputType = {
    id: number | null
    nome: string | null
    descricao: string | null
  }

  export type PerfisMaxAggregateOutputType = {
    id: number | null
    nome: string | null
    descricao: string | null
  }

  export type PerfisCountAggregateOutputType = {
    id: number
    nome: number
    descricao: number
    _all: number
  }


  export type PerfisAvgAggregateInputType = {
    id?: true
  }

  export type PerfisSumAggregateInputType = {
    id?: true
  }

  export type PerfisMinAggregateInputType = {
    id?: true
    nome?: true
    descricao?: true
  }

  export type PerfisMaxAggregateInputType = {
    id?: true
    nome?: true
    descricao?: true
  }

  export type PerfisCountAggregateInputType = {
    id?: true
    nome?: true
    descricao?: true
    _all?: true
  }

  export type PerfisAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which perfis to aggregate.
     */
    where?: perfisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of perfis to fetch.
     */
    orderBy?: perfisOrderByWithRelationInput | perfisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: perfisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` perfis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` perfis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned perfis
    **/
    _count?: true | PerfisCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PerfisAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PerfisSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PerfisMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PerfisMaxAggregateInputType
  }

  export type GetPerfisAggregateType<T extends PerfisAggregateArgs> = {
        [P in keyof T & keyof AggregatePerfis]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePerfis[P]>
      : GetScalarType<T[P], AggregatePerfis[P]>
  }




  export type perfisGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: perfisWhereInput
    orderBy?: perfisOrderByWithAggregationInput | perfisOrderByWithAggregationInput[]
    by: PerfisScalarFieldEnum[] | PerfisScalarFieldEnum
    having?: perfisScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PerfisCountAggregateInputType | true
    _avg?: PerfisAvgAggregateInputType
    _sum?: PerfisSumAggregateInputType
    _min?: PerfisMinAggregateInputType
    _max?: PerfisMaxAggregateInputType
  }

  export type PerfisGroupByOutputType = {
    id: number
    nome: string
    descricao: string | null
    _count: PerfisCountAggregateOutputType | null
    _avg: PerfisAvgAggregateOutputType | null
    _sum: PerfisSumAggregateOutputType | null
    _min: PerfisMinAggregateOutputType | null
    _max: PerfisMaxAggregateOutputType | null
  }

  type GetPerfisGroupByPayload<T extends perfisGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PerfisGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PerfisGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PerfisGroupByOutputType[P]>
            : GetScalarType<T[P], PerfisGroupByOutputType[P]>
        }
      >
    >


  export type perfisSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    descricao?: boolean
    usuarios?: boolean | perfis$usuariosArgs<ExtArgs>
    _count?: boolean | PerfisCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["perfis"]>

  export type perfisSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    descricao?: boolean
  }, ExtArgs["result"]["perfis"]>

  export type perfisSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    descricao?: boolean
  }, ExtArgs["result"]["perfis"]>

  export type perfisSelectScalar = {
    id?: boolean
    nome?: boolean
    descricao?: boolean
  }

  export type perfisOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "descricao", ExtArgs["result"]["perfis"]>
  export type perfisInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | perfis$usuariosArgs<ExtArgs>
    _count?: boolean | PerfisCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type perfisIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type perfisIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $perfisPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "perfis"
    objects: {
      usuarios: Prisma.$usuariosPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nome: string
      descricao: string | null
    }, ExtArgs["result"]["perfis"]>
    composites: {}
  }

  type perfisGetPayload<S extends boolean | null | undefined | perfisDefaultArgs> = $Result.GetResult<Prisma.$perfisPayload, S>

  type perfisCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<perfisFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PerfisCountAggregateInputType | true
    }

  export interface perfisDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['perfis'], meta: { name: 'perfis' } }
    /**
     * Find zero or one Perfis that matches the filter.
     * @param {perfisFindUniqueArgs} args - Arguments to find a Perfis
     * @example
     * // Get one Perfis
     * const perfis = await prisma.perfis.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends perfisFindUniqueArgs>(args: SelectSubset<T, perfisFindUniqueArgs<ExtArgs>>): Prisma__perfisClient<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Perfis that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {perfisFindUniqueOrThrowArgs} args - Arguments to find a Perfis
     * @example
     * // Get one Perfis
     * const perfis = await prisma.perfis.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends perfisFindUniqueOrThrowArgs>(args: SelectSubset<T, perfisFindUniqueOrThrowArgs<ExtArgs>>): Prisma__perfisClient<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Perfis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {perfisFindFirstArgs} args - Arguments to find a Perfis
     * @example
     * // Get one Perfis
     * const perfis = await prisma.perfis.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends perfisFindFirstArgs>(args?: SelectSubset<T, perfisFindFirstArgs<ExtArgs>>): Prisma__perfisClient<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Perfis that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {perfisFindFirstOrThrowArgs} args - Arguments to find a Perfis
     * @example
     * // Get one Perfis
     * const perfis = await prisma.perfis.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends perfisFindFirstOrThrowArgs>(args?: SelectSubset<T, perfisFindFirstOrThrowArgs<ExtArgs>>): Prisma__perfisClient<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Perfis that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {perfisFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Perfis
     * const perfis = await prisma.perfis.findMany()
     * 
     * // Get first 10 Perfis
     * const perfis = await prisma.perfis.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const perfisWithIdOnly = await prisma.perfis.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends perfisFindManyArgs>(args?: SelectSubset<T, perfisFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Perfis.
     * @param {perfisCreateArgs} args - Arguments to create a Perfis.
     * @example
     * // Create one Perfis
     * const Perfis = await prisma.perfis.create({
     *   data: {
     *     // ... data to create a Perfis
     *   }
     * })
     * 
     */
    create<T extends perfisCreateArgs>(args: SelectSubset<T, perfisCreateArgs<ExtArgs>>): Prisma__perfisClient<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Perfis.
     * @param {perfisCreateManyArgs} args - Arguments to create many Perfis.
     * @example
     * // Create many Perfis
     * const perfis = await prisma.perfis.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends perfisCreateManyArgs>(args?: SelectSubset<T, perfisCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Perfis and returns the data saved in the database.
     * @param {perfisCreateManyAndReturnArgs} args - Arguments to create many Perfis.
     * @example
     * // Create many Perfis
     * const perfis = await prisma.perfis.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Perfis and only return the `id`
     * const perfisWithIdOnly = await prisma.perfis.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends perfisCreateManyAndReturnArgs>(args?: SelectSubset<T, perfisCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Perfis.
     * @param {perfisDeleteArgs} args - Arguments to delete one Perfis.
     * @example
     * // Delete one Perfis
     * const Perfis = await prisma.perfis.delete({
     *   where: {
     *     // ... filter to delete one Perfis
     *   }
     * })
     * 
     */
    delete<T extends perfisDeleteArgs>(args: SelectSubset<T, perfisDeleteArgs<ExtArgs>>): Prisma__perfisClient<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Perfis.
     * @param {perfisUpdateArgs} args - Arguments to update one Perfis.
     * @example
     * // Update one Perfis
     * const perfis = await prisma.perfis.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends perfisUpdateArgs>(args: SelectSubset<T, perfisUpdateArgs<ExtArgs>>): Prisma__perfisClient<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Perfis.
     * @param {perfisDeleteManyArgs} args - Arguments to filter Perfis to delete.
     * @example
     * // Delete a few Perfis
     * const { count } = await prisma.perfis.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends perfisDeleteManyArgs>(args?: SelectSubset<T, perfisDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Perfis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {perfisUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Perfis
     * const perfis = await prisma.perfis.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends perfisUpdateManyArgs>(args: SelectSubset<T, perfisUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Perfis and returns the data updated in the database.
     * @param {perfisUpdateManyAndReturnArgs} args - Arguments to update many Perfis.
     * @example
     * // Update many Perfis
     * const perfis = await prisma.perfis.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Perfis and only return the `id`
     * const perfisWithIdOnly = await prisma.perfis.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends perfisUpdateManyAndReturnArgs>(args: SelectSubset<T, perfisUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Perfis.
     * @param {perfisUpsertArgs} args - Arguments to update or create a Perfis.
     * @example
     * // Update or create a Perfis
     * const perfis = await prisma.perfis.upsert({
     *   create: {
     *     // ... data to create a Perfis
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Perfis we want to update
     *   }
     * })
     */
    upsert<T extends perfisUpsertArgs>(args: SelectSubset<T, perfisUpsertArgs<ExtArgs>>): Prisma__perfisClient<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Perfis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {perfisCountArgs} args - Arguments to filter Perfis to count.
     * @example
     * // Count the number of Perfis
     * const count = await prisma.perfis.count({
     *   where: {
     *     // ... the filter for the Perfis we want to count
     *   }
     * })
    **/
    count<T extends perfisCountArgs>(
      args?: Subset<T, perfisCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PerfisCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Perfis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PerfisAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PerfisAggregateArgs>(args: Subset<T, PerfisAggregateArgs>): Prisma.PrismaPromise<GetPerfisAggregateType<T>>

    /**
     * Group by Perfis.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {perfisGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends perfisGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: perfisGroupByArgs['orderBy'] }
        : { orderBy?: perfisGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, perfisGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPerfisGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the perfis model
   */
  readonly fields: perfisFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for perfis.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__perfisClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuarios<T extends perfis$usuariosArgs<ExtArgs> = {}>(args?: Subset<T, perfis$usuariosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the perfis model
   */
  interface perfisFieldRefs {
    readonly id: FieldRef<"perfis", 'Int'>
    readonly nome: FieldRef<"perfis", 'String'>
    readonly descricao: FieldRef<"perfis", 'String'>
  }
    

  // Custom InputTypes
  /**
   * perfis findUnique
   */
  export type perfisFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: perfisInclude<ExtArgs> | null
    /**
     * Filter, which perfis to fetch.
     */
    where: perfisWhereUniqueInput
  }

  /**
   * perfis findUniqueOrThrow
   */
  export type perfisFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: perfisInclude<ExtArgs> | null
    /**
     * Filter, which perfis to fetch.
     */
    where: perfisWhereUniqueInput
  }

  /**
   * perfis findFirst
   */
  export type perfisFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: perfisInclude<ExtArgs> | null
    /**
     * Filter, which perfis to fetch.
     */
    where?: perfisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of perfis to fetch.
     */
    orderBy?: perfisOrderByWithRelationInput | perfisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for perfis.
     */
    cursor?: perfisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` perfis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` perfis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of perfis.
     */
    distinct?: PerfisScalarFieldEnum | PerfisScalarFieldEnum[]
  }

  /**
   * perfis findFirstOrThrow
   */
  export type perfisFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: perfisInclude<ExtArgs> | null
    /**
     * Filter, which perfis to fetch.
     */
    where?: perfisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of perfis to fetch.
     */
    orderBy?: perfisOrderByWithRelationInput | perfisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for perfis.
     */
    cursor?: perfisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` perfis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` perfis.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of perfis.
     */
    distinct?: PerfisScalarFieldEnum | PerfisScalarFieldEnum[]
  }

  /**
   * perfis findMany
   */
  export type perfisFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: perfisInclude<ExtArgs> | null
    /**
     * Filter, which perfis to fetch.
     */
    where?: perfisWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of perfis to fetch.
     */
    orderBy?: perfisOrderByWithRelationInput | perfisOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing perfis.
     */
    cursor?: perfisWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` perfis from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` perfis.
     */
    skip?: number
    distinct?: PerfisScalarFieldEnum | PerfisScalarFieldEnum[]
  }

  /**
   * perfis create
   */
  export type perfisCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: perfisInclude<ExtArgs> | null
    /**
     * The data needed to create a perfis.
     */
    data: XOR<perfisCreateInput, perfisUncheckedCreateInput>
  }

  /**
   * perfis createMany
   */
  export type perfisCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many perfis.
     */
    data: perfisCreateManyInput | perfisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * perfis createManyAndReturn
   */
  export type perfisCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * The data used to create many perfis.
     */
    data: perfisCreateManyInput | perfisCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * perfis update
   */
  export type perfisUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: perfisInclude<ExtArgs> | null
    /**
     * The data needed to update a perfis.
     */
    data: XOR<perfisUpdateInput, perfisUncheckedUpdateInput>
    /**
     * Choose, which perfis to update.
     */
    where: perfisWhereUniqueInput
  }

  /**
   * perfis updateMany
   */
  export type perfisUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update perfis.
     */
    data: XOR<perfisUpdateManyMutationInput, perfisUncheckedUpdateManyInput>
    /**
     * Filter which perfis to update
     */
    where?: perfisWhereInput
    /**
     * Limit how many perfis to update.
     */
    limit?: number
  }

  /**
   * perfis updateManyAndReturn
   */
  export type perfisUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * The data used to update perfis.
     */
    data: XOR<perfisUpdateManyMutationInput, perfisUncheckedUpdateManyInput>
    /**
     * Filter which perfis to update
     */
    where?: perfisWhereInput
    /**
     * Limit how many perfis to update.
     */
    limit?: number
  }

  /**
   * perfis upsert
   */
  export type perfisUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: perfisInclude<ExtArgs> | null
    /**
     * The filter to search for the perfis to update in case it exists.
     */
    where: perfisWhereUniqueInput
    /**
     * In case the perfis found by the `where` argument doesn't exist, create a new perfis with this data.
     */
    create: XOR<perfisCreateInput, perfisUncheckedCreateInput>
    /**
     * In case the perfis was found with the provided `where` argument, update it with this data.
     */
    update: XOR<perfisUpdateInput, perfisUncheckedUpdateInput>
  }

  /**
   * perfis delete
   */
  export type perfisDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: perfisInclude<ExtArgs> | null
    /**
     * Filter which perfis to delete.
     */
    where: perfisWhereUniqueInput
  }

  /**
   * perfis deleteMany
   */
  export type perfisDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which perfis to delete
     */
    where?: perfisWhereInput
    /**
     * Limit how many perfis to delete.
     */
    limit?: number
  }

  /**
   * perfis.usuarios
   */
  export type perfis$usuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
    where?: usuariosWhereInput
    orderBy?: usuariosOrderByWithRelationInput | usuariosOrderByWithRelationInput[]
    cursor?: usuariosWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsuariosScalarFieldEnum | UsuariosScalarFieldEnum[]
  }

  /**
   * perfis without action
   */
  export type perfisDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the perfis
     */
    select?: perfisSelect<ExtArgs> | null
    /**
     * Omit specific fields from the perfis
     */
    omit?: perfisOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: perfisInclude<ExtArgs> | null
  }


  /**
   * Model unidades
   */

  export type AggregateUnidades = {
    _count: UnidadesCountAggregateOutputType | null
    _avg: UnidadesAvgAggregateOutputType | null
    _sum: UnidadesSumAggregateOutputType | null
    _min: UnidadesMinAggregateOutputType | null
    _max: UnidadesMaxAggregateOutputType | null
  }

  export type UnidadesAvgAggregateOutputType = {
    id: number | null
  }

  export type UnidadesSumAggregateOutputType = {
    id: number | null
  }

  export type UnidadesMinAggregateOutputType = {
    id: number | null
    nome: string | null
    tipo: $Enums.TipoUnidade | null
    endereco: string | null
    criado_em: Date | null
    atualizado_em: Date | null
  }

  export type UnidadesMaxAggregateOutputType = {
    id: number | null
    nome: string | null
    tipo: $Enums.TipoUnidade | null
    endereco: string | null
    criado_em: Date | null
    atualizado_em: Date | null
  }

  export type UnidadesCountAggregateOutputType = {
    id: number
    nome: number
    tipo: number
    endereco: number
    criado_em: number
    atualizado_em: number
    _all: number
  }


  export type UnidadesAvgAggregateInputType = {
    id?: true
  }

  export type UnidadesSumAggregateInputType = {
    id?: true
  }

  export type UnidadesMinAggregateInputType = {
    id?: true
    nome?: true
    tipo?: true
    endereco?: true
    criado_em?: true
    atualizado_em?: true
  }

  export type UnidadesMaxAggregateInputType = {
    id?: true
    nome?: true
    tipo?: true
    endereco?: true
    criado_em?: true
    atualizado_em?: true
  }

  export type UnidadesCountAggregateInputType = {
    id?: true
    nome?: true
    tipo?: true
    endereco?: true
    criado_em?: true
    atualizado_em?: true
    _all?: true
  }

  export type UnidadesAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which unidades to aggregate.
     */
    where?: unidadesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unidades to fetch.
     */
    orderBy?: unidadesOrderByWithRelationInput | unidadesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: unidadesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unidades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unidades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned unidades
    **/
    _count?: true | UnidadesCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UnidadesAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UnidadesSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UnidadesMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UnidadesMaxAggregateInputType
  }

  export type GetUnidadesAggregateType<T extends UnidadesAggregateArgs> = {
        [P in keyof T & keyof AggregateUnidades]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUnidades[P]>
      : GetScalarType<T[P], AggregateUnidades[P]>
  }




  export type unidadesGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: unidadesWhereInput
    orderBy?: unidadesOrderByWithAggregationInput | unidadesOrderByWithAggregationInput[]
    by: UnidadesScalarFieldEnum[] | UnidadesScalarFieldEnum
    having?: unidadesScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UnidadesCountAggregateInputType | true
    _avg?: UnidadesAvgAggregateInputType
    _sum?: UnidadesSumAggregateInputType
    _min?: UnidadesMinAggregateInputType
    _max?: UnidadesMaxAggregateInputType
  }

  export type UnidadesGroupByOutputType = {
    id: number
    nome: string
    tipo: $Enums.TipoUnidade
    endereco: string | null
    criado_em: Date
    atualizado_em: Date
    _count: UnidadesCountAggregateOutputType | null
    _avg: UnidadesAvgAggregateOutputType | null
    _sum: UnidadesSumAggregateOutputType | null
    _min: UnidadesMinAggregateOutputType | null
    _max: UnidadesMaxAggregateOutputType | null
  }

  type GetUnidadesGroupByPayload<T extends unidadesGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UnidadesGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UnidadesGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UnidadesGroupByOutputType[P]>
            : GetScalarType<T[P], UnidadesGroupByOutputType[P]>
        }
      >
    >


  export type unidadesSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    tipo?: boolean
    endereco?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
    usuarios?: boolean | unidades$usuariosArgs<ExtArgs>
    _count?: boolean | UnidadesCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["unidades"]>

  export type unidadesSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    tipo?: boolean
    endereco?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
  }, ExtArgs["result"]["unidades"]>

  export type unidadesSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    tipo?: boolean
    endereco?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
  }, ExtArgs["result"]["unidades"]>

  export type unidadesSelectScalar = {
    id?: boolean
    nome?: boolean
    tipo?: boolean
    endereco?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
  }

  export type unidadesOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "tipo" | "endereco" | "criado_em" | "atualizado_em", ExtArgs["result"]["unidades"]>
  export type unidadesInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    usuarios?: boolean | unidades$usuariosArgs<ExtArgs>
    _count?: boolean | UnidadesCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type unidadesIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type unidadesIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $unidadesPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "unidades"
    objects: {
      usuarios: Prisma.$usuariosPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nome: string
      tipo: $Enums.TipoUnidade
      endereco: string | null
      criado_em: Date
      atualizado_em: Date
    }, ExtArgs["result"]["unidades"]>
    composites: {}
  }

  type unidadesGetPayload<S extends boolean | null | undefined | unidadesDefaultArgs> = $Result.GetResult<Prisma.$unidadesPayload, S>

  type unidadesCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<unidadesFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UnidadesCountAggregateInputType | true
    }

  export interface unidadesDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['unidades'], meta: { name: 'unidades' } }
    /**
     * Find zero or one Unidades that matches the filter.
     * @param {unidadesFindUniqueArgs} args - Arguments to find a Unidades
     * @example
     * // Get one Unidades
     * const unidades = await prisma.unidades.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends unidadesFindUniqueArgs>(args: SelectSubset<T, unidadesFindUniqueArgs<ExtArgs>>): Prisma__unidadesClient<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Unidades that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {unidadesFindUniqueOrThrowArgs} args - Arguments to find a Unidades
     * @example
     * // Get one Unidades
     * const unidades = await prisma.unidades.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends unidadesFindUniqueOrThrowArgs>(args: SelectSubset<T, unidadesFindUniqueOrThrowArgs<ExtArgs>>): Prisma__unidadesClient<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Unidades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unidadesFindFirstArgs} args - Arguments to find a Unidades
     * @example
     * // Get one Unidades
     * const unidades = await prisma.unidades.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends unidadesFindFirstArgs>(args?: SelectSubset<T, unidadesFindFirstArgs<ExtArgs>>): Prisma__unidadesClient<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Unidades that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unidadesFindFirstOrThrowArgs} args - Arguments to find a Unidades
     * @example
     * // Get one Unidades
     * const unidades = await prisma.unidades.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends unidadesFindFirstOrThrowArgs>(args?: SelectSubset<T, unidadesFindFirstOrThrowArgs<ExtArgs>>): Prisma__unidadesClient<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Unidades that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unidadesFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Unidades
     * const unidades = await prisma.unidades.findMany()
     * 
     * // Get first 10 Unidades
     * const unidades = await prisma.unidades.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const unidadesWithIdOnly = await prisma.unidades.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends unidadesFindManyArgs>(args?: SelectSubset<T, unidadesFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Unidades.
     * @param {unidadesCreateArgs} args - Arguments to create a Unidades.
     * @example
     * // Create one Unidades
     * const Unidades = await prisma.unidades.create({
     *   data: {
     *     // ... data to create a Unidades
     *   }
     * })
     * 
     */
    create<T extends unidadesCreateArgs>(args: SelectSubset<T, unidadesCreateArgs<ExtArgs>>): Prisma__unidadesClient<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Unidades.
     * @param {unidadesCreateManyArgs} args - Arguments to create many Unidades.
     * @example
     * // Create many Unidades
     * const unidades = await prisma.unidades.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends unidadesCreateManyArgs>(args?: SelectSubset<T, unidadesCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Unidades and returns the data saved in the database.
     * @param {unidadesCreateManyAndReturnArgs} args - Arguments to create many Unidades.
     * @example
     * // Create many Unidades
     * const unidades = await prisma.unidades.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Unidades and only return the `id`
     * const unidadesWithIdOnly = await prisma.unidades.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends unidadesCreateManyAndReturnArgs>(args?: SelectSubset<T, unidadesCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Unidades.
     * @param {unidadesDeleteArgs} args - Arguments to delete one Unidades.
     * @example
     * // Delete one Unidades
     * const Unidades = await prisma.unidades.delete({
     *   where: {
     *     // ... filter to delete one Unidades
     *   }
     * })
     * 
     */
    delete<T extends unidadesDeleteArgs>(args: SelectSubset<T, unidadesDeleteArgs<ExtArgs>>): Prisma__unidadesClient<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Unidades.
     * @param {unidadesUpdateArgs} args - Arguments to update one Unidades.
     * @example
     * // Update one Unidades
     * const unidades = await prisma.unidades.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends unidadesUpdateArgs>(args: SelectSubset<T, unidadesUpdateArgs<ExtArgs>>): Prisma__unidadesClient<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Unidades.
     * @param {unidadesDeleteManyArgs} args - Arguments to filter Unidades to delete.
     * @example
     * // Delete a few Unidades
     * const { count } = await prisma.unidades.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends unidadesDeleteManyArgs>(args?: SelectSubset<T, unidadesDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Unidades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unidadesUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Unidades
     * const unidades = await prisma.unidades.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends unidadesUpdateManyArgs>(args: SelectSubset<T, unidadesUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Unidades and returns the data updated in the database.
     * @param {unidadesUpdateManyAndReturnArgs} args - Arguments to update many Unidades.
     * @example
     * // Update many Unidades
     * const unidades = await prisma.unidades.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Unidades and only return the `id`
     * const unidadesWithIdOnly = await prisma.unidades.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends unidadesUpdateManyAndReturnArgs>(args: SelectSubset<T, unidadesUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Unidades.
     * @param {unidadesUpsertArgs} args - Arguments to update or create a Unidades.
     * @example
     * // Update or create a Unidades
     * const unidades = await prisma.unidades.upsert({
     *   create: {
     *     // ... data to create a Unidades
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Unidades we want to update
     *   }
     * })
     */
    upsert<T extends unidadesUpsertArgs>(args: SelectSubset<T, unidadesUpsertArgs<ExtArgs>>): Prisma__unidadesClient<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Unidades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unidadesCountArgs} args - Arguments to filter Unidades to count.
     * @example
     * // Count the number of Unidades
     * const count = await prisma.unidades.count({
     *   where: {
     *     // ... the filter for the Unidades we want to count
     *   }
     * })
    **/
    count<T extends unidadesCountArgs>(
      args?: Subset<T, unidadesCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UnidadesCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Unidades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UnidadesAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UnidadesAggregateArgs>(args: Subset<T, UnidadesAggregateArgs>): Prisma.PrismaPromise<GetUnidadesAggregateType<T>>

    /**
     * Group by Unidades.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {unidadesGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends unidadesGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: unidadesGroupByArgs['orderBy'] }
        : { orderBy?: unidadesGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, unidadesGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUnidadesGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the unidades model
   */
  readonly fields: unidadesFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for unidades.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__unidadesClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    usuarios<T extends unidades$usuariosArgs<ExtArgs> = {}>(args?: Subset<T, unidades$usuariosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the unidades model
   */
  interface unidadesFieldRefs {
    readonly id: FieldRef<"unidades", 'Int'>
    readonly nome: FieldRef<"unidades", 'String'>
    readonly tipo: FieldRef<"unidades", 'TipoUnidade'>
    readonly endereco: FieldRef<"unidades", 'String'>
    readonly criado_em: FieldRef<"unidades", 'DateTime'>
    readonly atualizado_em: FieldRef<"unidades", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * unidades findUnique
   */
  export type unidadesFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: unidadesInclude<ExtArgs> | null
    /**
     * Filter, which unidades to fetch.
     */
    where: unidadesWhereUniqueInput
  }

  /**
   * unidades findUniqueOrThrow
   */
  export type unidadesFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: unidadesInclude<ExtArgs> | null
    /**
     * Filter, which unidades to fetch.
     */
    where: unidadesWhereUniqueInput
  }

  /**
   * unidades findFirst
   */
  export type unidadesFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: unidadesInclude<ExtArgs> | null
    /**
     * Filter, which unidades to fetch.
     */
    where?: unidadesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unidades to fetch.
     */
    orderBy?: unidadesOrderByWithRelationInput | unidadesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for unidades.
     */
    cursor?: unidadesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unidades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unidades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of unidades.
     */
    distinct?: UnidadesScalarFieldEnum | UnidadesScalarFieldEnum[]
  }

  /**
   * unidades findFirstOrThrow
   */
  export type unidadesFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: unidadesInclude<ExtArgs> | null
    /**
     * Filter, which unidades to fetch.
     */
    where?: unidadesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unidades to fetch.
     */
    orderBy?: unidadesOrderByWithRelationInput | unidadesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for unidades.
     */
    cursor?: unidadesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unidades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unidades.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of unidades.
     */
    distinct?: UnidadesScalarFieldEnum | UnidadesScalarFieldEnum[]
  }

  /**
   * unidades findMany
   */
  export type unidadesFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: unidadesInclude<ExtArgs> | null
    /**
     * Filter, which unidades to fetch.
     */
    where?: unidadesWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of unidades to fetch.
     */
    orderBy?: unidadesOrderByWithRelationInput | unidadesOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing unidades.
     */
    cursor?: unidadesWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` unidades from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` unidades.
     */
    skip?: number
    distinct?: UnidadesScalarFieldEnum | UnidadesScalarFieldEnum[]
  }

  /**
   * unidades create
   */
  export type unidadesCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: unidadesInclude<ExtArgs> | null
    /**
     * The data needed to create a unidades.
     */
    data: XOR<unidadesCreateInput, unidadesUncheckedCreateInput>
  }

  /**
   * unidades createMany
   */
  export type unidadesCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many unidades.
     */
    data: unidadesCreateManyInput | unidadesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * unidades createManyAndReturn
   */
  export type unidadesCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * The data used to create many unidades.
     */
    data: unidadesCreateManyInput | unidadesCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * unidades update
   */
  export type unidadesUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: unidadesInclude<ExtArgs> | null
    /**
     * The data needed to update a unidades.
     */
    data: XOR<unidadesUpdateInput, unidadesUncheckedUpdateInput>
    /**
     * Choose, which unidades to update.
     */
    where: unidadesWhereUniqueInput
  }

  /**
   * unidades updateMany
   */
  export type unidadesUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update unidades.
     */
    data: XOR<unidadesUpdateManyMutationInput, unidadesUncheckedUpdateManyInput>
    /**
     * Filter which unidades to update
     */
    where?: unidadesWhereInput
    /**
     * Limit how many unidades to update.
     */
    limit?: number
  }

  /**
   * unidades updateManyAndReturn
   */
  export type unidadesUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * The data used to update unidades.
     */
    data: XOR<unidadesUpdateManyMutationInput, unidadesUncheckedUpdateManyInput>
    /**
     * Filter which unidades to update
     */
    where?: unidadesWhereInput
    /**
     * Limit how many unidades to update.
     */
    limit?: number
  }

  /**
   * unidades upsert
   */
  export type unidadesUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: unidadesInclude<ExtArgs> | null
    /**
     * The filter to search for the unidades to update in case it exists.
     */
    where: unidadesWhereUniqueInput
    /**
     * In case the unidades found by the `where` argument doesn't exist, create a new unidades with this data.
     */
    create: XOR<unidadesCreateInput, unidadesUncheckedCreateInput>
    /**
     * In case the unidades was found with the provided `where` argument, update it with this data.
     */
    update: XOR<unidadesUpdateInput, unidadesUncheckedUpdateInput>
  }

  /**
   * unidades delete
   */
  export type unidadesDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: unidadesInclude<ExtArgs> | null
    /**
     * Filter which unidades to delete.
     */
    where: unidadesWhereUniqueInput
  }

  /**
   * unidades deleteMany
   */
  export type unidadesDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which unidades to delete
     */
    where?: unidadesWhereInput
    /**
     * Limit how many unidades to delete.
     */
    limit?: number
  }

  /**
   * unidades.usuarios
   */
  export type unidades$usuariosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
    where?: usuariosWhereInput
    orderBy?: usuariosOrderByWithRelationInput | usuariosOrderByWithRelationInput[]
    cursor?: usuariosWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsuariosScalarFieldEnum | UsuariosScalarFieldEnum[]
  }

  /**
   * unidades without action
   */
  export type unidadesDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: unidadesInclude<ExtArgs> | null
  }


  /**
   * Model usuarios
   */

  export type AggregateUsuarios = {
    _count: UsuariosCountAggregateOutputType | null
    _avg: UsuariosAvgAggregateOutputType | null
    _sum: UsuariosSumAggregateOutputType | null
    _min: UsuariosMinAggregateOutputType | null
    _max: UsuariosMaxAggregateOutputType | null
  }

  export type UsuariosAvgAggregateOutputType = {
    id: number | null
    perfil_id: number | null
    unidade_id: number | null
  }

  export type UsuariosSumAggregateOutputType = {
    id: number | null
    perfil_id: number | null
    unidade_id: number | null
  }

  export type UsuariosMinAggregateOutputType = {
    id: number | null
    nome: string | null
    email: string | null
    senha: string | null
    telefone: string | null
    perfil_id: number | null
    unidade_id: number | null
    status: boolean | null
    criado_em: Date | null
    atualizado_em: Date | null
  }

  export type UsuariosMaxAggregateOutputType = {
    id: number | null
    nome: string | null
    email: string | null
    senha: string | null
    telefone: string | null
    perfil_id: number | null
    unidade_id: number | null
    status: boolean | null
    criado_em: Date | null
    atualizado_em: Date | null
  }

  export type UsuariosCountAggregateOutputType = {
    id: number
    nome: number
    email: number
    senha: number
    telefone: number
    perfil_id: number
    unidade_id: number
    status: number
    criado_em: number
    atualizado_em: number
    _all: number
  }


  export type UsuariosAvgAggregateInputType = {
    id?: true
    perfil_id?: true
    unidade_id?: true
  }

  export type UsuariosSumAggregateInputType = {
    id?: true
    perfil_id?: true
    unidade_id?: true
  }

  export type UsuariosMinAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senha?: true
    telefone?: true
    perfil_id?: true
    unidade_id?: true
    status?: true
    criado_em?: true
    atualizado_em?: true
  }

  export type UsuariosMaxAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senha?: true
    telefone?: true
    perfil_id?: true
    unidade_id?: true
    status?: true
    criado_em?: true
    atualizado_em?: true
  }

  export type UsuariosCountAggregateInputType = {
    id?: true
    nome?: true
    email?: true
    senha?: true
    telefone?: true
    perfil_id?: true
    unidade_id?: true
    status?: true
    criado_em?: true
    atualizado_em?: true
    _all?: true
  }

  export type UsuariosAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which usuarios to aggregate.
     */
    where?: usuariosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of usuarios to fetch.
     */
    orderBy?: usuariosOrderByWithRelationInput | usuariosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: usuariosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned usuarios
    **/
    _count?: true | UsuariosCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsuariosAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsuariosSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsuariosMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsuariosMaxAggregateInputType
  }

  export type GetUsuariosAggregateType<T extends UsuariosAggregateArgs> = {
        [P in keyof T & keyof AggregateUsuarios]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsuarios[P]>
      : GetScalarType<T[P], AggregateUsuarios[P]>
  }




  export type usuariosGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: usuariosWhereInput
    orderBy?: usuariosOrderByWithAggregationInput | usuariosOrderByWithAggregationInput[]
    by: UsuariosScalarFieldEnum[] | UsuariosScalarFieldEnum
    having?: usuariosScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsuariosCountAggregateInputType | true
    _avg?: UsuariosAvgAggregateInputType
    _sum?: UsuariosSumAggregateInputType
    _min?: UsuariosMinAggregateInputType
    _max?: UsuariosMaxAggregateInputType
  }

  export type UsuariosGroupByOutputType = {
    id: number
    nome: string
    email: string
    senha: string
    telefone: string | null
    perfil_id: number
    unidade_id: number | null
    status: boolean
    criado_em: Date
    atualizado_em: Date
    _count: UsuariosCountAggregateOutputType | null
    _avg: UsuariosAvgAggregateOutputType | null
    _sum: UsuariosSumAggregateOutputType | null
    _min: UsuariosMinAggregateOutputType | null
    _max: UsuariosMaxAggregateOutputType | null
  }

  type GetUsuariosGroupByPayload<T extends usuariosGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsuariosGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsuariosGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsuariosGroupByOutputType[P]>
            : GetScalarType<T[P], UsuariosGroupByOutputType[P]>
        }
      >
    >


  export type usuariosSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    senha?: boolean
    telefone?: boolean
    perfil_id?: boolean
    unidade_id?: boolean
    status?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
    perfil?: boolean | perfisDefaultArgs<ExtArgs>
    unidade?: boolean | usuarios$unidadeArgs<ExtArgs>
  }, ExtArgs["result"]["usuarios"]>

  export type usuariosSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    senha?: boolean
    telefone?: boolean
    perfil_id?: boolean
    unidade_id?: boolean
    status?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
    perfil?: boolean | perfisDefaultArgs<ExtArgs>
    unidade?: boolean | usuarios$unidadeArgs<ExtArgs>
  }, ExtArgs["result"]["usuarios"]>

  export type usuariosSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    nome?: boolean
    email?: boolean
    senha?: boolean
    telefone?: boolean
    perfil_id?: boolean
    unidade_id?: boolean
    status?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
    perfil?: boolean | perfisDefaultArgs<ExtArgs>
    unidade?: boolean | usuarios$unidadeArgs<ExtArgs>
  }, ExtArgs["result"]["usuarios"]>

  export type usuariosSelectScalar = {
    id?: boolean
    nome?: boolean
    email?: boolean
    senha?: boolean
    telefone?: boolean
    perfil_id?: boolean
    unidade_id?: boolean
    status?: boolean
    criado_em?: boolean
    atualizado_em?: boolean
  }

  export type usuariosOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "nome" | "email" | "senha" | "telefone" | "perfil_id" | "unidade_id" | "status" | "criado_em" | "atualizado_em", ExtArgs["result"]["usuarios"]>
  export type usuariosInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    perfil?: boolean | perfisDefaultArgs<ExtArgs>
    unidade?: boolean | usuarios$unidadeArgs<ExtArgs>
  }
  export type usuariosIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    perfil?: boolean | perfisDefaultArgs<ExtArgs>
    unidade?: boolean | usuarios$unidadeArgs<ExtArgs>
  }
  export type usuariosIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    perfil?: boolean | perfisDefaultArgs<ExtArgs>
    unidade?: boolean | usuarios$unidadeArgs<ExtArgs>
  }

  export type $usuariosPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "usuarios"
    objects: {
      perfil: Prisma.$perfisPayload<ExtArgs>
      unidade: Prisma.$unidadesPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      nome: string
      email: string
      senha: string
      telefone: string | null
      perfil_id: number
      unidade_id: number | null
      status: boolean
      criado_em: Date
      atualizado_em: Date
    }, ExtArgs["result"]["usuarios"]>
    composites: {}
  }

  type usuariosGetPayload<S extends boolean | null | undefined | usuariosDefaultArgs> = $Result.GetResult<Prisma.$usuariosPayload, S>

  type usuariosCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<usuariosFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UsuariosCountAggregateInputType | true
    }

  export interface usuariosDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['usuarios'], meta: { name: 'usuarios' } }
    /**
     * Find zero or one Usuarios that matches the filter.
     * @param {usuariosFindUniqueArgs} args - Arguments to find a Usuarios
     * @example
     * // Get one Usuarios
     * const usuarios = await prisma.usuarios.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends usuariosFindUniqueArgs>(args: SelectSubset<T, usuariosFindUniqueArgs<ExtArgs>>): Prisma__usuariosClient<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Usuarios that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {usuariosFindUniqueOrThrowArgs} args - Arguments to find a Usuarios
     * @example
     * // Get one Usuarios
     * const usuarios = await prisma.usuarios.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends usuariosFindUniqueOrThrowArgs>(args: SelectSubset<T, usuariosFindUniqueOrThrowArgs<ExtArgs>>): Prisma__usuariosClient<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuariosFindFirstArgs} args - Arguments to find a Usuarios
     * @example
     * // Get one Usuarios
     * const usuarios = await prisma.usuarios.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends usuariosFindFirstArgs>(args?: SelectSubset<T, usuariosFindFirstArgs<ExtArgs>>): Prisma__usuariosClient<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Usuarios that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuariosFindFirstOrThrowArgs} args - Arguments to find a Usuarios
     * @example
     * // Get one Usuarios
     * const usuarios = await prisma.usuarios.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends usuariosFindFirstOrThrowArgs>(args?: SelectSubset<T, usuariosFindFirstOrThrowArgs<ExtArgs>>): Prisma__usuariosClient<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Usuarios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuariosFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Usuarios
     * const usuarios = await prisma.usuarios.findMany()
     * 
     * // Get first 10 Usuarios
     * const usuarios = await prisma.usuarios.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usuariosWithIdOnly = await prisma.usuarios.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends usuariosFindManyArgs>(args?: SelectSubset<T, usuariosFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Usuarios.
     * @param {usuariosCreateArgs} args - Arguments to create a Usuarios.
     * @example
     * // Create one Usuarios
     * const Usuarios = await prisma.usuarios.create({
     *   data: {
     *     // ... data to create a Usuarios
     *   }
     * })
     * 
     */
    create<T extends usuariosCreateArgs>(args: SelectSubset<T, usuariosCreateArgs<ExtArgs>>): Prisma__usuariosClient<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Usuarios.
     * @param {usuariosCreateManyArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuarios = await prisma.usuarios.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends usuariosCreateManyArgs>(args?: SelectSubset<T, usuariosCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Usuarios and returns the data saved in the database.
     * @param {usuariosCreateManyAndReturnArgs} args - Arguments to create many Usuarios.
     * @example
     * // Create many Usuarios
     * const usuarios = await prisma.usuarios.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Usuarios and only return the `id`
     * const usuariosWithIdOnly = await prisma.usuarios.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends usuariosCreateManyAndReturnArgs>(args?: SelectSubset<T, usuariosCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Usuarios.
     * @param {usuariosDeleteArgs} args - Arguments to delete one Usuarios.
     * @example
     * // Delete one Usuarios
     * const Usuarios = await prisma.usuarios.delete({
     *   where: {
     *     // ... filter to delete one Usuarios
     *   }
     * })
     * 
     */
    delete<T extends usuariosDeleteArgs>(args: SelectSubset<T, usuariosDeleteArgs<ExtArgs>>): Prisma__usuariosClient<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Usuarios.
     * @param {usuariosUpdateArgs} args - Arguments to update one Usuarios.
     * @example
     * // Update one Usuarios
     * const usuarios = await prisma.usuarios.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends usuariosUpdateArgs>(args: SelectSubset<T, usuariosUpdateArgs<ExtArgs>>): Prisma__usuariosClient<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Usuarios.
     * @param {usuariosDeleteManyArgs} args - Arguments to filter Usuarios to delete.
     * @example
     * // Delete a few Usuarios
     * const { count } = await prisma.usuarios.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends usuariosDeleteManyArgs>(args?: SelectSubset<T, usuariosDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuariosUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Usuarios
     * const usuarios = await prisma.usuarios.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends usuariosUpdateManyArgs>(args: SelectSubset<T, usuariosUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Usuarios and returns the data updated in the database.
     * @param {usuariosUpdateManyAndReturnArgs} args - Arguments to update many Usuarios.
     * @example
     * // Update many Usuarios
     * const usuarios = await prisma.usuarios.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Usuarios and only return the `id`
     * const usuariosWithIdOnly = await prisma.usuarios.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends usuariosUpdateManyAndReturnArgs>(args: SelectSubset<T, usuariosUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Usuarios.
     * @param {usuariosUpsertArgs} args - Arguments to update or create a Usuarios.
     * @example
     * // Update or create a Usuarios
     * const usuarios = await prisma.usuarios.upsert({
     *   create: {
     *     // ... data to create a Usuarios
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Usuarios we want to update
     *   }
     * })
     */
    upsert<T extends usuariosUpsertArgs>(args: SelectSubset<T, usuariosUpsertArgs<ExtArgs>>): Prisma__usuariosClient<$Result.GetResult<Prisma.$usuariosPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuariosCountArgs} args - Arguments to filter Usuarios to count.
     * @example
     * // Count the number of Usuarios
     * const count = await prisma.usuarios.count({
     *   where: {
     *     // ... the filter for the Usuarios we want to count
     *   }
     * })
    **/
    count<T extends usuariosCountArgs>(
      args?: Subset<T, usuariosCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsuariosCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsuariosAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsuariosAggregateArgs>(args: Subset<T, UsuariosAggregateArgs>): Prisma.PrismaPromise<GetUsuariosAggregateType<T>>

    /**
     * Group by Usuarios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {usuariosGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends usuariosGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: usuariosGroupByArgs['orderBy'] }
        : { orderBy?: usuariosGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, usuariosGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsuariosGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the usuarios model
   */
  readonly fields: usuariosFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for usuarios.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__usuariosClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    perfil<T extends perfisDefaultArgs<ExtArgs> = {}>(args?: Subset<T, perfisDefaultArgs<ExtArgs>>): Prisma__perfisClient<$Result.GetResult<Prisma.$perfisPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    unidade<T extends usuarios$unidadeArgs<ExtArgs> = {}>(args?: Subset<T, usuarios$unidadeArgs<ExtArgs>>): Prisma__unidadesClient<$Result.GetResult<Prisma.$unidadesPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the usuarios model
   */
  interface usuariosFieldRefs {
    readonly id: FieldRef<"usuarios", 'Int'>
    readonly nome: FieldRef<"usuarios", 'String'>
    readonly email: FieldRef<"usuarios", 'String'>
    readonly senha: FieldRef<"usuarios", 'String'>
    readonly telefone: FieldRef<"usuarios", 'String'>
    readonly perfil_id: FieldRef<"usuarios", 'Int'>
    readonly unidade_id: FieldRef<"usuarios", 'Int'>
    readonly status: FieldRef<"usuarios", 'Boolean'>
    readonly criado_em: FieldRef<"usuarios", 'DateTime'>
    readonly atualizado_em: FieldRef<"usuarios", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * usuarios findUnique
   */
  export type usuariosFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
    /**
     * Filter, which usuarios to fetch.
     */
    where: usuariosWhereUniqueInput
  }

  /**
   * usuarios findUniqueOrThrow
   */
  export type usuariosFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
    /**
     * Filter, which usuarios to fetch.
     */
    where: usuariosWhereUniqueInput
  }

  /**
   * usuarios findFirst
   */
  export type usuariosFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
    /**
     * Filter, which usuarios to fetch.
     */
    where?: usuariosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of usuarios to fetch.
     */
    orderBy?: usuariosOrderByWithRelationInput | usuariosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for usuarios.
     */
    cursor?: usuariosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of usuarios.
     */
    distinct?: UsuariosScalarFieldEnum | UsuariosScalarFieldEnum[]
  }

  /**
   * usuarios findFirstOrThrow
   */
  export type usuariosFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
    /**
     * Filter, which usuarios to fetch.
     */
    where?: usuariosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of usuarios to fetch.
     */
    orderBy?: usuariosOrderByWithRelationInput | usuariosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for usuarios.
     */
    cursor?: usuariosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` usuarios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of usuarios.
     */
    distinct?: UsuariosScalarFieldEnum | UsuariosScalarFieldEnum[]
  }

  /**
   * usuarios findMany
   */
  export type usuariosFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
    /**
     * Filter, which usuarios to fetch.
     */
    where?: usuariosWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of usuarios to fetch.
     */
    orderBy?: usuariosOrderByWithRelationInput | usuariosOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing usuarios.
     */
    cursor?: usuariosWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` usuarios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` usuarios.
     */
    skip?: number
    distinct?: UsuariosScalarFieldEnum | UsuariosScalarFieldEnum[]
  }

  /**
   * usuarios create
   */
  export type usuariosCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
    /**
     * The data needed to create a usuarios.
     */
    data: XOR<usuariosCreateInput, usuariosUncheckedCreateInput>
  }

  /**
   * usuarios createMany
   */
  export type usuariosCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many usuarios.
     */
    data: usuariosCreateManyInput | usuariosCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * usuarios createManyAndReturn
   */
  export type usuariosCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * The data used to create many usuarios.
     */
    data: usuariosCreateManyInput | usuariosCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * usuarios update
   */
  export type usuariosUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
    /**
     * The data needed to update a usuarios.
     */
    data: XOR<usuariosUpdateInput, usuariosUncheckedUpdateInput>
    /**
     * Choose, which usuarios to update.
     */
    where: usuariosWhereUniqueInput
  }

  /**
   * usuarios updateMany
   */
  export type usuariosUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update usuarios.
     */
    data: XOR<usuariosUpdateManyMutationInput, usuariosUncheckedUpdateManyInput>
    /**
     * Filter which usuarios to update
     */
    where?: usuariosWhereInput
    /**
     * Limit how many usuarios to update.
     */
    limit?: number
  }

  /**
   * usuarios updateManyAndReturn
   */
  export type usuariosUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * The data used to update usuarios.
     */
    data: XOR<usuariosUpdateManyMutationInput, usuariosUncheckedUpdateManyInput>
    /**
     * Filter which usuarios to update
     */
    where?: usuariosWhereInput
    /**
     * Limit how many usuarios to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * usuarios upsert
   */
  export type usuariosUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
    /**
     * The filter to search for the usuarios to update in case it exists.
     */
    where: usuariosWhereUniqueInput
    /**
     * In case the usuarios found by the `where` argument doesn't exist, create a new usuarios with this data.
     */
    create: XOR<usuariosCreateInput, usuariosUncheckedCreateInput>
    /**
     * In case the usuarios was found with the provided `where` argument, update it with this data.
     */
    update: XOR<usuariosUpdateInput, usuariosUncheckedUpdateInput>
  }

  /**
   * usuarios delete
   */
  export type usuariosDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
    /**
     * Filter which usuarios to delete.
     */
    where: usuariosWhereUniqueInput
  }

  /**
   * usuarios deleteMany
   */
  export type usuariosDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which usuarios to delete
     */
    where?: usuariosWhereInput
    /**
     * Limit how many usuarios to delete.
     */
    limit?: number
  }

  /**
   * usuarios.unidade
   */
  export type usuarios$unidadeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the unidades
     */
    select?: unidadesSelect<ExtArgs> | null
    /**
     * Omit specific fields from the unidades
     */
    omit?: unidadesOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: unidadesInclude<ExtArgs> | null
    where?: unidadesWhereInput
  }

  /**
   * usuarios without action
   */
  export type usuariosDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the usuarios
     */
    select?: usuariosSelect<ExtArgs> | null
    /**
     * Omit specific fields from the usuarios
     */
    omit?: usuariosOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: usuariosInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const PerfisScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    descricao: 'descricao'
  };

  export type PerfisScalarFieldEnum = (typeof PerfisScalarFieldEnum)[keyof typeof PerfisScalarFieldEnum]


  export const UnidadesScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    tipo: 'tipo',
    endereco: 'endereco',
    criado_em: 'criado_em',
    atualizado_em: 'atualizado_em'
  };

  export type UnidadesScalarFieldEnum = (typeof UnidadesScalarFieldEnum)[keyof typeof UnidadesScalarFieldEnum]


  export const UsuariosScalarFieldEnum: {
    id: 'id',
    nome: 'nome',
    email: 'email',
    senha: 'senha',
    telefone: 'telefone',
    perfil_id: 'perfil_id',
    unidade_id: 'unidade_id',
    status: 'status',
    criado_em: 'criado_em',
    atualizado_em: 'atualizado_em'
  };

  export type UsuariosScalarFieldEnum = (typeof UsuariosScalarFieldEnum)[keyof typeof UsuariosScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'TipoUnidade'
   */
  export type EnumTipoUnidadeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoUnidade'>
    


  /**
   * Reference to a field of type 'TipoUnidade[]'
   */
  export type ListEnumTipoUnidadeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TipoUnidade[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type perfisWhereInput = {
    AND?: perfisWhereInput | perfisWhereInput[]
    OR?: perfisWhereInput[]
    NOT?: perfisWhereInput | perfisWhereInput[]
    id?: IntFilter<"perfis"> | number
    nome?: StringFilter<"perfis"> | string
    descricao?: StringNullableFilter<"perfis"> | string | null
    usuarios?: UsuariosListRelationFilter
  }

  export type perfisOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    descricao?: SortOrderInput | SortOrder
    usuarios?: usuariosOrderByRelationAggregateInput
  }

  export type perfisWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    nome?: string
    AND?: perfisWhereInput | perfisWhereInput[]
    OR?: perfisWhereInput[]
    NOT?: perfisWhereInput | perfisWhereInput[]
    descricao?: StringNullableFilter<"perfis"> | string | null
    usuarios?: UsuariosListRelationFilter
  }, "id" | "nome">

  export type perfisOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    descricao?: SortOrderInput | SortOrder
    _count?: perfisCountOrderByAggregateInput
    _avg?: perfisAvgOrderByAggregateInput
    _max?: perfisMaxOrderByAggregateInput
    _min?: perfisMinOrderByAggregateInput
    _sum?: perfisSumOrderByAggregateInput
  }

  export type perfisScalarWhereWithAggregatesInput = {
    AND?: perfisScalarWhereWithAggregatesInput | perfisScalarWhereWithAggregatesInput[]
    OR?: perfisScalarWhereWithAggregatesInput[]
    NOT?: perfisScalarWhereWithAggregatesInput | perfisScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"perfis"> | number
    nome?: StringWithAggregatesFilter<"perfis"> | string
    descricao?: StringNullableWithAggregatesFilter<"perfis"> | string | null
  }

  export type unidadesWhereInput = {
    AND?: unidadesWhereInput | unidadesWhereInput[]
    OR?: unidadesWhereInput[]
    NOT?: unidadesWhereInput | unidadesWhereInput[]
    id?: IntFilter<"unidades"> | number
    nome?: StringFilter<"unidades"> | string
    tipo?: EnumTipoUnidadeFilter<"unidades"> | $Enums.TipoUnidade
    endereco?: StringNullableFilter<"unidades"> | string | null
    criado_em?: DateTimeFilter<"unidades"> | Date | string
    atualizado_em?: DateTimeFilter<"unidades"> | Date | string
    usuarios?: UsuariosListRelationFilter
  }

  export type unidadesOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    endereco?: SortOrderInput | SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
    usuarios?: usuariosOrderByRelationAggregateInput
  }

  export type unidadesWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    AND?: unidadesWhereInput | unidadesWhereInput[]
    OR?: unidadesWhereInput[]
    NOT?: unidadesWhereInput | unidadesWhereInput[]
    nome?: StringFilter<"unidades"> | string
    tipo?: EnumTipoUnidadeFilter<"unidades"> | $Enums.TipoUnidade
    endereco?: StringNullableFilter<"unidades"> | string | null
    criado_em?: DateTimeFilter<"unidades"> | Date | string
    atualizado_em?: DateTimeFilter<"unidades"> | Date | string
    usuarios?: UsuariosListRelationFilter
  }, "id">

  export type unidadesOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    endereco?: SortOrderInput | SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
    _count?: unidadesCountOrderByAggregateInput
    _avg?: unidadesAvgOrderByAggregateInput
    _max?: unidadesMaxOrderByAggregateInput
    _min?: unidadesMinOrderByAggregateInput
    _sum?: unidadesSumOrderByAggregateInput
  }

  export type unidadesScalarWhereWithAggregatesInput = {
    AND?: unidadesScalarWhereWithAggregatesInput | unidadesScalarWhereWithAggregatesInput[]
    OR?: unidadesScalarWhereWithAggregatesInput[]
    NOT?: unidadesScalarWhereWithAggregatesInput | unidadesScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"unidades"> | number
    nome?: StringWithAggregatesFilter<"unidades"> | string
    tipo?: EnumTipoUnidadeWithAggregatesFilter<"unidades"> | $Enums.TipoUnidade
    endereco?: StringNullableWithAggregatesFilter<"unidades"> | string | null
    criado_em?: DateTimeWithAggregatesFilter<"unidades"> | Date | string
    atualizado_em?: DateTimeWithAggregatesFilter<"unidades"> | Date | string
  }

  export type usuariosWhereInput = {
    AND?: usuariosWhereInput | usuariosWhereInput[]
    OR?: usuariosWhereInput[]
    NOT?: usuariosWhereInput | usuariosWhereInput[]
    id?: IntFilter<"usuarios"> | number
    nome?: StringFilter<"usuarios"> | string
    email?: StringFilter<"usuarios"> | string
    senha?: StringFilter<"usuarios"> | string
    telefone?: StringNullableFilter<"usuarios"> | string | null
    perfil_id?: IntFilter<"usuarios"> | number
    unidade_id?: IntNullableFilter<"usuarios"> | number | null
    status?: BoolFilter<"usuarios"> | boolean
    criado_em?: DateTimeFilter<"usuarios"> | Date | string
    atualizado_em?: DateTimeFilter<"usuarios"> | Date | string
    perfil?: XOR<PerfisScalarRelationFilter, perfisWhereInput>
    unidade?: XOR<UnidadesNullableScalarRelationFilter, unidadesWhereInput> | null
  }

  export type usuariosOrderByWithRelationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senha?: SortOrder
    telefone?: SortOrderInput | SortOrder
    perfil_id?: SortOrder
    unidade_id?: SortOrderInput | SortOrder
    status?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
    perfil?: perfisOrderByWithRelationInput
    unidade?: unidadesOrderByWithRelationInput
  }

  export type usuariosWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    email?: string
    AND?: usuariosWhereInput | usuariosWhereInput[]
    OR?: usuariosWhereInput[]
    NOT?: usuariosWhereInput | usuariosWhereInput[]
    nome?: StringFilter<"usuarios"> | string
    senha?: StringFilter<"usuarios"> | string
    telefone?: StringNullableFilter<"usuarios"> | string | null
    perfil_id?: IntFilter<"usuarios"> | number
    unidade_id?: IntNullableFilter<"usuarios"> | number | null
    status?: BoolFilter<"usuarios"> | boolean
    criado_em?: DateTimeFilter<"usuarios"> | Date | string
    atualizado_em?: DateTimeFilter<"usuarios"> | Date | string
    perfil?: XOR<PerfisScalarRelationFilter, perfisWhereInput>
    unidade?: XOR<UnidadesNullableScalarRelationFilter, unidadesWhereInput> | null
  }, "id" | "email">

  export type usuariosOrderByWithAggregationInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senha?: SortOrder
    telefone?: SortOrderInput | SortOrder
    perfil_id?: SortOrder
    unidade_id?: SortOrderInput | SortOrder
    status?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
    _count?: usuariosCountOrderByAggregateInput
    _avg?: usuariosAvgOrderByAggregateInput
    _max?: usuariosMaxOrderByAggregateInput
    _min?: usuariosMinOrderByAggregateInput
    _sum?: usuariosSumOrderByAggregateInput
  }

  export type usuariosScalarWhereWithAggregatesInput = {
    AND?: usuariosScalarWhereWithAggregatesInput | usuariosScalarWhereWithAggregatesInput[]
    OR?: usuariosScalarWhereWithAggregatesInput[]
    NOT?: usuariosScalarWhereWithAggregatesInput | usuariosScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"usuarios"> | number
    nome?: StringWithAggregatesFilter<"usuarios"> | string
    email?: StringWithAggregatesFilter<"usuarios"> | string
    senha?: StringWithAggregatesFilter<"usuarios"> | string
    telefone?: StringNullableWithAggregatesFilter<"usuarios"> | string | null
    perfil_id?: IntWithAggregatesFilter<"usuarios"> | number
    unidade_id?: IntNullableWithAggregatesFilter<"usuarios"> | number | null
    status?: BoolWithAggregatesFilter<"usuarios"> | boolean
    criado_em?: DateTimeWithAggregatesFilter<"usuarios"> | Date | string
    atualizado_em?: DateTimeWithAggregatesFilter<"usuarios"> | Date | string
  }

  export type perfisCreateInput = {
    nome: string
    descricao?: string | null
    usuarios?: usuariosCreateNestedManyWithoutPerfilInput
  }

  export type perfisUncheckedCreateInput = {
    id?: number
    nome: string
    descricao?: string | null
    usuarios?: usuariosUncheckedCreateNestedManyWithoutPerfilInput
  }

  export type perfisUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    usuarios?: usuariosUpdateManyWithoutPerfilNestedInput
  }

  export type perfisUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
    usuarios?: usuariosUncheckedUpdateManyWithoutPerfilNestedInput
  }

  export type perfisCreateManyInput = {
    id?: number
    nome: string
    descricao?: string | null
  }

  export type perfisUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type perfisUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type unidadesCreateInput = {
    nome: string
    tipo: $Enums.TipoUnidade
    endereco?: string | null
    criado_em?: Date | string
    atualizado_em?: Date | string
    usuarios?: usuariosCreateNestedManyWithoutUnidadeInput
  }

  export type unidadesUncheckedCreateInput = {
    id?: number
    nome: string
    tipo: $Enums.TipoUnidade
    endereco?: string | null
    criado_em?: Date | string
    atualizado_em?: Date | string
    usuarios?: usuariosUncheckedCreateNestedManyWithoutUnidadeInput
  }

  export type unidadesUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoUnidadeFieldUpdateOperationsInput | $Enums.TipoUnidade
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: usuariosUpdateManyWithoutUnidadeNestedInput
  }

  export type unidadesUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoUnidadeFieldUpdateOperationsInput | $Enums.TipoUnidade
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    usuarios?: usuariosUncheckedUpdateManyWithoutUnidadeNestedInput
  }

  export type unidadesCreateManyInput = {
    id?: number
    nome: string
    tipo: $Enums.TipoUnidade
    endereco?: string | null
    criado_em?: Date | string
    atualizado_em?: Date | string
  }

  export type unidadesUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoUnidadeFieldUpdateOperationsInput | $Enums.TipoUnidade
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type unidadesUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoUnidadeFieldUpdateOperationsInput | $Enums.TipoUnidade
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usuariosCreateInput = {
    nome: string
    email: string
    senha: string
    telefone?: string | null
    status?: boolean
    criado_em?: Date | string
    atualizado_em?: Date | string
    perfil: perfisCreateNestedOneWithoutUsuariosInput
    unidade?: unidadesCreateNestedOneWithoutUsuariosInput
  }

  export type usuariosUncheckedCreateInput = {
    id?: number
    nome: string
    email: string
    senha: string
    telefone?: string | null
    perfil_id: number
    unidade_id?: number | null
    status?: boolean
    criado_em?: Date | string
    atualizado_em?: Date | string
  }

  export type usuariosUpdateInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    perfil?: perfisUpdateOneRequiredWithoutUsuariosNestedInput
    unidade?: unidadesUpdateOneWithoutUsuariosNestedInput
  }

  export type usuariosUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    perfil_id?: IntFieldUpdateOperationsInput | number
    unidade_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: BoolFieldUpdateOperationsInput | boolean
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usuariosCreateManyInput = {
    id?: number
    nome: string
    email: string
    senha: string
    telefone?: string | null
    perfil_id: number
    unidade_id?: number | null
    status?: boolean
    criado_em?: Date | string
    atualizado_em?: Date | string
  }

  export type usuariosUpdateManyMutationInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usuariosUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    perfil_id?: IntFieldUpdateOperationsInput | number
    unidade_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: BoolFieldUpdateOperationsInput | boolean
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type UsuariosListRelationFilter = {
    every?: usuariosWhereInput
    some?: usuariosWhereInput
    none?: usuariosWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type usuariosOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type perfisCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
  }

  export type perfisAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type perfisMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
  }

  export type perfisMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    descricao?: SortOrder
  }

  export type perfisSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumTipoUnidadeFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoUnidade | EnumTipoUnidadeFieldRefInput<$PrismaModel>
    in?: $Enums.TipoUnidade[] | ListEnumTipoUnidadeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoUnidade[] | ListEnumTipoUnidadeFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoUnidadeFilter<$PrismaModel> | $Enums.TipoUnidade
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type unidadesCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    endereco?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
  }

  export type unidadesAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type unidadesMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    endereco?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
  }

  export type unidadesMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    tipo?: SortOrder
    endereco?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
  }

  export type unidadesSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type EnumTipoUnidadeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoUnidade | EnumTipoUnidadeFieldRefInput<$PrismaModel>
    in?: $Enums.TipoUnidade[] | ListEnumTipoUnidadeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoUnidade[] | ListEnumTipoUnidadeFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoUnidadeWithAggregatesFilter<$PrismaModel> | $Enums.TipoUnidade
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoUnidadeFilter<$PrismaModel>
    _max?: NestedEnumTipoUnidadeFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type PerfisScalarRelationFilter = {
    is?: perfisWhereInput
    isNot?: perfisWhereInput
  }

  export type UnidadesNullableScalarRelationFilter = {
    is?: unidadesWhereInput | null
    isNot?: unidadesWhereInput | null
  }

  export type usuariosCountOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senha?: SortOrder
    telefone?: SortOrder
    perfil_id?: SortOrder
    unidade_id?: SortOrder
    status?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
  }

  export type usuariosAvgOrderByAggregateInput = {
    id?: SortOrder
    perfil_id?: SortOrder
    unidade_id?: SortOrder
  }

  export type usuariosMaxOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senha?: SortOrder
    telefone?: SortOrder
    perfil_id?: SortOrder
    unidade_id?: SortOrder
    status?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
  }

  export type usuariosMinOrderByAggregateInput = {
    id?: SortOrder
    nome?: SortOrder
    email?: SortOrder
    senha?: SortOrder
    telefone?: SortOrder
    perfil_id?: SortOrder
    unidade_id?: SortOrder
    status?: SortOrder
    criado_em?: SortOrder
    atualizado_em?: SortOrder
  }

  export type usuariosSumOrderByAggregateInput = {
    id?: SortOrder
    perfil_id?: SortOrder
    unidade_id?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type usuariosCreateNestedManyWithoutPerfilInput = {
    create?: XOR<usuariosCreateWithoutPerfilInput, usuariosUncheckedCreateWithoutPerfilInput> | usuariosCreateWithoutPerfilInput[] | usuariosUncheckedCreateWithoutPerfilInput[]
    connectOrCreate?: usuariosCreateOrConnectWithoutPerfilInput | usuariosCreateOrConnectWithoutPerfilInput[]
    createMany?: usuariosCreateManyPerfilInputEnvelope
    connect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
  }

  export type usuariosUncheckedCreateNestedManyWithoutPerfilInput = {
    create?: XOR<usuariosCreateWithoutPerfilInput, usuariosUncheckedCreateWithoutPerfilInput> | usuariosCreateWithoutPerfilInput[] | usuariosUncheckedCreateWithoutPerfilInput[]
    connectOrCreate?: usuariosCreateOrConnectWithoutPerfilInput | usuariosCreateOrConnectWithoutPerfilInput[]
    createMany?: usuariosCreateManyPerfilInputEnvelope
    connect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type usuariosUpdateManyWithoutPerfilNestedInput = {
    create?: XOR<usuariosCreateWithoutPerfilInput, usuariosUncheckedCreateWithoutPerfilInput> | usuariosCreateWithoutPerfilInput[] | usuariosUncheckedCreateWithoutPerfilInput[]
    connectOrCreate?: usuariosCreateOrConnectWithoutPerfilInput | usuariosCreateOrConnectWithoutPerfilInput[]
    upsert?: usuariosUpsertWithWhereUniqueWithoutPerfilInput | usuariosUpsertWithWhereUniqueWithoutPerfilInput[]
    createMany?: usuariosCreateManyPerfilInputEnvelope
    set?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    disconnect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    delete?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    connect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    update?: usuariosUpdateWithWhereUniqueWithoutPerfilInput | usuariosUpdateWithWhereUniqueWithoutPerfilInput[]
    updateMany?: usuariosUpdateManyWithWhereWithoutPerfilInput | usuariosUpdateManyWithWhereWithoutPerfilInput[]
    deleteMany?: usuariosScalarWhereInput | usuariosScalarWhereInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type usuariosUncheckedUpdateManyWithoutPerfilNestedInput = {
    create?: XOR<usuariosCreateWithoutPerfilInput, usuariosUncheckedCreateWithoutPerfilInput> | usuariosCreateWithoutPerfilInput[] | usuariosUncheckedCreateWithoutPerfilInput[]
    connectOrCreate?: usuariosCreateOrConnectWithoutPerfilInput | usuariosCreateOrConnectWithoutPerfilInput[]
    upsert?: usuariosUpsertWithWhereUniqueWithoutPerfilInput | usuariosUpsertWithWhereUniqueWithoutPerfilInput[]
    createMany?: usuariosCreateManyPerfilInputEnvelope
    set?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    disconnect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    delete?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    connect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    update?: usuariosUpdateWithWhereUniqueWithoutPerfilInput | usuariosUpdateWithWhereUniqueWithoutPerfilInput[]
    updateMany?: usuariosUpdateManyWithWhereWithoutPerfilInput | usuariosUpdateManyWithWhereWithoutPerfilInput[]
    deleteMany?: usuariosScalarWhereInput | usuariosScalarWhereInput[]
  }

  export type usuariosCreateNestedManyWithoutUnidadeInput = {
    create?: XOR<usuariosCreateWithoutUnidadeInput, usuariosUncheckedCreateWithoutUnidadeInput> | usuariosCreateWithoutUnidadeInput[] | usuariosUncheckedCreateWithoutUnidadeInput[]
    connectOrCreate?: usuariosCreateOrConnectWithoutUnidadeInput | usuariosCreateOrConnectWithoutUnidadeInput[]
    createMany?: usuariosCreateManyUnidadeInputEnvelope
    connect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
  }

  export type usuariosUncheckedCreateNestedManyWithoutUnidadeInput = {
    create?: XOR<usuariosCreateWithoutUnidadeInput, usuariosUncheckedCreateWithoutUnidadeInput> | usuariosCreateWithoutUnidadeInput[] | usuariosUncheckedCreateWithoutUnidadeInput[]
    connectOrCreate?: usuariosCreateOrConnectWithoutUnidadeInput | usuariosCreateOrConnectWithoutUnidadeInput[]
    createMany?: usuariosCreateManyUnidadeInputEnvelope
    connect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
  }

  export type EnumTipoUnidadeFieldUpdateOperationsInput = {
    set?: $Enums.TipoUnidade
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type usuariosUpdateManyWithoutUnidadeNestedInput = {
    create?: XOR<usuariosCreateWithoutUnidadeInput, usuariosUncheckedCreateWithoutUnidadeInput> | usuariosCreateWithoutUnidadeInput[] | usuariosUncheckedCreateWithoutUnidadeInput[]
    connectOrCreate?: usuariosCreateOrConnectWithoutUnidadeInput | usuariosCreateOrConnectWithoutUnidadeInput[]
    upsert?: usuariosUpsertWithWhereUniqueWithoutUnidadeInput | usuariosUpsertWithWhereUniqueWithoutUnidadeInput[]
    createMany?: usuariosCreateManyUnidadeInputEnvelope
    set?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    disconnect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    delete?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    connect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    update?: usuariosUpdateWithWhereUniqueWithoutUnidadeInput | usuariosUpdateWithWhereUniqueWithoutUnidadeInput[]
    updateMany?: usuariosUpdateManyWithWhereWithoutUnidadeInput | usuariosUpdateManyWithWhereWithoutUnidadeInput[]
    deleteMany?: usuariosScalarWhereInput | usuariosScalarWhereInput[]
  }

  export type usuariosUncheckedUpdateManyWithoutUnidadeNestedInput = {
    create?: XOR<usuariosCreateWithoutUnidadeInput, usuariosUncheckedCreateWithoutUnidadeInput> | usuariosCreateWithoutUnidadeInput[] | usuariosUncheckedCreateWithoutUnidadeInput[]
    connectOrCreate?: usuariosCreateOrConnectWithoutUnidadeInput | usuariosCreateOrConnectWithoutUnidadeInput[]
    upsert?: usuariosUpsertWithWhereUniqueWithoutUnidadeInput | usuariosUpsertWithWhereUniqueWithoutUnidadeInput[]
    createMany?: usuariosCreateManyUnidadeInputEnvelope
    set?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    disconnect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    delete?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    connect?: usuariosWhereUniqueInput | usuariosWhereUniqueInput[]
    update?: usuariosUpdateWithWhereUniqueWithoutUnidadeInput | usuariosUpdateWithWhereUniqueWithoutUnidadeInput[]
    updateMany?: usuariosUpdateManyWithWhereWithoutUnidadeInput | usuariosUpdateManyWithWhereWithoutUnidadeInput[]
    deleteMany?: usuariosScalarWhereInput | usuariosScalarWhereInput[]
  }

  export type perfisCreateNestedOneWithoutUsuariosInput = {
    create?: XOR<perfisCreateWithoutUsuariosInput, perfisUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: perfisCreateOrConnectWithoutUsuariosInput
    connect?: perfisWhereUniqueInput
  }

  export type unidadesCreateNestedOneWithoutUsuariosInput = {
    create?: XOR<unidadesCreateWithoutUsuariosInput, unidadesUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: unidadesCreateOrConnectWithoutUsuariosInput
    connect?: unidadesWhereUniqueInput
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type perfisUpdateOneRequiredWithoutUsuariosNestedInput = {
    create?: XOR<perfisCreateWithoutUsuariosInput, perfisUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: perfisCreateOrConnectWithoutUsuariosInput
    upsert?: perfisUpsertWithoutUsuariosInput
    connect?: perfisWhereUniqueInput
    update?: XOR<XOR<perfisUpdateToOneWithWhereWithoutUsuariosInput, perfisUpdateWithoutUsuariosInput>, perfisUncheckedUpdateWithoutUsuariosInput>
  }

  export type unidadesUpdateOneWithoutUsuariosNestedInput = {
    create?: XOR<unidadesCreateWithoutUsuariosInput, unidadesUncheckedCreateWithoutUsuariosInput>
    connectOrCreate?: unidadesCreateOrConnectWithoutUsuariosInput
    upsert?: unidadesUpsertWithoutUsuariosInput
    disconnect?: unidadesWhereInput | boolean
    delete?: unidadesWhereInput | boolean
    connect?: unidadesWhereUniqueInput
    update?: XOR<XOR<unidadesUpdateToOneWithWhereWithoutUsuariosInput, unidadesUpdateWithoutUsuariosInput>, unidadesUncheckedUpdateWithoutUsuariosInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumTipoUnidadeFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoUnidade | EnumTipoUnidadeFieldRefInput<$PrismaModel>
    in?: $Enums.TipoUnidade[] | ListEnumTipoUnidadeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoUnidade[] | ListEnumTipoUnidadeFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoUnidadeFilter<$PrismaModel> | $Enums.TipoUnidade
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedEnumTipoUnidadeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TipoUnidade | EnumTipoUnidadeFieldRefInput<$PrismaModel>
    in?: $Enums.TipoUnidade[] | ListEnumTipoUnidadeFieldRefInput<$PrismaModel>
    notIn?: $Enums.TipoUnidade[] | ListEnumTipoUnidadeFieldRefInput<$PrismaModel>
    not?: NestedEnumTipoUnidadeWithAggregatesFilter<$PrismaModel> | $Enums.TipoUnidade
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTipoUnidadeFilter<$PrismaModel>
    _max?: NestedEnumTipoUnidadeFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type usuariosCreateWithoutPerfilInput = {
    nome: string
    email: string
    senha: string
    telefone?: string | null
    status?: boolean
    criado_em?: Date | string
    atualizado_em?: Date | string
    unidade?: unidadesCreateNestedOneWithoutUsuariosInput
  }

  export type usuariosUncheckedCreateWithoutPerfilInput = {
    id?: number
    nome: string
    email: string
    senha: string
    telefone?: string | null
    unidade_id?: number | null
    status?: boolean
    criado_em?: Date | string
    atualizado_em?: Date | string
  }

  export type usuariosCreateOrConnectWithoutPerfilInput = {
    where: usuariosWhereUniqueInput
    create: XOR<usuariosCreateWithoutPerfilInput, usuariosUncheckedCreateWithoutPerfilInput>
  }

  export type usuariosCreateManyPerfilInputEnvelope = {
    data: usuariosCreateManyPerfilInput | usuariosCreateManyPerfilInput[]
    skipDuplicates?: boolean
  }

  export type usuariosUpsertWithWhereUniqueWithoutPerfilInput = {
    where: usuariosWhereUniqueInput
    update: XOR<usuariosUpdateWithoutPerfilInput, usuariosUncheckedUpdateWithoutPerfilInput>
    create: XOR<usuariosCreateWithoutPerfilInput, usuariosUncheckedCreateWithoutPerfilInput>
  }

  export type usuariosUpdateWithWhereUniqueWithoutPerfilInput = {
    where: usuariosWhereUniqueInput
    data: XOR<usuariosUpdateWithoutPerfilInput, usuariosUncheckedUpdateWithoutPerfilInput>
  }

  export type usuariosUpdateManyWithWhereWithoutPerfilInput = {
    where: usuariosScalarWhereInput
    data: XOR<usuariosUpdateManyMutationInput, usuariosUncheckedUpdateManyWithoutPerfilInput>
  }

  export type usuariosScalarWhereInput = {
    AND?: usuariosScalarWhereInput | usuariosScalarWhereInput[]
    OR?: usuariosScalarWhereInput[]
    NOT?: usuariosScalarWhereInput | usuariosScalarWhereInput[]
    id?: IntFilter<"usuarios"> | number
    nome?: StringFilter<"usuarios"> | string
    email?: StringFilter<"usuarios"> | string
    senha?: StringFilter<"usuarios"> | string
    telefone?: StringNullableFilter<"usuarios"> | string | null
    perfil_id?: IntFilter<"usuarios"> | number
    unidade_id?: IntNullableFilter<"usuarios"> | number | null
    status?: BoolFilter<"usuarios"> | boolean
    criado_em?: DateTimeFilter<"usuarios"> | Date | string
    atualizado_em?: DateTimeFilter<"usuarios"> | Date | string
  }

  export type usuariosCreateWithoutUnidadeInput = {
    nome: string
    email: string
    senha: string
    telefone?: string | null
    status?: boolean
    criado_em?: Date | string
    atualizado_em?: Date | string
    perfil: perfisCreateNestedOneWithoutUsuariosInput
  }

  export type usuariosUncheckedCreateWithoutUnidadeInput = {
    id?: number
    nome: string
    email: string
    senha: string
    telefone?: string | null
    perfil_id: number
    status?: boolean
    criado_em?: Date | string
    atualizado_em?: Date | string
  }

  export type usuariosCreateOrConnectWithoutUnidadeInput = {
    where: usuariosWhereUniqueInput
    create: XOR<usuariosCreateWithoutUnidadeInput, usuariosUncheckedCreateWithoutUnidadeInput>
  }

  export type usuariosCreateManyUnidadeInputEnvelope = {
    data: usuariosCreateManyUnidadeInput | usuariosCreateManyUnidadeInput[]
    skipDuplicates?: boolean
  }

  export type usuariosUpsertWithWhereUniqueWithoutUnidadeInput = {
    where: usuariosWhereUniqueInput
    update: XOR<usuariosUpdateWithoutUnidadeInput, usuariosUncheckedUpdateWithoutUnidadeInput>
    create: XOR<usuariosCreateWithoutUnidadeInput, usuariosUncheckedCreateWithoutUnidadeInput>
  }

  export type usuariosUpdateWithWhereUniqueWithoutUnidadeInput = {
    where: usuariosWhereUniqueInput
    data: XOR<usuariosUpdateWithoutUnidadeInput, usuariosUncheckedUpdateWithoutUnidadeInput>
  }

  export type usuariosUpdateManyWithWhereWithoutUnidadeInput = {
    where: usuariosScalarWhereInput
    data: XOR<usuariosUpdateManyMutationInput, usuariosUncheckedUpdateManyWithoutUnidadeInput>
  }

  export type perfisCreateWithoutUsuariosInput = {
    nome: string
    descricao?: string | null
  }

  export type perfisUncheckedCreateWithoutUsuariosInput = {
    id?: number
    nome: string
    descricao?: string | null
  }

  export type perfisCreateOrConnectWithoutUsuariosInput = {
    where: perfisWhereUniqueInput
    create: XOR<perfisCreateWithoutUsuariosInput, perfisUncheckedCreateWithoutUsuariosInput>
  }

  export type unidadesCreateWithoutUsuariosInput = {
    nome: string
    tipo: $Enums.TipoUnidade
    endereco?: string | null
    criado_em?: Date | string
    atualizado_em?: Date | string
  }

  export type unidadesUncheckedCreateWithoutUsuariosInput = {
    id?: number
    nome: string
    tipo: $Enums.TipoUnidade
    endereco?: string | null
    criado_em?: Date | string
    atualizado_em?: Date | string
  }

  export type unidadesCreateOrConnectWithoutUsuariosInput = {
    where: unidadesWhereUniqueInput
    create: XOR<unidadesCreateWithoutUsuariosInput, unidadesUncheckedCreateWithoutUsuariosInput>
  }

  export type perfisUpsertWithoutUsuariosInput = {
    update: XOR<perfisUpdateWithoutUsuariosInput, perfisUncheckedUpdateWithoutUsuariosInput>
    create: XOR<perfisCreateWithoutUsuariosInput, perfisUncheckedCreateWithoutUsuariosInput>
    where?: perfisWhereInput
  }

  export type perfisUpdateToOneWithWhereWithoutUsuariosInput = {
    where?: perfisWhereInput
    data: XOR<perfisUpdateWithoutUsuariosInput, perfisUncheckedUpdateWithoutUsuariosInput>
  }

  export type perfisUpdateWithoutUsuariosInput = {
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type perfisUncheckedUpdateWithoutUsuariosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    descricao?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type unidadesUpsertWithoutUsuariosInput = {
    update: XOR<unidadesUpdateWithoutUsuariosInput, unidadesUncheckedUpdateWithoutUsuariosInput>
    create: XOR<unidadesCreateWithoutUsuariosInput, unidadesUncheckedCreateWithoutUsuariosInput>
    where?: unidadesWhereInput
  }

  export type unidadesUpdateToOneWithWhereWithoutUsuariosInput = {
    where?: unidadesWhereInput
    data: XOR<unidadesUpdateWithoutUsuariosInput, unidadesUncheckedUpdateWithoutUsuariosInput>
  }

  export type unidadesUpdateWithoutUsuariosInput = {
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoUnidadeFieldUpdateOperationsInput | $Enums.TipoUnidade
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type unidadesUncheckedUpdateWithoutUsuariosInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    tipo?: EnumTipoUnidadeFieldUpdateOperationsInput | $Enums.TipoUnidade
    endereco?: NullableStringFieldUpdateOperationsInput | string | null
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usuariosCreateManyPerfilInput = {
    id?: number
    nome: string
    email: string
    senha: string
    telefone?: string | null
    unidade_id?: number | null
    status?: boolean
    criado_em?: Date | string
    atualizado_em?: Date | string
  }

  export type usuariosUpdateWithoutPerfilInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    unidade?: unidadesUpdateOneWithoutUsuariosNestedInput
  }

  export type usuariosUncheckedUpdateWithoutPerfilInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    unidade_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: BoolFieldUpdateOperationsInput | boolean
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usuariosUncheckedUpdateManyWithoutPerfilInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    unidade_id?: NullableIntFieldUpdateOperationsInput | number | null
    status?: BoolFieldUpdateOperationsInput | boolean
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usuariosCreateManyUnidadeInput = {
    id?: number
    nome: string
    email: string
    senha: string
    telefone?: string | null
    perfil_id: number
    status?: boolean
    criado_em?: Date | string
    atualizado_em?: Date | string
  }

  export type usuariosUpdateWithoutUnidadeInput = {
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    status?: BoolFieldUpdateOperationsInput | boolean
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    perfil?: perfisUpdateOneRequiredWithoutUsuariosNestedInput
  }

  export type usuariosUncheckedUpdateWithoutUnidadeInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    perfil_id?: IntFieldUpdateOperationsInput | number
    status?: BoolFieldUpdateOperationsInput | boolean
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type usuariosUncheckedUpdateManyWithoutUnidadeInput = {
    id?: IntFieldUpdateOperationsInput | number
    nome?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    senha?: StringFieldUpdateOperationsInput | string
    telefone?: NullableStringFieldUpdateOperationsInput | string | null
    perfil_id?: IntFieldUpdateOperationsInput | number
    status?: BoolFieldUpdateOperationsInput | boolean
    criado_em?: DateTimeFieldUpdateOperationsInput | Date | string
    atualizado_em?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}
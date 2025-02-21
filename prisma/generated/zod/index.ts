import { z } from 'zod';
import { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.function(z.tuple([]), z.any()) }),
    z.record(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['Serializable']);

export const AutomationScalarFieldEnumSchema = z.enum(['id','name','triggerType','triggerConfig','conditions','enabled','createdTime','createdBy','updatedTime']);

export const AutomationActionScalarFieldEnumSchema = z.enum(['id','automationId','order','type','params','conditions','createdTime','updatedTime']);

export const AutomationExecutionLogScalarFieldEnumSchema = z.enum(['id','automationId','status','eventData','result','error','executedAt']);

export const AutomationTestRunScalarFieldEnumSchema = z.enum(['id','automationId','testData','result','status','executedAt']);

export const BaseScalarFieldEnumSchema = z.enum(['id','name','spaceId']);

export const SpaceScalarFieldEnumSchema = z.enum(['id','name']);

export const TableScalarFieldEnumSchema = z.enum(['id','baseId','name']);

export const FieldScalarFieldEnumSchema = z.enum(['id','name','tabelId','fieldType','data']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const NullableJsonNullValueInputSchema = z.enum(['DbNull','JsonNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.DbNull : value);

export const JsonNullValueInputSchema = z.enum(['JsonNull',]).transform((value) => (value === 'JsonNull' ? Prisma.JsonNull : value));

export const JsonNullValueFilterSchema = z.enum(['DbNull','JsonNull','AnyNull',]).transform((value) => value === 'JsonNull' ? Prisma.JsonNull : value === 'DbNull' ? Prisma.JsonNull : value === 'AnyNull' ? Prisma.AnyNull : value);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);

export const AutomationTriggerTypeSchema = z.enum(['onCreate','onUpdate','onDelete','scheduled']);

export type AutomationTriggerTypeType = `${z.infer<typeof AutomationTriggerTypeSchema>}`

export const AutomationActionTypeSchema = z.enum(['updateRecord','callAPI','sendNotification','runScript']);

export type AutomationActionTypeType = `${z.infer<typeof AutomationActionTypeSchema>}`

export const StatusTypeSchema = z.enum(['success','error']);

export type StatusTypeType = `${z.infer<typeof StatusTypeSchema>}`

export const FieldTypeSchema = z.enum(['number','string']);

export type FieldTypeType = `${z.infer<typeof FieldTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// AUTOMATION SCHEMA
/////////////////////////////////////////

export const AutomationSchema = z.object({
  triggerType: AutomationTriggerTypeSchema,
  id: z.string().cuid(),
  name: z.string(),
  triggerConfig: JsonValueSchema.nullable(),
  conditions: JsonValueSchema.nullable(),
  enabled: z.boolean(),
  createdTime: z.coerce.date(),
  createdBy: z.string().nullable(),
  updatedTime: z.coerce.date().nullable(),
})

export type Automation = z.infer<typeof AutomationSchema>

/////////////////////////////////////////
// AUTOMATION ACTION SCHEMA
/////////////////////////////////////////

export const AutomationActionSchema = z.object({
  type: AutomationActionTypeSchema,
  id: z.string().cuid(),
  automationId: z.string(),
  order: z.number().int(),
  params: JsonValueSchema.nullable(),
  conditions: JsonValueSchema.nullable(),
  createdTime: z.coerce.date(),
  updatedTime: z.coerce.date().nullable(),
})

export type AutomationAction = z.infer<typeof AutomationActionSchema>

/////////////////////////////////////////
// AUTOMATION EXECUTION LOG SCHEMA
/////////////////////////////////////////

export const AutomationExecutionLogSchema = z.object({
  status: StatusTypeSchema.nullable(),
  id: z.string().cuid(),
  automationId: z.string(),
  eventData: JsonValueSchema.nullable(),
  result: JsonValueSchema.nullable(),
  error: z.string().nullable(),
  executedAt: z.coerce.date(),
})

export type AutomationExecutionLog = z.infer<typeof AutomationExecutionLogSchema>

/////////////////////////////////////////
// AUTOMATION TEST RUN SCHEMA
/////////////////////////////////////////

export const AutomationTestRunSchema = z.object({
  id: z.string().cuid(),
  automationId: z.string(),
  testData: JsonValueSchema,
  result: JsonValueSchema.nullable(),
  status: z.string(),
  executedAt: z.coerce.date(),
})

export type AutomationTestRun = z.infer<typeof AutomationTestRunSchema>

/////////////////////////////////////////
// BASE SCHEMA
/////////////////////////////////////////

export const BaseSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  spaceId: z.string(),
})

export type Base = z.infer<typeof BaseSchema>

/////////////////////////////////////////
// SPACE SCHEMA
/////////////////////////////////////////

export const SpaceSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
})

export type Space = z.infer<typeof SpaceSchema>

/////////////////////////////////////////
// TABLE SCHEMA
/////////////////////////////////////////

export const TableSchema = z.object({
  id: z.string().cuid(),
  baseId: z.string(),
  name: z.string(),
})

export type Table = z.infer<typeof TableSchema>

/////////////////////////////////////////
// FIELD SCHEMA
/////////////////////////////////////////

export const FieldSchema = z.object({
  fieldType: FieldTypeSchema,
  id: z.string().cuid(),
  name: z.string(),
  tabelId: z.string(),
  data: JsonValueSchema,
})

export type Field = z.infer<typeof FieldSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// AUTOMATION
//------------------------------------------------------

export const AutomationIncludeSchema: z.ZodType<Prisma.AutomationInclude> = z.object({
  actions: z.union([z.boolean(),z.lazy(() => AutomationActionFindManyArgsSchema)]).optional(),
  AutomationExecutionLog: z.union([z.boolean(),z.lazy(() => AutomationExecutionLogFindManyArgsSchema)]).optional(),
  AutomationTestRun: z.union([z.boolean(),z.lazy(() => AutomationTestRunFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AutomationCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const AutomationArgsSchema: z.ZodType<Prisma.AutomationDefaultArgs> = z.object({
  select: z.lazy(() => AutomationSelectSchema).optional(),
  include: z.lazy(() => AutomationIncludeSchema).optional(),
}).strict();

export const AutomationCountOutputTypeArgsSchema: z.ZodType<Prisma.AutomationCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => AutomationCountOutputTypeSelectSchema).nullish(),
}).strict();

export const AutomationCountOutputTypeSelectSchema: z.ZodType<Prisma.AutomationCountOutputTypeSelect> = z.object({
  actions: z.boolean().optional(),
  AutomationExecutionLog: z.boolean().optional(),
  AutomationTestRun: z.boolean().optional(),
}).strict();

export const AutomationSelectSchema: z.ZodType<Prisma.AutomationSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  triggerType: z.boolean().optional(),
  triggerConfig: z.boolean().optional(),
  conditions: z.boolean().optional(),
  enabled: z.boolean().optional(),
  createdTime: z.boolean().optional(),
  createdBy: z.boolean().optional(),
  updatedTime: z.boolean().optional(),
  actions: z.union([z.boolean(),z.lazy(() => AutomationActionFindManyArgsSchema)]).optional(),
  AutomationExecutionLog: z.union([z.boolean(),z.lazy(() => AutomationExecutionLogFindManyArgsSchema)]).optional(),
  AutomationTestRun: z.union([z.boolean(),z.lazy(() => AutomationTestRunFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => AutomationCountOutputTypeArgsSchema)]).optional(),
}).strict()

// AUTOMATION ACTION
//------------------------------------------------------

export const AutomationActionIncludeSchema: z.ZodType<Prisma.AutomationActionInclude> = z.object({
  automation: z.union([z.boolean(),z.lazy(() => AutomationArgsSchema)]).optional(),
}).strict()

export const AutomationActionArgsSchema: z.ZodType<Prisma.AutomationActionDefaultArgs> = z.object({
  select: z.lazy(() => AutomationActionSelectSchema).optional(),
  include: z.lazy(() => AutomationActionIncludeSchema).optional(),
}).strict();

export const AutomationActionSelectSchema: z.ZodType<Prisma.AutomationActionSelect> = z.object({
  id: z.boolean().optional(),
  automationId: z.boolean().optional(),
  order: z.boolean().optional(),
  type: z.boolean().optional(),
  params: z.boolean().optional(),
  conditions: z.boolean().optional(),
  createdTime: z.boolean().optional(),
  updatedTime: z.boolean().optional(),
  automation: z.union([z.boolean(),z.lazy(() => AutomationArgsSchema)]).optional(),
}).strict()

// AUTOMATION EXECUTION LOG
//------------------------------------------------------

export const AutomationExecutionLogIncludeSchema: z.ZodType<Prisma.AutomationExecutionLogInclude> = z.object({
  automation: z.union([z.boolean(),z.lazy(() => AutomationArgsSchema)]).optional(),
}).strict()

export const AutomationExecutionLogArgsSchema: z.ZodType<Prisma.AutomationExecutionLogDefaultArgs> = z.object({
  select: z.lazy(() => AutomationExecutionLogSelectSchema).optional(),
  include: z.lazy(() => AutomationExecutionLogIncludeSchema).optional(),
}).strict();

export const AutomationExecutionLogSelectSchema: z.ZodType<Prisma.AutomationExecutionLogSelect> = z.object({
  id: z.boolean().optional(),
  automationId: z.boolean().optional(),
  status: z.boolean().optional(),
  eventData: z.boolean().optional(),
  result: z.boolean().optional(),
  error: z.boolean().optional(),
  executedAt: z.boolean().optional(),
  automation: z.union([z.boolean(),z.lazy(() => AutomationArgsSchema)]).optional(),
}).strict()

// AUTOMATION TEST RUN
//------------------------------------------------------

export const AutomationTestRunIncludeSchema: z.ZodType<Prisma.AutomationTestRunInclude> = z.object({
  automation: z.union([z.boolean(),z.lazy(() => AutomationArgsSchema)]).optional(),
}).strict()

export const AutomationTestRunArgsSchema: z.ZodType<Prisma.AutomationTestRunDefaultArgs> = z.object({
  select: z.lazy(() => AutomationTestRunSelectSchema).optional(),
  include: z.lazy(() => AutomationTestRunIncludeSchema).optional(),
}).strict();

export const AutomationTestRunSelectSchema: z.ZodType<Prisma.AutomationTestRunSelect> = z.object({
  id: z.boolean().optional(),
  automationId: z.boolean().optional(),
  testData: z.boolean().optional(),
  result: z.boolean().optional(),
  status: z.boolean().optional(),
  executedAt: z.boolean().optional(),
  automation: z.union([z.boolean(),z.lazy(() => AutomationArgsSchema)]).optional(),
}).strict()

// BASE
//------------------------------------------------------

export const BaseIncludeSchema: z.ZodType<Prisma.BaseInclude> = z.object({
  tables: z.union([z.boolean(),z.lazy(() => TableFindManyArgsSchema)]).optional(),
  space: z.union([z.boolean(),z.lazy(() => SpaceArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BaseCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const BaseArgsSchema: z.ZodType<Prisma.BaseDefaultArgs> = z.object({
  select: z.lazy(() => BaseSelectSchema).optional(),
  include: z.lazy(() => BaseIncludeSchema).optional(),
}).strict();

export const BaseCountOutputTypeArgsSchema: z.ZodType<Prisma.BaseCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => BaseCountOutputTypeSelectSchema).nullish(),
}).strict();

export const BaseCountOutputTypeSelectSchema: z.ZodType<Prisma.BaseCountOutputTypeSelect> = z.object({
  tables: z.boolean().optional(),
}).strict();

export const BaseSelectSchema: z.ZodType<Prisma.BaseSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  spaceId: z.boolean().optional(),
  tables: z.union([z.boolean(),z.lazy(() => TableFindManyArgsSchema)]).optional(),
  space: z.union([z.boolean(),z.lazy(() => SpaceArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => BaseCountOutputTypeArgsSchema)]).optional(),
}).strict()

// SPACE
//------------------------------------------------------

export const SpaceIncludeSchema: z.ZodType<Prisma.SpaceInclude> = z.object({
  baseGroup: z.union([z.boolean(),z.lazy(() => BaseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SpaceCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const SpaceArgsSchema: z.ZodType<Prisma.SpaceDefaultArgs> = z.object({
  select: z.lazy(() => SpaceSelectSchema).optional(),
  include: z.lazy(() => SpaceIncludeSchema).optional(),
}).strict();

export const SpaceCountOutputTypeArgsSchema: z.ZodType<Prisma.SpaceCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => SpaceCountOutputTypeSelectSchema).nullish(),
}).strict();

export const SpaceCountOutputTypeSelectSchema: z.ZodType<Prisma.SpaceCountOutputTypeSelect> = z.object({
  baseGroup: z.boolean().optional(),
}).strict();

export const SpaceSelectSchema: z.ZodType<Prisma.SpaceSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  baseGroup: z.union([z.boolean(),z.lazy(() => BaseFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => SpaceCountOutputTypeArgsSchema)]).optional(),
}).strict()

// TABLE
//------------------------------------------------------

export const TableIncludeSchema: z.ZodType<Prisma.TableInclude> = z.object({
  base: z.union([z.boolean(),z.lazy(() => BaseArgsSchema)]).optional(),
  fields: z.union([z.boolean(),z.lazy(() => FieldFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TableCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const TableArgsSchema: z.ZodType<Prisma.TableDefaultArgs> = z.object({
  select: z.lazy(() => TableSelectSchema).optional(),
  include: z.lazy(() => TableIncludeSchema).optional(),
}).strict();

export const TableCountOutputTypeArgsSchema: z.ZodType<Prisma.TableCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => TableCountOutputTypeSelectSchema).nullish(),
}).strict();

export const TableCountOutputTypeSelectSchema: z.ZodType<Prisma.TableCountOutputTypeSelect> = z.object({
  fields: z.boolean().optional(),
}).strict();

export const TableSelectSchema: z.ZodType<Prisma.TableSelect> = z.object({
  id: z.boolean().optional(),
  baseId: z.boolean().optional(),
  name: z.boolean().optional(),
  base: z.union([z.boolean(),z.lazy(() => BaseArgsSchema)]).optional(),
  fields: z.union([z.boolean(),z.lazy(() => FieldFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => TableCountOutputTypeArgsSchema)]).optional(),
}).strict()

// FIELD
//------------------------------------------------------

export const FieldIncludeSchema: z.ZodType<Prisma.FieldInclude> = z.object({
  table: z.union([z.boolean(),z.lazy(() => TableArgsSchema)]).optional(),
}).strict()

export const FieldArgsSchema: z.ZodType<Prisma.FieldDefaultArgs> = z.object({
  select: z.lazy(() => FieldSelectSchema).optional(),
  include: z.lazy(() => FieldIncludeSchema).optional(),
}).strict();

export const FieldSelectSchema: z.ZodType<Prisma.FieldSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  tabelId: z.boolean().optional(),
  fieldType: z.boolean().optional(),
  data: z.boolean().optional(),
  table: z.union([z.boolean(),z.lazy(() => TableArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AutomationWhereInputSchema: z.ZodType<Prisma.AutomationWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AutomationWhereInputSchema),z.lazy(() => AutomationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationWhereInputSchema),z.lazy(() => AutomationWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  triggerType: z.union([ z.lazy(() => EnumAutomationTriggerTypeFilterSchema),z.lazy(() => AutomationTriggerTypeSchema) ]).optional(),
  triggerConfig: z.lazy(() => JsonNullableFilterSchema).optional(),
  conditions: z.lazy(() => JsonNullableFilterSchema).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  updatedTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  actions: z.lazy(() => AutomationActionListRelationFilterSchema).optional(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogListRelationFilterSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunListRelationFilterSchema).optional()
}).strict();

export const AutomationOrderByWithRelationInputSchema: z.ZodType<Prisma.AutomationOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  triggerType: z.lazy(() => SortOrderSchema).optional(),
  triggerConfig: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  conditions: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  createdTime: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  actions: z.lazy(() => AutomationActionOrderByRelationAggregateInputSchema).optional(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogOrderByRelationAggregateInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunOrderByRelationAggregateInputSchema).optional()
}).strict();

export const AutomationWhereUniqueInputSchema: z.ZodType<Prisma.AutomationWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => AutomationWhereInputSchema),z.lazy(() => AutomationWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationWhereInputSchema),z.lazy(() => AutomationWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  triggerType: z.union([ z.lazy(() => EnumAutomationTriggerTypeFilterSchema),z.lazy(() => AutomationTriggerTypeSchema) ]).optional(),
  triggerConfig: z.lazy(() => JsonNullableFilterSchema).optional(),
  conditions: z.lazy(() => JsonNullableFilterSchema).optional(),
  enabled: z.union([ z.lazy(() => BoolFilterSchema),z.boolean() ]).optional(),
  createdTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  updatedTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  actions: z.lazy(() => AutomationActionListRelationFilterSchema).optional(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogListRelationFilterSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunListRelationFilterSchema).optional()
}).strict());

export const AutomationOrderByWithAggregationInputSchema: z.ZodType<Prisma.AutomationOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  triggerType: z.lazy(() => SortOrderSchema).optional(),
  triggerConfig: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  conditions: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  createdTime: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  updatedTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AutomationCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AutomationMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AutomationMinOrderByAggregateInputSchema).optional()
}).strict();

export const AutomationScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AutomationScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AutomationScalarWhereWithAggregatesInputSchema),z.lazy(() => AutomationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationScalarWhereWithAggregatesInputSchema),z.lazy(() => AutomationScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  triggerType: z.union([ z.lazy(() => EnumAutomationTriggerTypeWithAggregatesFilterSchema),z.lazy(() => AutomationTriggerTypeSchema) ]).optional(),
  triggerConfig: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  conditions: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  enabled: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema),z.boolean() ]).optional(),
  createdTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  createdBy: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  updatedTime: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const AutomationActionWhereInputSchema: z.ZodType<Prisma.AutomationActionWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AutomationActionWhereInputSchema),z.lazy(() => AutomationActionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationActionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationActionWhereInputSchema),z.lazy(() => AutomationActionWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  automationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumAutomationActionTypeFilterSchema),z.lazy(() => AutomationActionTypeSchema) ]).optional(),
  params: z.lazy(() => JsonNullableFilterSchema).optional(),
  conditions: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  automation: z.union([ z.lazy(() => AutomationScalarRelationFilterSchema),z.lazy(() => AutomationWhereInputSchema) ]).optional(),
}).strict();

export const AutomationActionOrderByWithRelationInputSchema: z.ZodType<Prisma.AutomationActionOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  params: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  conditions: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdTime: z.lazy(() => SortOrderSchema).optional(),
  updatedTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  automation: z.lazy(() => AutomationOrderByWithRelationInputSchema).optional()
}).strict();

export const AutomationActionWhereUniqueInputSchema: z.ZodType<Prisma.AutomationActionWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => AutomationActionWhereInputSchema),z.lazy(() => AutomationActionWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationActionWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationActionWhereInputSchema),z.lazy(() => AutomationActionWhereInputSchema).array() ]).optional(),
  automationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  type: z.union([ z.lazy(() => EnumAutomationActionTypeFilterSchema),z.lazy(() => AutomationActionTypeSchema) ]).optional(),
  params: z.lazy(() => JsonNullableFilterSchema).optional(),
  conditions: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
  automation: z.union([ z.lazy(() => AutomationScalarRelationFilterSchema),z.lazy(() => AutomationWhereInputSchema) ]).optional(),
}).strict());

export const AutomationActionOrderByWithAggregationInputSchema: z.ZodType<Prisma.AutomationActionOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  params: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  conditions: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  createdTime: z.lazy(() => SortOrderSchema).optional(),
  updatedTime: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  _count: z.lazy(() => AutomationActionCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AutomationActionAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AutomationActionMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AutomationActionMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AutomationActionSumOrderByAggregateInputSchema).optional()
}).strict();

export const AutomationActionScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AutomationActionScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AutomationActionScalarWhereWithAggregatesInputSchema),z.lazy(() => AutomationActionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationActionScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationActionScalarWhereWithAggregatesInputSchema),z.lazy(() => AutomationActionScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  automationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumAutomationActionTypeWithAggregatesFilterSchema),z.lazy(() => AutomationActionTypeSchema) ]).optional(),
  params: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  conditions: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  createdTime: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedTime: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const AutomationExecutionLogWhereInputSchema: z.ZodType<Prisma.AutomationExecutionLogWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AutomationExecutionLogWhereInputSchema),z.lazy(() => AutomationExecutionLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationExecutionLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationExecutionLogWhereInputSchema),z.lazy(() => AutomationExecutionLogWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  automationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusTypeNullableFilterSchema),z.lazy(() => StatusTypeSchema) ]).optional().nullable(),
  eventData: z.lazy(() => JsonNullableFilterSchema).optional(),
  result: z.lazy(() => JsonNullableFilterSchema).optional(),
  error: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  executedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  automation: z.union([ z.lazy(() => AutomationScalarRelationFilterSchema),z.lazy(() => AutomationWhereInputSchema) ]).optional(),
}).strict();

export const AutomationExecutionLogOrderByWithRelationInputSchema: z.ZodType<Prisma.AutomationExecutionLogOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  status: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  eventData: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  error: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  executedAt: z.lazy(() => SortOrderSchema).optional(),
  automation: z.lazy(() => AutomationOrderByWithRelationInputSchema).optional()
}).strict();

export const AutomationExecutionLogWhereUniqueInputSchema: z.ZodType<Prisma.AutomationExecutionLogWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => AutomationExecutionLogWhereInputSchema),z.lazy(() => AutomationExecutionLogWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationExecutionLogWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationExecutionLogWhereInputSchema),z.lazy(() => AutomationExecutionLogWhereInputSchema).array() ]).optional(),
  automationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusTypeNullableFilterSchema),z.lazy(() => StatusTypeSchema) ]).optional().nullable(),
  eventData: z.lazy(() => JsonNullableFilterSchema).optional(),
  result: z.lazy(() => JsonNullableFilterSchema).optional(),
  error: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  executedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  automation: z.union([ z.lazy(() => AutomationScalarRelationFilterSchema),z.lazy(() => AutomationWhereInputSchema) ]).optional(),
}).strict());

export const AutomationExecutionLogOrderByWithAggregationInputSchema: z.ZodType<Prisma.AutomationExecutionLogOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  status: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  eventData: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  result: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  error: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  executedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AutomationExecutionLogCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AutomationExecutionLogMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AutomationExecutionLogMinOrderByAggregateInputSchema).optional()
}).strict();

export const AutomationExecutionLogScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AutomationExecutionLogScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AutomationExecutionLogScalarWhereWithAggregatesInputSchema),z.lazy(() => AutomationExecutionLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationExecutionLogScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationExecutionLogScalarWhereWithAggregatesInputSchema),z.lazy(() => AutomationExecutionLogScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  automationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusTypeNullableWithAggregatesFilterSchema),z.lazy(() => StatusTypeSchema) ]).optional().nullable(),
  eventData: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  result: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  error: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema),z.string() ]).optional().nullable(),
  executedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AutomationTestRunWhereInputSchema: z.ZodType<Prisma.AutomationTestRunWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AutomationTestRunWhereInputSchema),z.lazy(() => AutomationTestRunWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationTestRunWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationTestRunWhereInputSchema),z.lazy(() => AutomationTestRunWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  automationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  testData: z.lazy(() => JsonFilterSchema).optional(),
  result: z.lazy(() => JsonNullableFilterSchema).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  executedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  automation: z.union([ z.lazy(() => AutomationScalarRelationFilterSchema),z.lazy(() => AutomationWhereInputSchema) ]).optional(),
}).strict();

export const AutomationTestRunOrderByWithRelationInputSchema: z.ZodType<Prisma.AutomationTestRunOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  testData: z.lazy(() => SortOrderSchema).optional(),
  result: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  executedAt: z.lazy(() => SortOrderSchema).optional(),
  automation: z.lazy(() => AutomationOrderByWithRelationInputSchema).optional()
}).strict();

export const AutomationTestRunWhereUniqueInputSchema: z.ZodType<Prisma.AutomationTestRunWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => AutomationTestRunWhereInputSchema),z.lazy(() => AutomationTestRunWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationTestRunWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationTestRunWhereInputSchema),z.lazy(() => AutomationTestRunWhereInputSchema).array() ]).optional(),
  automationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  testData: z.lazy(() => JsonFilterSchema).optional(),
  result: z.lazy(() => JsonNullableFilterSchema).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  executedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  automation: z.union([ z.lazy(() => AutomationScalarRelationFilterSchema),z.lazy(() => AutomationWhereInputSchema) ]).optional(),
}).strict());

export const AutomationTestRunOrderByWithAggregationInputSchema: z.ZodType<Prisma.AutomationTestRunOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  testData: z.lazy(() => SortOrderSchema).optional(),
  result: z.union([ z.lazy(() => SortOrderSchema),z.lazy(() => SortOrderInputSchema) ]).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  executedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AutomationTestRunCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AutomationTestRunMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AutomationTestRunMinOrderByAggregateInputSchema).optional()
}).strict();

export const AutomationTestRunScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AutomationTestRunScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AutomationTestRunScalarWhereWithAggregatesInputSchema),z.lazy(() => AutomationTestRunScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationTestRunScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationTestRunScalarWhereWithAggregatesInputSchema),z.lazy(() => AutomationTestRunScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  automationId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  testData: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  result: z.lazy(() => JsonNullableWithAggregatesFilterSchema).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  executedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const BaseWhereInputSchema: z.ZodType<Prisma.BaseWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BaseWhereInputSchema),z.lazy(() => BaseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BaseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BaseWhereInputSchema),z.lazy(() => BaseWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tables: z.lazy(() => TableListRelationFilterSchema).optional(),
  space: z.union([ z.lazy(() => SpaceScalarRelationFilterSchema),z.lazy(() => SpaceWhereInputSchema) ]).optional(),
}).strict();

export const BaseOrderByWithRelationInputSchema: z.ZodType<Prisma.BaseOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  tables: z.lazy(() => TableOrderByRelationAggregateInputSchema).optional(),
  space: z.lazy(() => SpaceOrderByWithRelationInputSchema).optional()
}).strict();

export const BaseWhereUniqueInputSchema: z.ZodType<Prisma.BaseWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => BaseWhereInputSchema),z.lazy(() => BaseWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BaseWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BaseWhereInputSchema),z.lazy(() => BaseWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tables: z.lazy(() => TableListRelationFilterSchema).optional(),
  space: z.union([ z.lazy(() => SpaceScalarRelationFilterSchema),z.lazy(() => SpaceWhereInputSchema) ]).optional(),
}).strict());

export const BaseOrderByWithAggregationInputSchema: z.ZodType<Prisma.BaseOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => BaseCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => BaseMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => BaseMinOrderByAggregateInputSchema).optional()
}).strict();

export const BaseScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.BaseScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => BaseScalarWhereWithAggregatesInputSchema),z.lazy(() => BaseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => BaseScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BaseScalarWhereWithAggregatesInputSchema),z.lazy(() => BaseScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const SpaceWhereInputSchema: z.ZodType<Prisma.SpaceWhereInput> = z.object({
  AND: z.union([ z.lazy(() => SpaceWhereInputSchema),z.lazy(() => SpaceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SpaceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SpaceWhereInputSchema),z.lazy(() => SpaceWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  baseGroup: z.lazy(() => BaseListRelationFilterSchema).optional()
}).strict();

export const SpaceOrderByWithRelationInputSchema: z.ZodType<Prisma.SpaceOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  baseGroup: z.lazy(() => BaseOrderByRelationAggregateInputSchema).optional()
}).strict();

export const SpaceWhereUniqueInputSchema: z.ZodType<Prisma.SpaceWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => SpaceWhereInputSchema),z.lazy(() => SpaceWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => SpaceWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SpaceWhereInputSchema),z.lazy(() => SpaceWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  baseGroup: z.lazy(() => BaseListRelationFilterSchema).optional()
}).strict());

export const SpaceOrderByWithAggregationInputSchema: z.ZodType<Prisma.SpaceOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => SpaceCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => SpaceMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => SpaceMinOrderByAggregateInputSchema).optional()
}).strict();

export const SpaceScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.SpaceScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => SpaceScalarWhereWithAggregatesInputSchema),z.lazy(() => SpaceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => SpaceScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => SpaceScalarWhereWithAggregatesInputSchema),z.lazy(() => SpaceScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const TableWhereInputSchema: z.ZodType<Prisma.TableWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TableWhereInputSchema),z.lazy(() => TableWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TableWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TableWhereInputSchema),z.lazy(() => TableWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  baseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  base: z.union([ z.lazy(() => BaseScalarRelationFilterSchema),z.lazy(() => BaseWhereInputSchema) ]).optional(),
  fields: z.lazy(() => FieldListRelationFilterSchema).optional()
}).strict();

export const TableOrderByWithRelationInputSchema: z.ZodType<Prisma.TableOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  baseId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  base: z.lazy(() => BaseOrderByWithRelationInputSchema).optional(),
  fields: z.lazy(() => FieldOrderByRelationAggregateInputSchema).optional()
}).strict();

export const TableWhereUniqueInputSchema: z.ZodType<Prisma.TableWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => TableWhereInputSchema),z.lazy(() => TableWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TableWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TableWhereInputSchema),z.lazy(() => TableWhereInputSchema).array() ]).optional(),
  baseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  base: z.union([ z.lazy(() => BaseScalarRelationFilterSchema),z.lazy(() => BaseWhereInputSchema) ]).optional(),
  fields: z.lazy(() => FieldListRelationFilterSchema).optional()
}).strict());

export const TableOrderByWithAggregationInputSchema: z.ZodType<Prisma.TableOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  baseId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => TableCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => TableMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => TableMinOrderByAggregateInputSchema).optional()
}).strict();

export const TableScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.TableScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => TableScalarWhereWithAggregatesInputSchema),z.lazy(() => TableScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => TableScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TableScalarWhereWithAggregatesInputSchema),z.lazy(() => TableScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  baseId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const FieldWhereInputSchema: z.ZodType<Prisma.FieldWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FieldWhereInputSchema),z.lazy(() => FieldWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FieldWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FieldWhereInputSchema),z.lazy(() => FieldWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tabelId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  fieldType: z.union([ z.lazy(() => EnumFieldTypeFilterSchema),z.lazy(() => FieldTypeSchema) ]).optional(),
  data: z.lazy(() => JsonFilterSchema).optional(),
  table: z.union([ z.lazy(() => TableScalarRelationFilterSchema),z.lazy(() => TableWhereInputSchema) ]).optional(),
}).strict();

export const FieldOrderByWithRelationInputSchema: z.ZodType<Prisma.FieldOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tabelId: z.lazy(() => SortOrderSchema).optional(),
  fieldType: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  table: z.lazy(() => TableOrderByWithRelationInputSchema).optional()
}).strict();

export const FieldWhereUniqueInputSchema: z.ZodType<Prisma.FieldWhereUniqueInput> = z.object({
  id: z.string().cuid()
})
.and(z.object({
  id: z.string().cuid().optional(),
  AND: z.union([ z.lazy(() => FieldWhereInputSchema),z.lazy(() => FieldWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FieldWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FieldWhereInputSchema),z.lazy(() => FieldWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tabelId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  fieldType: z.union([ z.lazy(() => EnumFieldTypeFilterSchema),z.lazy(() => FieldTypeSchema) ]).optional(),
  data: z.lazy(() => JsonFilterSchema).optional(),
  table: z.union([ z.lazy(() => TableScalarRelationFilterSchema),z.lazy(() => TableWhereInputSchema) ]).optional(),
}).strict());

export const FieldOrderByWithAggregationInputSchema: z.ZodType<Prisma.FieldOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tabelId: z.lazy(() => SortOrderSchema).optional(),
  fieldType: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => FieldCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => FieldMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => FieldMinOrderByAggregateInputSchema).optional()
}).strict();

export const FieldScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.FieldScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => FieldScalarWhereWithAggregatesInputSchema),z.lazy(() => FieldScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => FieldScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FieldScalarWhereWithAggregatesInputSchema),z.lazy(() => FieldScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  tabelId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  fieldType: z.union([ z.lazy(() => EnumFieldTypeWithAggregatesFilterSchema),z.lazy(() => FieldTypeSchema) ]).optional(),
  data: z.lazy(() => JsonWithAggregatesFilterSchema).optional()
}).strict();

export const AutomationCreateInputSchema: z.ZodType<Prisma.AutomationCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  triggerType: z.lazy(() => AutomationTriggerTypeSchema),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.boolean().optional(),
  createdTime: z.coerce.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedTime: z.coerce.date().optional().nullable(),
  actions: z.lazy(() => AutomationActionCreateNestedManyWithoutAutomationInputSchema).optional(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogCreateNestedManyWithoutAutomationInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunCreateNestedManyWithoutAutomationInputSchema).optional()
}).strict();

export const AutomationUncheckedCreateInputSchema: z.ZodType<Prisma.AutomationUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  triggerType: z.lazy(() => AutomationTriggerTypeSchema),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.boolean().optional(),
  createdTime: z.coerce.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedTime: z.coerce.date().optional().nullable(),
  actions: z.lazy(() => AutomationActionUncheckedCreateNestedManyWithoutAutomationInputSchema).optional(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogUncheckedCreateNestedManyWithoutAutomationInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunUncheckedCreateNestedManyWithoutAutomationInputSchema).optional()
}).strict();

export const AutomationUpdateInputSchema: z.ZodType<Prisma.AutomationUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  triggerType: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => EnumAutomationTriggerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  actions: z.lazy(() => AutomationActionUpdateManyWithoutAutomationNestedInputSchema).optional(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogUpdateManyWithoutAutomationNestedInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunUpdateManyWithoutAutomationNestedInputSchema).optional()
}).strict();

export const AutomationUncheckedUpdateInputSchema: z.ZodType<Prisma.AutomationUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  triggerType: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => EnumAutomationTriggerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  actions: z.lazy(() => AutomationActionUncheckedUpdateManyWithoutAutomationNestedInputSchema).optional(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogUncheckedUpdateManyWithoutAutomationNestedInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunUncheckedUpdateManyWithoutAutomationNestedInputSchema).optional()
}).strict();

export const AutomationCreateManyInputSchema: z.ZodType<Prisma.AutomationCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  triggerType: z.lazy(() => AutomationTriggerTypeSchema),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.boolean().optional(),
  createdTime: z.coerce.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedTime: z.coerce.date().optional().nullable()
}).strict();

export const AutomationUpdateManyMutationInputSchema: z.ZodType<Prisma.AutomationUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  triggerType: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => EnumAutomationTriggerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AutomationUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AutomationUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  triggerType: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => EnumAutomationTriggerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AutomationActionCreateInputSchema: z.ZodType<Prisma.AutomationActionCreateInput> = z.object({
  id: z.string().cuid().optional(),
  order: z.number().int(),
  type: z.lazy(() => AutomationActionTypeSchema),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.coerce.date().optional(),
  updatedTime: z.coerce.date().optional().nullable(),
  automation: z.lazy(() => AutomationCreateNestedOneWithoutActionsInputSchema)
}).strict();

export const AutomationActionUncheckedCreateInputSchema: z.ZodType<Prisma.AutomationActionUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  automationId: z.string(),
  order: z.number().int(),
  type: z.lazy(() => AutomationActionTypeSchema),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.coerce.date().optional(),
  updatedTime: z.coerce.date().optional().nullable()
}).strict();

export const AutomationActionUpdateInputSchema: z.ZodType<Prisma.AutomationActionUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AutomationActionTypeSchema),z.lazy(() => EnumAutomationActionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  automation: z.lazy(() => AutomationUpdateOneRequiredWithoutActionsNestedInputSchema).optional()
}).strict();

export const AutomationActionUncheckedUpdateInputSchema: z.ZodType<Prisma.AutomationActionUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  automationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AutomationActionTypeSchema),z.lazy(() => EnumAutomationActionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AutomationActionCreateManyInputSchema: z.ZodType<Prisma.AutomationActionCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  automationId: z.string(),
  order: z.number().int(),
  type: z.lazy(() => AutomationActionTypeSchema),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.coerce.date().optional(),
  updatedTime: z.coerce.date().optional().nullable()
}).strict();

export const AutomationActionUpdateManyMutationInputSchema: z.ZodType<Prisma.AutomationActionUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AutomationActionTypeSchema),z.lazy(() => EnumAutomationActionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AutomationActionUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AutomationActionUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  automationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AutomationActionTypeSchema),z.lazy(() => EnumAutomationActionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AutomationExecutionLogCreateInputSchema: z.ZodType<Prisma.AutomationExecutionLogCreateInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => StatusTypeSchema).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.string().optional().nullable(),
  executedAt: z.coerce.date().optional(),
  automation: z.lazy(() => AutomationCreateNestedOneWithoutAutomationExecutionLogInputSchema)
}).strict();

export const AutomationExecutionLogUncheckedCreateInputSchema: z.ZodType<Prisma.AutomationExecutionLogUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  automationId: z.string(),
  status: z.lazy(() => StatusTypeSchema).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.string().optional().nullable(),
  executedAt: z.coerce.date().optional()
}).strict();

export const AutomationExecutionLogUpdateInputSchema: z.ZodType<Prisma.AutomationExecutionLogUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusTypeSchema),z.lazy(() => NullableEnumStatusTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  automation: z.lazy(() => AutomationUpdateOneRequiredWithoutAutomationExecutionLogNestedInputSchema).optional()
}).strict();

export const AutomationExecutionLogUncheckedUpdateInputSchema: z.ZodType<Prisma.AutomationExecutionLogUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  automationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusTypeSchema),z.lazy(() => NullableEnumStatusTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AutomationExecutionLogCreateManyInputSchema: z.ZodType<Prisma.AutomationExecutionLogCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  automationId: z.string(),
  status: z.lazy(() => StatusTypeSchema).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.string().optional().nullable(),
  executedAt: z.coerce.date().optional()
}).strict();

export const AutomationExecutionLogUpdateManyMutationInputSchema: z.ZodType<Prisma.AutomationExecutionLogUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusTypeSchema),z.lazy(() => NullableEnumStatusTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AutomationExecutionLogUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AutomationExecutionLogUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  automationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusTypeSchema),z.lazy(() => NullableEnumStatusTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AutomationTestRunCreateInputSchema: z.ZodType<Prisma.AutomationTestRunCreateInput> = z.object({
  id: z.string().cuid().optional(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.string(),
  executedAt: z.coerce.date().optional(),
  automation: z.lazy(() => AutomationCreateNestedOneWithoutAutomationTestRunInputSchema)
}).strict();

export const AutomationTestRunUncheckedCreateInputSchema: z.ZodType<Prisma.AutomationTestRunUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  automationId: z.string(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.string(),
  executedAt: z.coerce.date().optional()
}).strict();

export const AutomationTestRunUpdateInputSchema: z.ZodType<Prisma.AutomationTestRunUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  automation: z.lazy(() => AutomationUpdateOneRequiredWithoutAutomationTestRunNestedInputSchema).optional()
}).strict();

export const AutomationTestRunUncheckedUpdateInputSchema: z.ZodType<Prisma.AutomationTestRunUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  automationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AutomationTestRunCreateManyInputSchema: z.ZodType<Prisma.AutomationTestRunCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  automationId: z.string(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.string(),
  executedAt: z.coerce.date().optional()
}).strict();

export const AutomationTestRunUpdateManyMutationInputSchema: z.ZodType<Prisma.AutomationTestRunUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AutomationTestRunUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AutomationTestRunUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  automationId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BaseCreateInputSchema: z.ZodType<Prisma.BaseCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  tables: z.lazy(() => TableCreateNestedManyWithoutBaseInputSchema).optional(),
  space: z.lazy(() => SpaceCreateNestedOneWithoutBaseGroupInputSchema)
}).strict();

export const BaseUncheckedCreateInputSchema: z.ZodType<Prisma.BaseUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  spaceId: z.string(),
  tables: z.lazy(() => TableUncheckedCreateNestedManyWithoutBaseInputSchema).optional()
}).strict();

export const BaseUpdateInputSchema: z.ZodType<Prisma.BaseUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tables: z.lazy(() => TableUpdateManyWithoutBaseNestedInputSchema).optional(),
  space: z.lazy(() => SpaceUpdateOneRequiredWithoutBaseGroupNestedInputSchema).optional()
}).strict();

export const BaseUncheckedUpdateInputSchema: z.ZodType<Prisma.BaseUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tables: z.lazy(() => TableUncheckedUpdateManyWithoutBaseNestedInputSchema).optional()
}).strict();

export const BaseCreateManyInputSchema: z.ZodType<Prisma.BaseCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  spaceId: z.string()
}).strict();

export const BaseUpdateManyMutationInputSchema: z.ZodType<Prisma.BaseUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BaseUncheckedUpdateManyInputSchema: z.ZodType<Prisma.BaseUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SpaceCreateInputSchema: z.ZodType<Prisma.SpaceCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  baseGroup: z.lazy(() => BaseCreateNestedManyWithoutSpaceInputSchema).optional()
}).strict();

export const SpaceUncheckedCreateInputSchema: z.ZodType<Prisma.SpaceUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  baseGroup: z.lazy(() => BaseUncheckedCreateNestedManyWithoutSpaceInputSchema).optional()
}).strict();

export const SpaceUpdateInputSchema: z.ZodType<Prisma.SpaceUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseGroup: z.lazy(() => BaseUpdateManyWithoutSpaceNestedInputSchema).optional()
}).strict();

export const SpaceUncheckedUpdateInputSchema: z.ZodType<Prisma.SpaceUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseGroup: z.lazy(() => BaseUncheckedUpdateManyWithoutSpaceNestedInputSchema).optional()
}).strict();

export const SpaceCreateManyInputSchema: z.ZodType<Prisma.SpaceCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string()
}).strict();

export const SpaceUpdateManyMutationInputSchema: z.ZodType<Prisma.SpaceUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SpaceUncheckedUpdateManyInputSchema: z.ZodType<Prisma.SpaceUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TableCreateInputSchema: z.ZodType<Prisma.TableCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  base: z.lazy(() => BaseCreateNestedOneWithoutTablesInputSchema),
  fields: z.lazy(() => FieldCreateNestedManyWithoutTableInputSchema).optional()
}).strict();

export const TableUncheckedCreateInputSchema: z.ZodType<Prisma.TableUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  baseId: z.string(),
  name: z.string(),
  fields: z.lazy(() => FieldUncheckedCreateNestedManyWithoutTableInputSchema).optional()
}).strict();

export const TableUpdateInputSchema: z.ZodType<Prisma.TableUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  base: z.lazy(() => BaseUpdateOneRequiredWithoutTablesNestedInputSchema).optional(),
  fields: z.lazy(() => FieldUpdateManyWithoutTableNestedInputSchema).optional()
}).strict();

export const TableUncheckedUpdateInputSchema: z.ZodType<Prisma.TableUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fields: z.lazy(() => FieldUncheckedUpdateManyWithoutTableNestedInputSchema).optional()
}).strict();

export const TableCreateManyInputSchema: z.ZodType<Prisma.TableCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  baseId: z.string(),
  name: z.string()
}).strict();

export const TableUpdateManyMutationInputSchema: z.ZodType<Prisma.TableUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TableUncheckedUpdateManyInputSchema: z.ZodType<Prisma.TableUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FieldCreateInputSchema: z.ZodType<Prisma.FieldCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  fieldType: z.lazy(() => FieldTypeSchema),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  table: z.lazy(() => TableCreateNestedOneWithoutFieldsInputSchema)
}).strict();

export const FieldUncheckedCreateInputSchema: z.ZodType<Prisma.FieldUncheckedCreateInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  tabelId: z.string(),
  fieldType: z.lazy(() => FieldTypeSchema),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const FieldUpdateInputSchema: z.ZodType<Prisma.FieldUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldType: z.union([ z.lazy(() => FieldTypeSchema),z.lazy(() => EnumFieldTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  table: z.lazy(() => TableUpdateOneRequiredWithoutFieldsNestedInputSchema).optional()
}).strict();

export const FieldUncheckedUpdateInputSchema: z.ZodType<Prisma.FieldUncheckedUpdateInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tabelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldType: z.union([ z.lazy(() => FieldTypeSchema),z.lazy(() => EnumFieldTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const FieldCreateManyInputSchema: z.ZodType<Prisma.FieldCreateManyInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  tabelId: z.string(),
  fieldType: z.lazy(() => FieldTypeSchema),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const FieldUpdateManyMutationInputSchema: z.ZodType<Prisma.FieldUpdateManyMutationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldType: z.union([ z.lazy(() => FieldTypeSchema),z.lazy(() => EnumFieldTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const FieldUncheckedUpdateManyInputSchema: z.ZodType<Prisma.FieldUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tabelId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldType: z.union([ z.lazy(() => FieldTypeSchema),z.lazy(() => EnumFieldTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const EnumAutomationTriggerTypeFilterSchema: z.ZodType<Prisma.EnumAutomationTriggerTypeFilter> = z.object({
  equals: z.lazy(() => AutomationTriggerTypeSchema).optional(),
  in: z.lazy(() => AutomationTriggerTypeSchema).array().optional(),
  notIn: z.lazy(() => AutomationTriggerTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => NestedEnumAutomationTriggerTypeFilterSchema) ]).optional(),
}).strict();

export const JsonNullableFilterSchema: z.ZodType<Prisma.JsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  not: InputJsonValueSchema.optional()
}).strict();

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const AutomationActionListRelationFilterSchema: z.ZodType<Prisma.AutomationActionListRelationFilter> = z.object({
  every: z.lazy(() => AutomationActionWhereInputSchema).optional(),
  some: z.lazy(() => AutomationActionWhereInputSchema).optional(),
  none: z.lazy(() => AutomationActionWhereInputSchema).optional()
}).strict();

export const AutomationExecutionLogListRelationFilterSchema: z.ZodType<Prisma.AutomationExecutionLogListRelationFilter> = z.object({
  every: z.lazy(() => AutomationExecutionLogWhereInputSchema).optional(),
  some: z.lazy(() => AutomationExecutionLogWhereInputSchema).optional(),
  none: z.lazy(() => AutomationExecutionLogWhereInputSchema).optional()
}).strict();

export const AutomationTestRunListRelationFilterSchema: z.ZodType<Prisma.AutomationTestRunListRelationFilter> = z.object({
  every: z.lazy(() => AutomationTestRunWhereInputSchema).optional(),
  some: z.lazy(() => AutomationTestRunWhereInputSchema).optional(),
  none: z.lazy(() => AutomationTestRunWhereInputSchema).optional()
}).strict();

export const SortOrderInputSchema: z.ZodType<Prisma.SortOrderInput> = z.object({
  sort: z.lazy(() => SortOrderSchema),
  nulls: z.lazy(() => NullsOrderSchema).optional()
}).strict();

export const AutomationActionOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AutomationActionOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationExecutionLogOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AutomationExecutionLogOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationTestRunOrderByRelationAggregateInputSchema: z.ZodType<Prisma.AutomationTestRunOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationCountOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  triggerType: z.lazy(() => SortOrderSchema).optional(),
  triggerConfig: z.lazy(() => SortOrderSchema).optional(),
  conditions: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  createdTime: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  triggerType: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  createdTime: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationMinOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  triggerType: z.lazy(() => SortOrderSchema).optional(),
  enabled: z.lazy(() => SortOrderSchema).optional(),
  createdTime: z.lazy(() => SortOrderSchema).optional(),
  createdBy: z.lazy(() => SortOrderSchema).optional(),
  updatedTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const EnumAutomationTriggerTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumAutomationTriggerTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AutomationTriggerTypeSchema).optional(),
  in: z.lazy(() => AutomationTriggerTypeSchema).array().optional(),
  notIn: z.lazy(() => AutomationTriggerTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => NestedEnumAutomationTriggerTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAutomationTriggerTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAutomationTriggerTypeFilterSchema).optional()
}).strict();

export const JsonNullableWithAggregatesFilterSchema: z.ZodType<Prisma.JsonNullableWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonNullableFilterSchema).optional()
}).strict();

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const EnumAutomationActionTypeFilterSchema: z.ZodType<Prisma.EnumAutomationActionTypeFilter> = z.object({
  equals: z.lazy(() => AutomationActionTypeSchema).optional(),
  in: z.lazy(() => AutomationActionTypeSchema).array().optional(),
  notIn: z.lazy(() => AutomationActionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AutomationActionTypeSchema),z.lazy(() => NestedEnumAutomationActionTypeFilterSchema) ]).optional(),
}).strict();

export const AutomationScalarRelationFilterSchema: z.ZodType<Prisma.AutomationScalarRelationFilter> = z.object({
  is: z.lazy(() => AutomationWhereInputSchema).optional(),
  isNot: z.lazy(() => AutomationWhereInputSchema).optional()
}).strict();

export const AutomationActionCountOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationActionCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  params: z.lazy(() => SortOrderSchema).optional(),
  conditions: z.lazy(() => SortOrderSchema).optional(),
  createdTime: z.lazy(() => SortOrderSchema).optional(),
  updatedTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationActionAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationActionAvgOrderByAggregateInput> = z.object({
  order: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationActionMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationActionMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdTime: z.lazy(() => SortOrderSchema).optional(),
  updatedTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationActionMinOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationActionMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  order: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  createdTime: z.lazy(() => SortOrderSchema).optional(),
  updatedTime: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationActionSumOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationActionSumOrderByAggregateInput> = z.object({
  order: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const EnumAutomationActionTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumAutomationActionTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AutomationActionTypeSchema).optional(),
  in: z.lazy(() => AutomationActionTypeSchema).array().optional(),
  notIn: z.lazy(() => AutomationActionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AutomationActionTypeSchema),z.lazy(() => NestedEnumAutomationActionTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAutomationActionTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAutomationActionTypeFilterSchema).optional()
}).strict();

export const EnumStatusTypeNullableFilterSchema: z.ZodType<Prisma.EnumStatusTypeNullableFilter> = z.object({
  equals: z.lazy(() => StatusTypeSchema).optional().nullable(),
  in: z.lazy(() => StatusTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => StatusTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => StatusTypeSchema),z.lazy(() => NestedEnumStatusTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const AutomationExecutionLogCountOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationExecutionLogCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  eventData: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
  executedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationExecutionLogMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationExecutionLogMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
  executedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationExecutionLogMinOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationExecutionLogMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  error: z.lazy(() => SortOrderSchema).optional(),
  executedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumStatusTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.EnumStatusTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StatusTypeSchema).optional().nullable(),
  in: z.lazy(() => StatusTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => StatusTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => StatusTypeSchema),z.lazy(() => NestedEnumStatusTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusTypeNullableFilterSchema).optional()
}).strict();

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  not: InputJsonValueSchema.optional()
}).strict();

export const AutomationTestRunCountOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationTestRunCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  testData: z.lazy(() => SortOrderSchema).optional(),
  result: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  executedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationTestRunMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationTestRunMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  executedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AutomationTestRunMinOrderByAggregateInputSchema: z.ZodType<Prisma.AutomationTestRunMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  automationId: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  executedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional()
}).strict();

export const TableListRelationFilterSchema: z.ZodType<Prisma.TableListRelationFilter> = z.object({
  every: z.lazy(() => TableWhereInputSchema).optional(),
  some: z.lazy(() => TableWhereInputSchema).optional(),
  none: z.lazy(() => TableWhereInputSchema).optional()
}).strict();

export const SpaceScalarRelationFilterSchema: z.ZodType<Prisma.SpaceScalarRelationFilter> = z.object({
  is: z.lazy(() => SpaceWhereInputSchema).optional(),
  isNot: z.lazy(() => SpaceWhereInputSchema).optional()
}).strict();

export const TableOrderByRelationAggregateInputSchema: z.ZodType<Prisma.TableOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BaseCountOrderByAggregateInputSchema: z.ZodType<Prisma.BaseCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BaseMaxOrderByAggregateInputSchema: z.ZodType<Prisma.BaseMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BaseMinOrderByAggregateInputSchema: z.ZodType<Prisma.BaseMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  spaceId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BaseListRelationFilterSchema: z.ZodType<Prisma.BaseListRelationFilter> = z.object({
  every: z.lazy(() => BaseWhereInputSchema).optional(),
  some: z.lazy(() => BaseWhereInputSchema).optional(),
  none: z.lazy(() => BaseWhereInputSchema).optional()
}).strict();

export const BaseOrderByRelationAggregateInputSchema: z.ZodType<Prisma.BaseOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SpaceCountOrderByAggregateInputSchema: z.ZodType<Prisma.SpaceCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SpaceMaxOrderByAggregateInputSchema: z.ZodType<Prisma.SpaceMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const SpaceMinOrderByAggregateInputSchema: z.ZodType<Prisma.SpaceMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const BaseScalarRelationFilterSchema: z.ZodType<Prisma.BaseScalarRelationFilter> = z.object({
  is: z.lazy(() => BaseWhereInputSchema).optional(),
  isNot: z.lazy(() => BaseWhereInputSchema).optional()
}).strict();

export const FieldListRelationFilterSchema: z.ZodType<Prisma.FieldListRelationFilter> = z.object({
  every: z.lazy(() => FieldWhereInputSchema).optional(),
  some: z.lazy(() => FieldWhereInputSchema).optional(),
  none: z.lazy(() => FieldWhereInputSchema).optional()
}).strict();

export const FieldOrderByRelationAggregateInputSchema: z.ZodType<Prisma.FieldOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TableCountOrderByAggregateInputSchema: z.ZodType<Prisma.TableCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  baseId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TableMaxOrderByAggregateInputSchema: z.ZodType<Prisma.TableMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  baseId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const TableMinOrderByAggregateInputSchema: z.ZodType<Prisma.TableMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  baseId: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumFieldTypeFilterSchema: z.ZodType<Prisma.EnumFieldTypeFilter> = z.object({
  equals: z.lazy(() => FieldTypeSchema).optional(),
  in: z.lazy(() => FieldTypeSchema).array().optional(),
  notIn: z.lazy(() => FieldTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => FieldTypeSchema),z.lazy(() => NestedEnumFieldTypeFilterSchema) ]).optional(),
}).strict();

export const TableScalarRelationFilterSchema: z.ZodType<Prisma.TableScalarRelationFilter> = z.object({
  is: z.lazy(() => TableWhereInputSchema).optional(),
  isNot: z.lazy(() => TableWhereInputSchema).optional()
}).strict();

export const FieldCountOrderByAggregateInputSchema: z.ZodType<Prisma.FieldCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tabelId: z.lazy(() => SortOrderSchema).optional(),
  fieldType: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FieldMaxOrderByAggregateInputSchema: z.ZodType<Prisma.FieldMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tabelId: z.lazy(() => SortOrderSchema).optional(),
  fieldType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const FieldMinOrderByAggregateInputSchema: z.ZodType<Prisma.FieldMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  tabelId: z.lazy(() => SortOrderSchema).optional(),
  fieldType: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const EnumFieldTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumFieldTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => FieldTypeSchema).optional(),
  in: z.lazy(() => FieldTypeSchema).array().optional(),
  notIn: z.lazy(() => FieldTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => FieldTypeSchema),z.lazy(() => NestedEnumFieldTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFieldTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFieldTypeFilterSchema).optional()
}).strict();

export const AutomationActionCreateNestedManyWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationActionCreateNestedManyWithoutAutomationInput> = z.object({
  create: z.union([ z.lazy(() => AutomationActionCreateWithoutAutomationInputSchema),z.lazy(() => AutomationActionCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationActionUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationActionUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationActionCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationActionCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationActionCreateManyAutomationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AutomationActionWhereUniqueInputSchema),z.lazy(() => AutomationActionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AutomationExecutionLogCreateNestedManyWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogCreateNestedManyWithoutAutomationInput> = z.object({
  create: z.union([ z.lazy(() => AutomationExecutionLogCreateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationExecutionLogUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationExecutionLogCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationExecutionLogCreateManyAutomationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AutomationTestRunCreateNestedManyWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunCreateNestedManyWithoutAutomationInput> = z.object({
  create: z.union([ z.lazy(() => AutomationTestRunCreateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationTestRunUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationTestRunCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationTestRunCreateManyAutomationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AutomationTestRunWhereUniqueInputSchema),z.lazy(() => AutomationTestRunWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AutomationActionUncheckedCreateNestedManyWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationActionUncheckedCreateNestedManyWithoutAutomationInput> = z.object({
  create: z.union([ z.lazy(() => AutomationActionCreateWithoutAutomationInputSchema),z.lazy(() => AutomationActionCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationActionUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationActionUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationActionCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationActionCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationActionCreateManyAutomationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AutomationActionWhereUniqueInputSchema),z.lazy(() => AutomationActionWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AutomationExecutionLogUncheckedCreateNestedManyWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogUncheckedCreateNestedManyWithoutAutomationInput> = z.object({
  create: z.union([ z.lazy(() => AutomationExecutionLogCreateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationExecutionLogUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationExecutionLogCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationExecutionLogCreateManyAutomationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const AutomationTestRunUncheckedCreateNestedManyWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunUncheckedCreateNestedManyWithoutAutomationInput> = z.object({
  create: z.union([ z.lazy(() => AutomationTestRunCreateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationTestRunUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationTestRunCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationTestRunCreateManyAutomationInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => AutomationTestRunWhereUniqueInputSchema),z.lazy(() => AutomationTestRunWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const EnumAutomationTriggerTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumAutomationTriggerTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => AutomationTriggerTypeSchema).optional()
}).strict();

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.object({
  set: z.boolean().optional()
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional().nullable()
}).strict();

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional().nullable()
}).strict();

export const AutomationActionUpdateManyWithoutAutomationNestedInputSchema: z.ZodType<Prisma.AutomationActionUpdateManyWithoutAutomationNestedInput> = z.object({
  create: z.union([ z.lazy(() => AutomationActionCreateWithoutAutomationInputSchema),z.lazy(() => AutomationActionCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationActionUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationActionUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationActionCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationActionCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AutomationActionUpsertWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationActionUpsertWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationActionCreateManyAutomationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AutomationActionWhereUniqueInputSchema),z.lazy(() => AutomationActionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AutomationActionWhereUniqueInputSchema),z.lazy(() => AutomationActionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AutomationActionWhereUniqueInputSchema),z.lazy(() => AutomationActionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AutomationActionWhereUniqueInputSchema),z.lazy(() => AutomationActionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AutomationActionUpdateWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationActionUpdateWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AutomationActionUpdateManyWithWhereWithoutAutomationInputSchema),z.lazy(() => AutomationActionUpdateManyWithWhereWithoutAutomationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AutomationActionScalarWhereInputSchema),z.lazy(() => AutomationActionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AutomationExecutionLogUpdateManyWithoutAutomationNestedInputSchema: z.ZodType<Prisma.AutomationExecutionLogUpdateManyWithoutAutomationNestedInput> = z.object({
  create: z.union([ z.lazy(() => AutomationExecutionLogCreateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationExecutionLogUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationExecutionLogCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AutomationExecutionLogUpsertWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUpsertWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationExecutionLogCreateManyAutomationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AutomationExecutionLogUpdateWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUpdateWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AutomationExecutionLogUpdateManyWithWhereWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUpdateManyWithWhereWithoutAutomationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AutomationExecutionLogScalarWhereInputSchema),z.lazy(() => AutomationExecutionLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AutomationTestRunUpdateManyWithoutAutomationNestedInputSchema: z.ZodType<Prisma.AutomationTestRunUpdateManyWithoutAutomationNestedInput> = z.object({
  create: z.union([ z.lazy(() => AutomationTestRunCreateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationTestRunUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationTestRunCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AutomationTestRunUpsertWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUpsertWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationTestRunCreateManyAutomationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AutomationTestRunWhereUniqueInputSchema),z.lazy(() => AutomationTestRunWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AutomationTestRunWhereUniqueInputSchema),z.lazy(() => AutomationTestRunWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AutomationTestRunWhereUniqueInputSchema),z.lazy(() => AutomationTestRunWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AutomationTestRunWhereUniqueInputSchema),z.lazy(() => AutomationTestRunWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AutomationTestRunUpdateWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUpdateWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AutomationTestRunUpdateManyWithWhereWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUpdateManyWithWhereWithoutAutomationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AutomationTestRunScalarWhereInputSchema),z.lazy(() => AutomationTestRunScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AutomationActionUncheckedUpdateManyWithoutAutomationNestedInputSchema: z.ZodType<Prisma.AutomationActionUncheckedUpdateManyWithoutAutomationNestedInput> = z.object({
  create: z.union([ z.lazy(() => AutomationActionCreateWithoutAutomationInputSchema),z.lazy(() => AutomationActionCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationActionUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationActionUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationActionCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationActionCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AutomationActionUpsertWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationActionUpsertWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationActionCreateManyAutomationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AutomationActionWhereUniqueInputSchema),z.lazy(() => AutomationActionWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AutomationActionWhereUniqueInputSchema),z.lazy(() => AutomationActionWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AutomationActionWhereUniqueInputSchema),z.lazy(() => AutomationActionWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AutomationActionWhereUniqueInputSchema),z.lazy(() => AutomationActionWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AutomationActionUpdateWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationActionUpdateWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AutomationActionUpdateManyWithWhereWithoutAutomationInputSchema),z.lazy(() => AutomationActionUpdateManyWithWhereWithoutAutomationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AutomationActionScalarWhereInputSchema),z.lazy(() => AutomationActionScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AutomationExecutionLogUncheckedUpdateManyWithoutAutomationNestedInputSchema: z.ZodType<Prisma.AutomationExecutionLogUncheckedUpdateManyWithoutAutomationNestedInput> = z.object({
  create: z.union([ z.lazy(() => AutomationExecutionLogCreateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationExecutionLogUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationExecutionLogCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AutomationExecutionLogUpsertWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUpsertWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationExecutionLogCreateManyAutomationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AutomationExecutionLogUpdateWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUpdateWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AutomationExecutionLogUpdateManyWithWhereWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUpdateManyWithWhereWithoutAutomationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AutomationExecutionLogScalarWhereInputSchema),z.lazy(() => AutomationExecutionLogScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AutomationTestRunUncheckedUpdateManyWithoutAutomationNestedInputSchema: z.ZodType<Prisma.AutomationTestRunUncheckedUpdateManyWithoutAutomationNestedInput> = z.object({
  create: z.union([ z.lazy(() => AutomationTestRunCreateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunCreateWithoutAutomationInputSchema).array(),z.lazy(() => AutomationTestRunUncheckedCreateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUncheckedCreateWithoutAutomationInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => AutomationTestRunCreateOrConnectWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunCreateOrConnectWithoutAutomationInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => AutomationTestRunUpsertWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUpsertWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  createMany: z.lazy(() => AutomationTestRunCreateManyAutomationInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => AutomationTestRunWhereUniqueInputSchema),z.lazy(() => AutomationTestRunWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => AutomationTestRunWhereUniqueInputSchema),z.lazy(() => AutomationTestRunWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => AutomationTestRunWhereUniqueInputSchema),z.lazy(() => AutomationTestRunWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => AutomationTestRunWhereUniqueInputSchema),z.lazy(() => AutomationTestRunWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => AutomationTestRunUpdateWithWhereUniqueWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUpdateWithWhereUniqueWithoutAutomationInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => AutomationTestRunUpdateManyWithWhereWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUpdateManyWithWhereWithoutAutomationInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => AutomationTestRunScalarWhereInputSchema),z.lazy(() => AutomationTestRunScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const AutomationCreateNestedOneWithoutActionsInputSchema: z.ZodType<Prisma.AutomationCreateNestedOneWithoutActionsInput> = z.object({
  create: z.union([ z.lazy(() => AutomationCreateWithoutActionsInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutActionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AutomationCreateOrConnectWithoutActionsInputSchema).optional(),
  connect: z.lazy(() => AutomationWhereUniqueInputSchema).optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const EnumAutomationActionTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumAutomationActionTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => AutomationActionTypeSchema).optional()
}).strict();

export const AutomationUpdateOneRequiredWithoutActionsNestedInputSchema: z.ZodType<Prisma.AutomationUpdateOneRequiredWithoutActionsNestedInput> = z.object({
  create: z.union([ z.lazy(() => AutomationCreateWithoutActionsInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutActionsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AutomationCreateOrConnectWithoutActionsInputSchema).optional(),
  upsert: z.lazy(() => AutomationUpsertWithoutActionsInputSchema).optional(),
  connect: z.lazy(() => AutomationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AutomationUpdateToOneWithWhereWithoutActionsInputSchema),z.lazy(() => AutomationUpdateWithoutActionsInputSchema),z.lazy(() => AutomationUncheckedUpdateWithoutActionsInputSchema) ]).optional(),
}).strict();

export const AutomationCreateNestedOneWithoutAutomationExecutionLogInputSchema: z.ZodType<Prisma.AutomationCreateNestedOneWithoutAutomationExecutionLogInput> = z.object({
  create: z.union([ z.lazy(() => AutomationCreateWithoutAutomationExecutionLogInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutAutomationExecutionLogInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AutomationCreateOrConnectWithoutAutomationExecutionLogInputSchema).optional(),
  connect: z.lazy(() => AutomationWhereUniqueInputSchema).optional()
}).strict();

export const NullableEnumStatusTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableEnumStatusTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => StatusTypeSchema).optional().nullable()
}).strict();

export const AutomationUpdateOneRequiredWithoutAutomationExecutionLogNestedInputSchema: z.ZodType<Prisma.AutomationUpdateOneRequiredWithoutAutomationExecutionLogNestedInput> = z.object({
  create: z.union([ z.lazy(() => AutomationCreateWithoutAutomationExecutionLogInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutAutomationExecutionLogInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AutomationCreateOrConnectWithoutAutomationExecutionLogInputSchema).optional(),
  upsert: z.lazy(() => AutomationUpsertWithoutAutomationExecutionLogInputSchema).optional(),
  connect: z.lazy(() => AutomationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AutomationUpdateToOneWithWhereWithoutAutomationExecutionLogInputSchema),z.lazy(() => AutomationUpdateWithoutAutomationExecutionLogInputSchema),z.lazy(() => AutomationUncheckedUpdateWithoutAutomationExecutionLogInputSchema) ]).optional(),
}).strict();

export const AutomationCreateNestedOneWithoutAutomationTestRunInputSchema: z.ZodType<Prisma.AutomationCreateNestedOneWithoutAutomationTestRunInput> = z.object({
  create: z.union([ z.lazy(() => AutomationCreateWithoutAutomationTestRunInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutAutomationTestRunInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AutomationCreateOrConnectWithoutAutomationTestRunInputSchema).optional(),
  connect: z.lazy(() => AutomationWhereUniqueInputSchema).optional()
}).strict();

export const AutomationUpdateOneRequiredWithoutAutomationTestRunNestedInputSchema: z.ZodType<Prisma.AutomationUpdateOneRequiredWithoutAutomationTestRunNestedInput> = z.object({
  create: z.union([ z.lazy(() => AutomationCreateWithoutAutomationTestRunInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutAutomationTestRunInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AutomationCreateOrConnectWithoutAutomationTestRunInputSchema).optional(),
  upsert: z.lazy(() => AutomationUpsertWithoutAutomationTestRunInputSchema).optional(),
  connect: z.lazy(() => AutomationWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AutomationUpdateToOneWithWhereWithoutAutomationTestRunInputSchema),z.lazy(() => AutomationUpdateWithoutAutomationTestRunInputSchema),z.lazy(() => AutomationUncheckedUpdateWithoutAutomationTestRunInputSchema) ]).optional(),
}).strict();

export const TableCreateNestedManyWithoutBaseInputSchema: z.ZodType<Prisma.TableCreateNestedManyWithoutBaseInput> = z.object({
  create: z.union([ z.lazy(() => TableCreateWithoutBaseInputSchema),z.lazy(() => TableCreateWithoutBaseInputSchema).array(),z.lazy(() => TableUncheckedCreateWithoutBaseInputSchema),z.lazy(() => TableUncheckedCreateWithoutBaseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TableCreateOrConnectWithoutBaseInputSchema),z.lazy(() => TableCreateOrConnectWithoutBaseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TableCreateManyBaseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TableWhereUniqueInputSchema),z.lazy(() => TableWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const SpaceCreateNestedOneWithoutBaseGroupInputSchema: z.ZodType<Prisma.SpaceCreateNestedOneWithoutBaseGroupInput> = z.object({
  create: z.union([ z.lazy(() => SpaceCreateWithoutBaseGroupInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutBaseGroupInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SpaceCreateOrConnectWithoutBaseGroupInputSchema).optional(),
  connect: z.lazy(() => SpaceWhereUniqueInputSchema).optional()
}).strict();

export const TableUncheckedCreateNestedManyWithoutBaseInputSchema: z.ZodType<Prisma.TableUncheckedCreateNestedManyWithoutBaseInput> = z.object({
  create: z.union([ z.lazy(() => TableCreateWithoutBaseInputSchema),z.lazy(() => TableCreateWithoutBaseInputSchema).array(),z.lazy(() => TableUncheckedCreateWithoutBaseInputSchema),z.lazy(() => TableUncheckedCreateWithoutBaseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TableCreateOrConnectWithoutBaseInputSchema),z.lazy(() => TableCreateOrConnectWithoutBaseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TableCreateManyBaseInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => TableWhereUniqueInputSchema),z.lazy(() => TableWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const TableUpdateManyWithoutBaseNestedInputSchema: z.ZodType<Prisma.TableUpdateManyWithoutBaseNestedInput> = z.object({
  create: z.union([ z.lazy(() => TableCreateWithoutBaseInputSchema),z.lazy(() => TableCreateWithoutBaseInputSchema).array(),z.lazy(() => TableUncheckedCreateWithoutBaseInputSchema),z.lazy(() => TableUncheckedCreateWithoutBaseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TableCreateOrConnectWithoutBaseInputSchema),z.lazy(() => TableCreateOrConnectWithoutBaseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TableUpsertWithWhereUniqueWithoutBaseInputSchema),z.lazy(() => TableUpsertWithWhereUniqueWithoutBaseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TableCreateManyBaseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TableWhereUniqueInputSchema),z.lazy(() => TableWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TableWhereUniqueInputSchema),z.lazy(() => TableWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TableWhereUniqueInputSchema),z.lazy(() => TableWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TableWhereUniqueInputSchema),z.lazy(() => TableWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TableUpdateWithWhereUniqueWithoutBaseInputSchema),z.lazy(() => TableUpdateWithWhereUniqueWithoutBaseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TableUpdateManyWithWhereWithoutBaseInputSchema),z.lazy(() => TableUpdateManyWithWhereWithoutBaseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TableScalarWhereInputSchema),z.lazy(() => TableScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const SpaceUpdateOneRequiredWithoutBaseGroupNestedInputSchema: z.ZodType<Prisma.SpaceUpdateOneRequiredWithoutBaseGroupNestedInput> = z.object({
  create: z.union([ z.lazy(() => SpaceCreateWithoutBaseGroupInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutBaseGroupInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => SpaceCreateOrConnectWithoutBaseGroupInputSchema).optional(),
  upsert: z.lazy(() => SpaceUpsertWithoutBaseGroupInputSchema).optional(),
  connect: z.lazy(() => SpaceWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => SpaceUpdateToOneWithWhereWithoutBaseGroupInputSchema),z.lazy(() => SpaceUpdateWithoutBaseGroupInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutBaseGroupInputSchema) ]).optional(),
}).strict();

export const TableUncheckedUpdateManyWithoutBaseNestedInputSchema: z.ZodType<Prisma.TableUncheckedUpdateManyWithoutBaseNestedInput> = z.object({
  create: z.union([ z.lazy(() => TableCreateWithoutBaseInputSchema),z.lazy(() => TableCreateWithoutBaseInputSchema).array(),z.lazy(() => TableUncheckedCreateWithoutBaseInputSchema),z.lazy(() => TableUncheckedCreateWithoutBaseInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => TableCreateOrConnectWithoutBaseInputSchema),z.lazy(() => TableCreateOrConnectWithoutBaseInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => TableUpsertWithWhereUniqueWithoutBaseInputSchema),z.lazy(() => TableUpsertWithWhereUniqueWithoutBaseInputSchema).array() ]).optional(),
  createMany: z.lazy(() => TableCreateManyBaseInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => TableWhereUniqueInputSchema),z.lazy(() => TableWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => TableWhereUniqueInputSchema),z.lazy(() => TableWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => TableWhereUniqueInputSchema),z.lazy(() => TableWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => TableWhereUniqueInputSchema),z.lazy(() => TableWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => TableUpdateWithWhereUniqueWithoutBaseInputSchema),z.lazy(() => TableUpdateWithWhereUniqueWithoutBaseInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => TableUpdateManyWithWhereWithoutBaseInputSchema),z.lazy(() => TableUpdateManyWithWhereWithoutBaseInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => TableScalarWhereInputSchema),z.lazy(() => TableScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BaseCreateNestedManyWithoutSpaceInputSchema: z.ZodType<Prisma.BaseCreateNestedManyWithoutSpaceInput> = z.object({
  create: z.union([ z.lazy(() => BaseCreateWithoutSpaceInputSchema),z.lazy(() => BaseCreateWithoutSpaceInputSchema).array(),z.lazy(() => BaseUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => BaseUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BaseCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => BaseCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BaseCreateManySpaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BaseWhereUniqueInputSchema),z.lazy(() => BaseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BaseUncheckedCreateNestedManyWithoutSpaceInputSchema: z.ZodType<Prisma.BaseUncheckedCreateNestedManyWithoutSpaceInput> = z.object({
  create: z.union([ z.lazy(() => BaseCreateWithoutSpaceInputSchema),z.lazy(() => BaseCreateWithoutSpaceInputSchema).array(),z.lazy(() => BaseUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => BaseUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BaseCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => BaseCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BaseCreateManySpaceInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => BaseWhereUniqueInputSchema),z.lazy(() => BaseWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BaseUpdateManyWithoutSpaceNestedInputSchema: z.ZodType<Prisma.BaseUpdateManyWithoutSpaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => BaseCreateWithoutSpaceInputSchema),z.lazy(() => BaseCreateWithoutSpaceInputSchema).array(),z.lazy(() => BaseUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => BaseUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BaseCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => BaseCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BaseUpsertWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => BaseUpsertWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BaseCreateManySpaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BaseWhereUniqueInputSchema),z.lazy(() => BaseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BaseWhereUniqueInputSchema),z.lazy(() => BaseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BaseWhereUniqueInputSchema),z.lazy(() => BaseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BaseWhereUniqueInputSchema),z.lazy(() => BaseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BaseUpdateWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => BaseUpdateWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BaseUpdateManyWithWhereWithoutSpaceInputSchema),z.lazy(() => BaseUpdateManyWithWhereWithoutSpaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BaseScalarWhereInputSchema),z.lazy(() => BaseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BaseUncheckedUpdateManyWithoutSpaceNestedInputSchema: z.ZodType<Prisma.BaseUncheckedUpdateManyWithoutSpaceNestedInput> = z.object({
  create: z.union([ z.lazy(() => BaseCreateWithoutSpaceInputSchema),z.lazy(() => BaseCreateWithoutSpaceInputSchema).array(),z.lazy(() => BaseUncheckedCreateWithoutSpaceInputSchema),z.lazy(() => BaseUncheckedCreateWithoutSpaceInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => BaseCreateOrConnectWithoutSpaceInputSchema),z.lazy(() => BaseCreateOrConnectWithoutSpaceInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => BaseUpsertWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => BaseUpsertWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  createMany: z.lazy(() => BaseCreateManySpaceInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => BaseWhereUniqueInputSchema),z.lazy(() => BaseWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => BaseWhereUniqueInputSchema),z.lazy(() => BaseWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => BaseWhereUniqueInputSchema),z.lazy(() => BaseWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => BaseWhereUniqueInputSchema),z.lazy(() => BaseWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => BaseUpdateWithWhereUniqueWithoutSpaceInputSchema),z.lazy(() => BaseUpdateWithWhereUniqueWithoutSpaceInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => BaseUpdateManyWithWhereWithoutSpaceInputSchema),z.lazy(() => BaseUpdateManyWithWhereWithoutSpaceInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => BaseScalarWhereInputSchema),z.lazy(() => BaseScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const BaseCreateNestedOneWithoutTablesInputSchema: z.ZodType<Prisma.BaseCreateNestedOneWithoutTablesInput> = z.object({
  create: z.union([ z.lazy(() => BaseCreateWithoutTablesInputSchema),z.lazy(() => BaseUncheckedCreateWithoutTablesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BaseCreateOrConnectWithoutTablesInputSchema).optional(),
  connect: z.lazy(() => BaseWhereUniqueInputSchema).optional()
}).strict();

export const FieldCreateNestedManyWithoutTableInputSchema: z.ZodType<Prisma.FieldCreateNestedManyWithoutTableInput> = z.object({
  create: z.union([ z.lazy(() => FieldCreateWithoutTableInputSchema),z.lazy(() => FieldCreateWithoutTableInputSchema).array(),z.lazy(() => FieldUncheckedCreateWithoutTableInputSchema),z.lazy(() => FieldUncheckedCreateWithoutTableInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FieldCreateOrConnectWithoutTableInputSchema),z.lazy(() => FieldCreateOrConnectWithoutTableInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FieldCreateManyTableInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FieldWhereUniqueInputSchema),z.lazy(() => FieldWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const FieldUncheckedCreateNestedManyWithoutTableInputSchema: z.ZodType<Prisma.FieldUncheckedCreateNestedManyWithoutTableInput> = z.object({
  create: z.union([ z.lazy(() => FieldCreateWithoutTableInputSchema),z.lazy(() => FieldCreateWithoutTableInputSchema).array(),z.lazy(() => FieldUncheckedCreateWithoutTableInputSchema),z.lazy(() => FieldUncheckedCreateWithoutTableInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FieldCreateOrConnectWithoutTableInputSchema),z.lazy(() => FieldCreateOrConnectWithoutTableInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FieldCreateManyTableInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => FieldWhereUniqueInputSchema),z.lazy(() => FieldWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const BaseUpdateOneRequiredWithoutTablesNestedInputSchema: z.ZodType<Prisma.BaseUpdateOneRequiredWithoutTablesNestedInput> = z.object({
  create: z.union([ z.lazy(() => BaseCreateWithoutTablesInputSchema),z.lazy(() => BaseUncheckedCreateWithoutTablesInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => BaseCreateOrConnectWithoutTablesInputSchema).optional(),
  upsert: z.lazy(() => BaseUpsertWithoutTablesInputSchema).optional(),
  connect: z.lazy(() => BaseWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => BaseUpdateToOneWithWhereWithoutTablesInputSchema),z.lazy(() => BaseUpdateWithoutTablesInputSchema),z.lazy(() => BaseUncheckedUpdateWithoutTablesInputSchema) ]).optional(),
}).strict();

export const FieldUpdateManyWithoutTableNestedInputSchema: z.ZodType<Prisma.FieldUpdateManyWithoutTableNestedInput> = z.object({
  create: z.union([ z.lazy(() => FieldCreateWithoutTableInputSchema),z.lazy(() => FieldCreateWithoutTableInputSchema).array(),z.lazy(() => FieldUncheckedCreateWithoutTableInputSchema),z.lazy(() => FieldUncheckedCreateWithoutTableInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FieldCreateOrConnectWithoutTableInputSchema),z.lazy(() => FieldCreateOrConnectWithoutTableInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FieldUpsertWithWhereUniqueWithoutTableInputSchema),z.lazy(() => FieldUpsertWithWhereUniqueWithoutTableInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FieldCreateManyTableInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FieldWhereUniqueInputSchema),z.lazy(() => FieldWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FieldWhereUniqueInputSchema),z.lazy(() => FieldWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FieldWhereUniqueInputSchema),z.lazy(() => FieldWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FieldWhereUniqueInputSchema),z.lazy(() => FieldWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FieldUpdateWithWhereUniqueWithoutTableInputSchema),z.lazy(() => FieldUpdateWithWhereUniqueWithoutTableInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FieldUpdateManyWithWhereWithoutTableInputSchema),z.lazy(() => FieldUpdateManyWithWhereWithoutTableInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FieldScalarWhereInputSchema),z.lazy(() => FieldScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const FieldUncheckedUpdateManyWithoutTableNestedInputSchema: z.ZodType<Prisma.FieldUncheckedUpdateManyWithoutTableNestedInput> = z.object({
  create: z.union([ z.lazy(() => FieldCreateWithoutTableInputSchema),z.lazy(() => FieldCreateWithoutTableInputSchema).array(),z.lazy(() => FieldUncheckedCreateWithoutTableInputSchema),z.lazy(() => FieldUncheckedCreateWithoutTableInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => FieldCreateOrConnectWithoutTableInputSchema),z.lazy(() => FieldCreateOrConnectWithoutTableInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => FieldUpsertWithWhereUniqueWithoutTableInputSchema),z.lazy(() => FieldUpsertWithWhereUniqueWithoutTableInputSchema).array() ]).optional(),
  createMany: z.lazy(() => FieldCreateManyTableInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => FieldWhereUniqueInputSchema),z.lazy(() => FieldWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => FieldWhereUniqueInputSchema),z.lazy(() => FieldWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => FieldWhereUniqueInputSchema),z.lazy(() => FieldWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => FieldWhereUniqueInputSchema),z.lazy(() => FieldWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => FieldUpdateWithWhereUniqueWithoutTableInputSchema),z.lazy(() => FieldUpdateWithWhereUniqueWithoutTableInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => FieldUpdateManyWithWhereWithoutTableInputSchema),z.lazy(() => FieldUpdateManyWithWhereWithoutTableInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => FieldScalarWhereInputSchema),z.lazy(() => FieldScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const TableCreateNestedOneWithoutFieldsInputSchema: z.ZodType<Prisma.TableCreateNestedOneWithoutFieldsInput> = z.object({
  create: z.union([ z.lazy(() => TableCreateWithoutFieldsInputSchema),z.lazy(() => TableUncheckedCreateWithoutFieldsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TableCreateOrConnectWithoutFieldsInputSchema).optional(),
  connect: z.lazy(() => TableWhereUniqueInputSchema).optional()
}).strict();

export const EnumFieldTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumFieldTypeFieldUpdateOperationsInput> = z.object({
  set: z.lazy(() => FieldTypeSchema).optional()
}).strict();

export const TableUpdateOneRequiredWithoutFieldsNestedInputSchema: z.ZodType<Prisma.TableUpdateOneRequiredWithoutFieldsNestedInput> = z.object({
  create: z.union([ z.lazy(() => TableCreateWithoutFieldsInputSchema),z.lazy(() => TableUncheckedCreateWithoutFieldsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => TableCreateOrConnectWithoutFieldsInputSchema).optional(),
  upsert: z.lazy(() => TableUpsertWithoutFieldsInputSchema).optional(),
  connect: z.lazy(() => TableWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => TableUpdateToOneWithWhereWithoutFieldsInputSchema),z.lazy(() => TableUpdateWithoutFieldsInputSchema),z.lazy(() => TableUncheckedUpdateWithoutFieldsInputSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedEnumAutomationTriggerTypeFilterSchema: z.ZodType<Prisma.NestedEnumAutomationTriggerTypeFilter> = z.object({
  equals: z.lazy(() => AutomationTriggerTypeSchema).optional(),
  in: z.lazy(() => AutomationTriggerTypeSchema).array().optional(),
  notIn: z.lazy(() => AutomationTriggerTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => NestedEnumAutomationTriggerTypeFilterSchema) ]).optional(),
}).strict();

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedEnumAutomationTriggerTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumAutomationTriggerTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AutomationTriggerTypeSchema).optional(),
  in: z.lazy(() => AutomationTriggerTypeSchema).array().optional(),
  notIn: z.lazy(() => AutomationTriggerTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => NestedEnumAutomationTriggerTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAutomationTriggerTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAutomationTriggerTypeFilterSchema).optional()
}).strict();

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.object({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedJsonNullableFilterSchema: z.ZodType<Prisma.NestedJsonNullableFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.object({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional()
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.object({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional()
}).strict();

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional()
}).strict();

export const NestedEnumAutomationActionTypeFilterSchema: z.ZodType<Prisma.NestedEnumAutomationActionTypeFilter> = z.object({
  equals: z.lazy(() => AutomationActionTypeSchema).optional(),
  in: z.lazy(() => AutomationActionTypeSchema).array().optional(),
  notIn: z.lazy(() => AutomationActionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AutomationActionTypeSchema),z.lazy(() => NestedEnumAutomationActionTypeFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedEnumAutomationActionTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumAutomationActionTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => AutomationActionTypeSchema).optional(),
  in: z.lazy(() => AutomationActionTypeSchema).array().optional(),
  notIn: z.lazy(() => AutomationActionTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => AutomationActionTypeSchema),z.lazy(() => NestedEnumAutomationActionTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumAutomationActionTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumAutomationActionTypeFilterSchema).optional()
}).strict();

export const NestedEnumStatusTypeNullableFilterSchema: z.ZodType<Prisma.NestedEnumStatusTypeNullableFilter> = z.object({
  equals: z.lazy(() => StatusTypeSchema).optional().nullable(),
  in: z.lazy(() => StatusTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => StatusTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => StatusTypeSchema),z.lazy(() => NestedEnumStatusTypeNullableFilterSchema) ]).optional().nullable(),
}).strict();

export const NestedEnumStatusTypeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumStatusTypeNullableWithAggregatesFilter> = z.object({
  equals: z.lazy(() => StatusTypeSchema).optional().nullable(),
  in: z.lazy(() => StatusTypeSchema).array().optional().nullable(),
  notIn: z.lazy(() => StatusTypeSchema).array().optional().nullable(),
  not: z.union([ z.lazy(() => StatusTypeSchema),z.lazy(() => NestedEnumStatusTypeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumStatusTypeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumStatusTypeNullableFilterSchema).optional()
}).strict();

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.object({
  equals: InputJsonValueSchema.optional(),
  path: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  string_contains: z.string().optional(),
  string_starts_with: z.string().optional(),
  string_ends_with: z.string().optional(),
  array_starts_with: InputJsonValueSchema.optional().nullable(),
  array_ends_with: InputJsonValueSchema.optional().nullable(),
  not: InputJsonValueSchema.optional()
}).strict();

export const NestedEnumFieldTypeFilterSchema: z.ZodType<Prisma.NestedEnumFieldTypeFilter> = z.object({
  equals: z.lazy(() => FieldTypeSchema).optional(),
  in: z.lazy(() => FieldTypeSchema).array().optional(),
  notIn: z.lazy(() => FieldTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => FieldTypeSchema),z.lazy(() => NestedEnumFieldTypeFilterSchema) ]).optional(),
}).strict();

export const NestedEnumFieldTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumFieldTypeWithAggregatesFilter> = z.object({
  equals: z.lazy(() => FieldTypeSchema).optional(),
  in: z.lazy(() => FieldTypeSchema).array().optional(),
  notIn: z.lazy(() => FieldTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => FieldTypeSchema),z.lazy(() => NestedEnumFieldTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumFieldTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumFieldTypeFilterSchema).optional()
}).strict();

export const AutomationActionCreateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationActionCreateWithoutAutomationInput> = z.object({
  id: z.string().cuid().optional(),
  order: z.number().int(),
  type: z.lazy(() => AutomationActionTypeSchema),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.coerce.date().optional(),
  updatedTime: z.coerce.date().optional().nullable()
}).strict();

export const AutomationActionUncheckedCreateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationActionUncheckedCreateWithoutAutomationInput> = z.object({
  id: z.string().cuid().optional(),
  order: z.number().int(),
  type: z.lazy(() => AutomationActionTypeSchema),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.coerce.date().optional(),
  updatedTime: z.coerce.date().optional().nullable()
}).strict();

export const AutomationActionCreateOrConnectWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationActionCreateOrConnectWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationActionWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AutomationActionCreateWithoutAutomationInputSchema),z.lazy(() => AutomationActionUncheckedCreateWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationActionCreateManyAutomationInputEnvelopeSchema: z.ZodType<Prisma.AutomationActionCreateManyAutomationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AutomationActionCreateManyAutomationInputSchema),z.lazy(() => AutomationActionCreateManyAutomationInputSchema).array() ]),
}).strict();

export const AutomationExecutionLogCreateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogCreateWithoutAutomationInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => StatusTypeSchema).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.string().optional().nullable(),
  executedAt: z.coerce.date().optional()
}).strict();

export const AutomationExecutionLogUncheckedCreateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogUncheckedCreateWithoutAutomationInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => StatusTypeSchema).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.string().optional().nullable(),
  executedAt: z.coerce.date().optional()
}).strict();

export const AutomationExecutionLogCreateOrConnectWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogCreateOrConnectWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AutomationExecutionLogCreateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUncheckedCreateWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationExecutionLogCreateManyAutomationInputEnvelopeSchema: z.ZodType<Prisma.AutomationExecutionLogCreateManyAutomationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AutomationExecutionLogCreateManyAutomationInputSchema),z.lazy(() => AutomationExecutionLogCreateManyAutomationInputSchema).array() ]),
}).strict();

export const AutomationTestRunCreateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunCreateWithoutAutomationInput> = z.object({
  id: z.string().cuid().optional(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.string(),
  executedAt: z.coerce.date().optional()
}).strict();

export const AutomationTestRunUncheckedCreateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunUncheckedCreateWithoutAutomationInput> = z.object({
  id: z.string().cuid().optional(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.string(),
  executedAt: z.coerce.date().optional()
}).strict();

export const AutomationTestRunCreateOrConnectWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunCreateOrConnectWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationTestRunWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AutomationTestRunCreateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUncheckedCreateWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationTestRunCreateManyAutomationInputEnvelopeSchema: z.ZodType<Prisma.AutomationTestRunCreateManyAutomationInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => AutomationTestRunCreateManyAutomationInputSchema),z.lazy(() => AutomationTestRunCreateManyAutomationInputSchema).array() ]),
}).strict();

export const AutomationActionUpsertWithWhereUniqueWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationActionUpsertWithWhereUniqueWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationActionWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AutomationActionUpdateWithoutAutomationInputSchema),z.lazy(() => AutomationActionUncheckedUpdateWithoutAutomationInputSchema) ]),
  create: z.union([ z.lazy(() => AutomationActionCreateWithoutAutomationInputSchema),z.lazy(() => AutomationActionUncheckedCreateWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationActionUpdateWithWhereUniqueWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationActionUpdateWithWhereUniqueWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationActionWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AutomationActionUpdateWithoutAutomationInputSchema),z.lazy(() => AutomationActionUncheckedUpdateWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationActionUpdateManyWithWhereWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationActionUpdateManyWithWhereWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationActionScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AutomationActionUpdateManyMutationInputSchema),z.lazy(() => AutomationActionUncheckedUpdateManyWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationActionScalarWhereInputSchema: z.ZodType<Prisma.AutomationActionScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AutomationActionScalarWhereInputSchema),z.lazy(() => AutomationActionScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationActionScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationActionScalarWhereInputSchema),z.lazy(() => AutomationActionScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  automationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  order: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  type: z.union([ z.lazy(() => EnumAutomationActionTypeFilterSchema),z.lazy(() => AutomationActionTypeSchema) ]).optional(),
  params: z.lazy(() => JsonNullableFilterSchema).optional(),
  conditions: z.lazy(() => JsonNullableFilterSchema).optional(),
  createdTime: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedTime: z.union([ z.lazy(() => DateTimeNullableFilterSchema),z.coerce.date() ]).optional().nullable(),
}).strict();

export const AutomationExecutionLogUpsertWithWhereUniqueWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogUpsertWithWhereUniqueWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AutomationExecutionLogUpdateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUncheckedUpdateWithoutAutomationInputSchema) ]),
  create: z.union([ z.lazy(() => AutomationExecutionLogCreateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUncheckedCreateWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationExecutionLogUpdateWithWhereUniqueWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogUpdateWithWhereUniqueWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationExecutionLogWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AutomationExecutionLogUpdateWithoutAutomationInputSchema),z.lazy(() => AutomationExecutionLogUncheckedUpdateWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationExecutionLogUpdateManyWithWhereWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogUpdateManyWithWhereWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationExecutionLogScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AutomationExecutionLogUpdateManyMutationInputSchema),z.lazy(() => AutomationExecutionLogUncheckedUpdateManyWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationExecutionLogScalarWhereInputSchema: z.ZodType<Prisma.AutomationExecutionLogScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AutomationExecutionLogScalarWhereInputSchema),z.lazy(() => AutomationExecutionLogScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationExecutionLogScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationExecutionLogScalarWhereInputSchema),z.lazy(() => AutomationExecutionLogScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  automationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  status: z.union([ z.lazy(() => EnumStatusTypeNullableFilterSchema),z.lazy(() => StatusTypeSchema) ]).optional().nullable(),
  eventData: z.lazy(() => JsonNullableFilterSchema).optional(),
  result: z.lazy(() => JsonNullableFilterSchema).optional(),
  error: z.union([ z.lazy(() => StringNullableFilterSchema),z.string() ]).optional().nullable(),
  executedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AutomationTestRunUpsertWithWhereUniqueWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunUpsertWithWhereUniqueWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationTestRunWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => AutomationTestRunUpdateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUncheckedUpdateWithoutAutomationInputSchema) ]),
  create: z.union([ z.lazy(() => AutomationTestRunCreateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUncheckedCreateWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationTestRunUpdateWithWhereUniqueWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunUpdateWithWhereUniqueWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationTestRunWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => AutomationTestRunUpdateWithoutAutomationInputSchema),z.lazy(() => AutomationTestRunUncheckedUpdateWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationTestRunUpdateManyWithWhereWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunUpdateManyWithWhereWithoutAutomationInput> = z.object({
  where: z.lazy(() => AutomationTestRunScalarWhereInputSchema),
  data: z.union([ z.lazy(() => AutomationTestRunUpdateManyMutationInputSchema),z.lazy(() => AutomationTestRunUncheckedUpdateManyWithoutAutomationInputSchema) ]),
}).strict();

export const AutomationTestRunScalarWhereInputSchema: z.ZodType<Prisma.AutomationTestRunScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AutomationTestRunScalarWhereInputSchema),z.lazy(() => AutomationTestRunScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AutomationTestRunScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AutomationTestRunScalarWhereInputSchema),z.lazy(() => AutomationTestRunScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  automationId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  testData: z.lazy(() => JsonFilterSchema).optional(),
  result: z.lazy(() => JsonNullableFilterSchema).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  executedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AutomationCreateWithoutActionsInputSchema: z.ZodType<Prisma.AutomationCreateWithoutActionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  triggerType: z.lazy(() => AutomationTriggerTypeSchema),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.boolean().optional(),
  createdTime: z.coerce.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedTime: z.coerce.date().optional().nullable(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogCreateNestedManyWithoutAutomationInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunCreateNestedManyWithoutAutomationInputSchema).optional()
}).strict();

export const AutomationUncheckedCreateWithoutActionsInputSchema: z.ZodType<Prisma.AutomationUncheckedCreateWithoutActionsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  triggerType: z.lazy(() => AutomationTriggerTypeSchema),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.boolean().optional(),
  createdTime: z.coerce.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedTime: z.coerce.date().optional().nullable(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogUncheckedCreateNestedManyWithoutAutomationInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunUncheckedCreateNestedManyWithoutAutomationInputSchema).optional()
}).strict();

export const AutomationCreateOrConnectWithoutActionsInputSchema: z.ZodType<Prisma.AutomationCreateOrConnectWithoutActionsInput> = z.object({
  where: z.lazy(() => AutomationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AutomationCreateWithoutActionsInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutActionsInputSchema) ]),
}).strict();

export const AutomationUpsertWithoutActionsInputSchema: z.ZodType<Prisma.AutomationUpsertWithoutActionsInput> = z.object({
  update: z.union([ z.lazy(() => AutomationUpdateWithoutActionsInputSchema),z.lazy(() => AutomationUncheckedUpdateWithoutActionsInputSchema) ]),
  create: z.union([ z.lazy(() => AutomationCreateWithoutActionsInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutActionsInputSchema) ]),
  where: z.lazy(() => AutomationWhereInputSchema).optional()
}).strict();

export const AutomationUpdateToOneWithWhereWithoutActionsInputSchema: z.ZodType<Prisma.AutomationUpdateToOneWithWhereWithoutActionsInput> = z.object({
  where: z.lazy(() => AutomationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AutomationUpdateWithoutActionsInputSchema),z.lazy(() => AutomationUncheckedUpdateWithoutActionsInputSchema) ]),
}).strict();

export const AutomationUpdateWithoutActionsInputSchema: z.ZodType<Prisma.AutomationUpdateWithoutActionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  triggerType: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => EnumAutomationTriggerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogUpdateManyWithoutAutomationNestedInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunUpdateManyWithoutAutomationNestedInputSchema).optional()
}).strict();

export const AutomationUncheckedUpdateWithoutActionsInputSchema: z.ZodType<Prisma.AutomationUncheckedUpdateWithoutActionsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  triggerType: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => EnumAutomationTriggerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogUncheckedUpdateManyWithoutAutomationNestedInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunUncheckedUpdateManyWithoutAutomationNestedInputSchema).optional()
}).strict();

export const AutomationCreateWithoutAutomationExecutionLogInputSchema: z.ZodType<Prisma.AutomationCreateWithoutAutomationExecutionLogInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  triggerType: z.lazy(() => AutomationTriggerTypeSchema),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.boolean().optional(),
  createdTime: z.coerce.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedTime: z.coerce.date().optional().nullable(),
  actions: z.lazy(() => AutomationActionCreateNestedManyWithoutAutomationInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunCreateNestedManyWithoutAutomationInputSchema).optional()
}).strict();

export const AutomationUncheckedCreateWithoutAutomationExecutionLogInputSchema: z.ZodType<Prisma.AutomationUncheckedCreateWithoutAutomationExecutionLogInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  triggerType: z.lazy(() => AutomationTriggerTypeSchema),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.boolean().optional(),
  createdTime: z.coerce.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedTime: z.coerce.date().optional().nullable(),
  actions: z.lazy(() => AutomationActionUncheckedCreateNestedManyWithoutAutomationInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunUncheckedCreateNestedManyWithoutAutomationInputSchema).optional()
}).strict();

export const AutomationCreateOrConnectWithoutAutomationExecutionLogInputSchema: z.ZodType<Prisma.AutomationCreateOrConnectWithoutAutomationExecutionLogInput> = z.object({
  where: z.lazy(() => AutomationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AutomationCreateWithoutAutomationExecutionLogInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutAutomationExecutionLogInputSchema) ]),
}).strict();

export const AutomationUpsertWithoutAutomationExecutionLogInputSchema: z.ZodType<Prisma.AutomationUpsertWithoutAutomationExecutionLogInput> = z.object({
  update: z.union([ z.lazy(() => AutomationUpdateWithoutAutomationExecutionLogInputSchema),z.lazy(() => AutomationUncheckedUpdateWithoutAutomationExecutionLogInputSchema) ]),
  create: z.union([ z.lazy(() => AutomationCreateWithoutAutomationExecutionLogInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutAutomationExecutionLogInputSchema) ]),
  where: z.lazy(() => AutomationWhereInputSchema).optional()
}).strict();

export const AutomationUpdateToOneWithWhereWithoutAutomationExecutionLogInputSchema: z.ZodType<Prisma.AutomationUpdateToOneWithWhereWithoutAutomationExecutionLogInput> = z.object({
  where: z.lazy(() => AutomationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AutomationUpdateWithoutAutomationExecutionLogInputSchema),z.lazy(() => AutomationUncheckedUpdateWithoutAutomationExecutionLogInputSchema) ]),
}).strict();

export const AutomationUpdateWithoutAutomationExecutionLogInputSchema: z.ZodType<Prisma.AutomationUpdateWithoutAutomationExecutionLogInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  triggerType: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => EnumAutomationTriggerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  actions: z.lazy(() => AutomationActionUpdateManyWithoutAutomationNestedInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunUpdateManyWithoutAutomationNestedInputSchema).optional()
}).strict();

export const AutomationUncheckedUpdateWithoutAutomationExecutionLogInputSchema: z.ZodType<Prisma.AutomationUncheckedUpdateWithoutAutomationExecutionLogInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  triggerType: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => EnumAutomationTriggerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  actions: z.lazy(() => AutomationActionUncheckedUpdateManyWithoutAutomationNestedInputSchema).optional(),
  AutomationTestRun: z.lazy(() => AutomationTestRunUncheckedUpdateManyWithoutAutomationNestedInputSchema).optional()
}).strict();

export const AutomationCreateWithoutAutomationTestRunInputSchema: z.ZodType<Prisma.AutomationCreateWithoutAutomationTestRunInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  triggerType: z.lazy(() => AutomationTriggerTypeSchema),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.boolean().optional(),
  createdTime: z.coerce.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedTime: z.coerce.date().optional().nullable(),
  actions: z.lazy(() => AutomationActionCreateNestedManyWithoutAutomationInputSchema).optional(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogCreateNestedManyWithoutAutomationInputSchema).optional()
}).strict();

export const AutomationUncheckedCreateWithoutAutomationTestRunInputSchema: z.ZodType<Prisma.AutomationUncheckedCreateWithoutAutomationTestRunInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  triggerType: z.lazy(() => AutomationTriggerTypeSchema),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.boolean().optional(),
  createdTime: z.coerce.date().optional(),
  createdBy: z.string().optional().nullable(),
  updatedTime: z.coerce.date().optional().nullable(),
  actions: z.lazy(() => AutomationActionUncheckedCreateNestedManyWithoutAutomationInputSchema).optional(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogUncheckedCreateNestedManyWithoutAutomationInputSchema).optional()
}).strict();

export const AutomationCreateOrConnectWithoutAutomationTestRunInputSchema: z.ZodType<Prisma.AutomationCreateOrConnectWithoutAutomationTestRunInput> = z.object({
  where: z.lazy(() => AutomationWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AutomationCreateWithoutAutomationTestRunInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutAutomationTestRunInputSchema) ]),
}).strict();

export const AutomationUpsertWithoutAutomationTestRunInputSchema: z.ZodType<Prisma.AutomationUpsertWithoutAutomationTestRunInput> = z.object({
  update: z.union([ z.lazy(() => AutomationUpdateWithoutAutomationTestRunInputSchema),z.lazy(() => AutomationUncheckedUpdateWithoutAutomationTestRunInputSchema) ]),
  create: z.union([ z.lazy(() => AutomationCreateWithoutAutomationTestRunInputSchema),z.lazy(() => AutomationUncheckedCreateWithoutAutomationTestRunInputSchema) ]),
  where: z.lazy(() => AutomationWhereInputSchema).optional()
}).strict();

export const AutomationUpdateToOneWithWhereWithoutAutomationTestRunInputSchema: z.ZodType<Prisma.AutomationUpdateToOneWithWhereWithoutAutomationTestRunInput> = z.object({
  where: z.lazy(() => AutomationWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AutomationUpdateWithoutAutomationTestRunInputSchema),z.lazy(() => AutomationUncheckedUpdateWithoutAutomationTestRunInputSchema) ]),
}).strict();

export const AutomationUpdateWithoutAutomationTestRunInputSchema: z.ZodType<Prisma.AutomationUpdateWithoutAutomationTestRunInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  triggerType: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => EnumAutomationTriggerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  actions: z.lazy(() => AutomationActionUpdateManyWithoutAutomationNestedInputSchema).optional(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogUpdateManyWithoutAutomationNestedInputSchema).optional()
}).strict();

export const AutomationUncheckedUpdateWithoutAutomationTestRunInputSchema: z.ZodType<Prisma.AutomationUncheckedUpdateWithoutAutomationTestRunInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  triggerType: z.union([ z.lazy(() => AutomationTriggerTypeSchema),z.lazy(() => EnumAutomationTriggerTypeFieldUpdateOperationsInputSchema) ]).optional(),
  triggerConfig: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  enabled: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  createdBy: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  actions: z.lazy(() => AutomationActionUncheckedUpdateManyWithoutAutomationNestedInputSchema).optional(),
  AutomationExecutionLog: z.lazy(() => AutomationExecutionLogUncheckedUpdateManyWithoutAutomationNestedInputSchema).optional()
}).strict();

export const TableCreateWithoutBaseInputSchema: z.ZodType<Prisma.TableCreateWithoutBaseInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  fields: z.lazy(() => FieldCreateNestedManyWithoutTableInputSchema).optional()
}).strict();

export const TableUncheckedCreateWithoutBaseInputSchema: z.ZodType<Prisma.TableUncheckedCreateWithoutBaseInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  fields: z.lazy(() => FieldUncheckedCreateNestedManyWithoutTableInputSchema).optional()
}).strict();

export const TableCreateOrConnectWithoutBaseInputSchema: z.ZodType<Prisma.TableCreateOrConnectWithoutBaseInput> = z.object({
  where: z.lazy(() => TableWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TableCreateWithoutBaseInputSchema),z.lazy(() => TableUncheckedCreateWithoutBaseInputSchema) ]),
}).strict();

export const TableCreateManyBaseInputEnvelopeSchema: z.ZodType<Prisma.TableCreateManyBaseInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => TableCreateManyBaseInputSchema),z.lazy(() => TableCreateManyBaseInputSchema).array() ]),
}).strict();

export const SpaceCreateWithoutBaseGroupInputSchema: z.ZodType<Prisma.SpaceCreateWithoutBaseGroupInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string()
}).strict();

export const SpaceUncheckedCreateWithoutBaseGroupInputSchema: z.ZodType<Prisma.SpaceUncheckedCreateWithoutBaseGroupInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string()
}).strict();

export const SpaceCreateOrConnectWithoutBaseGroupInputSchema: z.ZodType<Prisma.SpaceCreateOrConnectWithoutBaseGroupInput> = z.object({
  where: z.lazy(() => SpaceWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => SpaceCreateWithoutBaseGroupInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutBaseGroupInputSchema) ]),
}).strict();

export const TableUpsertWithWhereUniqueWithoutBaseInputSchema: z.ZodType<Prisma.TableUpsertWithWhereUniqueWithoutBaseInput> = z.object({
  where: z.lazy(() => TableWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => TableUpdateWithoutBaseInputSchema),z.lazy(() => TableUncheckedUpdateWithoutBaseInputSchema) ]),
  create: z.union([ z.lazy(() => TableCreateWithoutBaseInputSchema),z.lazy(() => TableUncheckedCreateWithoutBaseInputSchema) ]),
}).strict();

export const TableUpdateWithWhereUniqueWithoutBaseInputSchema: z.ZodType<Prisma.TableUpdateWithWhereUniqueWithoutBaseInput> = z.object({
  where: z.lazy(() => TableWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => TableUpdateWithoutBaseInputSchema),z.lazy(() => TableUncheckedUpdateWithoutBaseInputSchema) ]),
}).strict();

export const TableUpdateManyWithWhereWithoutBaseInputSchema: z.ZodType<Prisma.TableUpdateManyWithWhereWithoutBaseInput> = z.object({
  where: z.lazy(() => TableScalarWhereInputSchema),
  data: z.union([ z.lazy(() => TableUpdateManyMutationInputSchema),z.lazy(() => TableUncheckedUpdateManyWithoutBaseInputSchema) ]),
}).strict();

export const TableScalarWhereInputSchema: z.ZodType<Prisma.TableScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => TableScalarWhereInputSchema),z.lazy(() => TableScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => TableScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => TableScalarWhereInputSchema),z.lazy(() => TableScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  baseId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const SpaceUpsertWithoutBaseGroupInputSchema: z.ZodType<Prisma.SpaceUpsertWithoutBaseGroupInput> = z.object({
  update: z.union([ z.lazy(() => SpaceUpdateWithoutBaseGroupInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutBaseGroupInputSchema) ]),
  create: z.union([ z.lazy(() => SpaceCreateWithoutBaseGroupInputSchema),z.lazy(() => SpaceUncheckedCreateWithoutBaseGroupInputSchema) ]),
  where: z.lazy(() => SpaceWhereInputSchema).optional()
}).strict();

export const SpaceUpdateToOneWithWhereWithoutBaseGroupInputSchema: z.ZodType<Prisma.SpaceUpdateToOneWithWhereWithoutBaseGroupInput> = z.object({
  where: z.lazy(() => SpaceWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => SpaceUpdateWithoutBaseGroupInputSchema),z.lazy(() => SpaceUncheckedUpdateWithoutBaseGroupInputSchema) ]),
}).strict();

export const SpaceUpdateWithoutBaseGroupInputSchema: z.ZodType<Prisma.SpaceUpdateWithoutBaseGroupInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const SpaceUncheckedUpdateWithoutBaseGroupInputSchema: z.ZodType<Prisma.SpaceUncheckedUpdateWithoutBaseGroupInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BaseCreateWithoutSpaceInputSchema: z.ZodType<Prisma.BaseCreateWithoutSpaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  tables: z.lazy(() => TableCreateNestedManyWithoutBaseInputSchema).optional()
}).strict();

export const BaseUncheckedCreateWithoutSpaceInputSchema: z.ZodType<Prisma.BaseUncheckedCreateWithoutSpaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  tables: z.lazy(() => TableUncheckedCreateNestedManyWithoutBaseInputSchema).optional()
}).strict();

export const BaseCreateOrConnectWithoutSpaceInputSchema: z.ZodType<Prisma.BaseCreateOrConnectWithoutSpaceInput> = z.object({
  where: z.lazy(() => BaseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BaseCreateWithoutSpaceInputSchema),z.lazy(() => BaseUncheckedCreateWithoutSpaceInputSchema) ]),
}).strict();

export const BaseCreateManySpaceInputEnvelopeSchema: z.ZodType<Prisma.BaseCreateManySpaceInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => BaseCreateManySpaceInputSchema),z.lazy(() => BaseCreateManySpaceInputSchema).array() ]),
}).strict();

export const BaseUpsertWithWhereUniqueWithoutSpaceInputSchema: z.ZodType<Prisma.BaseUpsertWithWhereUniqueWithoutSpaceInput> = z.object({
  where: z.lazy(() => BaseWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => BaseUpdateWithoutSpaceInputSchema),z.lazy(() => BaseUncheckedUpdateWithoutSpaceInputSchema) ]),
  create: z.union([ z.lazy(() => BaseCreateWithoutSpaceInputSchema),z.lazy(() => BaseUncheckedCreateWithoutSpaceInputSchema) ]),
}).strict();

export const BaseUpdateWithWhereUniqueWithoutSpaceInputSchema: z.ZodType<Prisma.BaseUpdateWithWhereUniqueWithoutSpaceInput> = z.object({
  where: z.lazy(() => BaseWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => BaseUpdateWithoutSpaceInputSchema),z.lazy(() => BaseUncheckedUpdateWithoutSpaceInputSchema) ]),
}).strict();

export const BaseUpdateManyWithWhereWithoutSpaceInputSchema: z.ZodType<Prisma.BaseUpdateManyWithWhereWithoutSpaceInput> = z.object({
  where: z.lazy(() => BaseScalarWhereInputSchema),
  data: z.union([ z.lazy(() => BaseUpdateManyMutationInputSchema),z.lazy(() => BaseUncheckedUpdateManyWithoutSpaceInputSchema) ]),
}).strict();

export const BaseScalarWhereInputSchema: z.ZodType<Prisma.BaseScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => BaseScalarWhereInputSchema),z.lazy(() => BaseScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => BaseScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => BaseScalarWhereInputSchema),z.lazy(() => BaseScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  spaceId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const BaseCreateWithoutTablesInputSchema: z.ZodType<Prisma.BaseCreateWithoutTablesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  space: z.lazy(() => SpaceCreateNestedOneWithoutBaseGroupInputSchema)
}).strict();

export const BaseUncheckedCreateWithoutTablesInputSchema: z.ZodType<Prisma.BaseUncheckedCreateWithoutTablesInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  spaceId: z.string()
}).strict();

export const BaseCreateOrConnectWithoutTablesInputSchema: z.ZodType<Prisma.BaseCreateOrConnectWithoutTablesInput> = z.object({
  where: z.lazy(() => BaseWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => BaseCreateWithoutTablesInputSchema),z.lazy(() => BaseUncheckedCreateWithoutTablesInputSchema) ]),
}).strict();

export const FieldCreateWithoutTableInputSchema: z.ZodType<Prisma.FieldCreateWithoutTableInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  fieldType: z.lazy(() => FieldTypeSchema),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const FieldUncheckedCreateWithoutTableInputSchema: z.ZodType<Prisma.FieldUncheckedCreateWithoutTableInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  fieldType: z.lazy(() => FieldTypeSchema),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const FieldCreateOrConnectWithoutTableInputSchema: z.ZodType<Prisma.FieldCreateOrConnectWithoutTableInput> = z.object({
  where: z.lazy(() => FieldWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => FieldCreateWithoutTableInputSchema),z.lazy(() => FieldUncheckedCreateWithoutTableInputSchema) ]),
}).strict();

export const FieldCreateManyTableInputEnvelopeSchema: z.ZodType<Prisma.FieldCreateManyTableInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => FieldCreateManyTableInputSchema),z.lazy(() => FieldCreateManyTableInputSchema).array() ]),
}).strict();

export const BaseUpsertWithoutTablesInputSchema: z.ZodType<Prisma.BaseUpsertWithoutTablesInput> = z.object({
  update: z.union([ z.lazy(() => BaseUpdateWithoutTablesInputSchema),z.lazy(() => BaseUncheckedUpdateWithoutTablesInputSchema) ]),
  create: z.union([ z.lazy(() => BaseCreateWithoutTablesInputSchema),z.lazy(() => BaseUncheckedCreateWithoutTablesInputSchema) ]),
  where: z.lazy(() => BaseWhereInputSchema).optional()
}).strict();

export const BaseUpdateToOneWithWhereWithoutTablesInputSchema: z.ZodType<Prisma.BaseUpdateToOneWithWhereWithoutTablesInput> = z.object({
  where: z.lazy(() => BaseWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => BaseUpdateWithoutTablesInputSchema),z.lazy(() => BaseUncheckedUpdateWithoutTablesInputSchema) ]),
}).strict();

export const BaseUpdateWithoutTablesInputSchema: z.ZodType<Prisma.BaseUpdateWithoutTablesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  space: z.lazy(() => SpaceUpdateOneRequiredWithoutBaseGroupNestedInputSchema).optional()
}).strict();

export const BaseUncheckedUpdateWithoutTablesInputSchema: z.ZodType<Prisma.BaseUncheckedUpdateWithoutTablesInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  spaceId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FieldUpsertWithWhereUniqueWithoutTableInputSchema: z.ZodType<Prisma.FieldUpsertWithWhereUniqueWithoutTableInput> = z.object({
  where: z.lazy(() => FieldWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => FieldUpdateWithoutTableInputSchema),z.lazy(() => FieldUncheckedUpdateWithoutTableInputSchema) ]),
  create: z.union([ z.lazy(() => FieldCreateWithoutTableInputSchema),z.lazy(() => FieldUncheckedCreateWithoutTableInputSchema) ]),
}).strict();

export const FieldUpdateWithWhereUniqueWithoutTableInputSchema: z.ZodType<Prisma.FieldUpdateWithWhereUniqueWithoutTableInput> = z.object({
  where: z.lazy(() => FieldWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => FieldUpdateWithoutTableInputSchema),z.lazy(() => FieldUncheckedUpdateWithoutTableInputSchema) ]),
}).strict();

export const FieldUpdateManyWithWhereWithoutTableInputSchema: z.ZodType<Prisma.FieldUpdateManyWithWhereWithoutTableInput> = z.object({
  where: z.lazy(() => FieldScalarWhereInputSchema),
  data: z.union([ z.lazy(() => FieldUpdateManyMutationInputSchema),z.lazy(() => FieldUncheckedUpdateManyWithoutTableInputSchema) ]),
}).strict();

export const FieldScalarWhereInputSchema: z.ZodType<Prisma.FieldScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => FieldScalarWhereInputSchema),z.lazy(() => FieldScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => FieldScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => FieldScalarWhereInputSchema),z.lazy(() => FieldScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  tabelId: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  fieldType: z.union([ z.lazy(() => EnumFieldTypeFilterSchema),z.lazy(() => FieldTypeSchema) ]).optional(),
  data: z.lazy(() => JsonFilterSchema).optional()
}).strict();

export const TableCreateWithoutFieldsInputSchema: z.ZodType<Prisma.TableCreateWithoutFieldsInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  base: z.lazy(() => BaseCreateNestedOneWithoutTablesInputSchema)
}).strict();

export const TableUncheckedCreateWithoutFieldsInputSchema: z.ZodType<Prisma.TableUncheckedCreateWithoutFieldsInput> = z.object({
  id: z.string().cuid().optional(),
  baseId: z.string(),
  name: z.string()
}).strict();

export const TableCreateOrConnectWithoutFieldsInputSchema: z.ZodType<Prisma.TableCreateOrConnectWithoutFieldsInput> = z.object({
  where: z.lazy(() => TableWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => TableCreateWithoutFieldsInputSchema),z.lazy(() => TableUncheckedCreateWithoutFieldsInputSchema) ]),
}).strict();

export const TableUpsertWithoutFieldsInputSchema: z.ZodType<Prisma.TableUpsertWithoutFieldsInput> = z.object({
  update: z.union([ z.lazy(() => TableUpdateWithoutFieldsInputSchema),z.lazy(() => TableUncheckedUpdateWithoutFieldsInputSchema) ]),
  create: z.union([ z.lazy(() => TableCreateWithoutFieldsInputSchema),z.lazy(() => TableUncheckedCreateWithoutFieldsInputSchema) ]),
  where: z.lazy(() => TableWhereInputSchema).optional()
}).strict();

export const TableUpdateToOneWithWhereWithoutFieldsInputSchema: z.ZodType<Prisma.TableUpdateToOneWithWhereWithoutFieldsInput> = z.object({
  where: z.lazy(() => TableWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => TableUpdateWithoutFieldsInputSchema),z.lazy(() => TableUncheckedUpdateWithoutFieldsInputSchema) ]),
}).strict();

export const TableUpdateWithoutFieldsInputSchema: z.ZodType<Prisma.TableUpdateWithoutFieldsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  base: z.lazy(() => BaseUpdateOneRequiredWithoutTablesNestedInputSchema).optional()
}).strict();

export const TableUncheckedUpdateWithoutFieldsInputSchema: z.ZodType<Prisma.TableUncheckedUpdateWithoutFieldsInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  baseId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AutomationActionCreateManyAutomationInputSchema: z.ZodType<Prisma.AutomationActionCreateManyAutomationInput> = z.object({
  id: z.string().cuid().optional(),
  order: z.number().int(),
  type: z.lazy(() => AutomationActionTypeSchema),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.coerce.date().optional(),
  updatedTime: z.coerce.date().optional().nullable()
}).strict();

export const AutomationExecutionLogCreateManyAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogCreateManyAutomationInput> = z.object({
  id: z.string().cuid().optional(),
  status: z.lazy(() => StatusTypeSchema).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.string().optional().nullable(),
  executedAt: z.coerce.date().optional()
}).strict();

export const AutomationTestRunCreateManyAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunCreateManyAutomationInput> = z.object({
  id: z.string().cuid().optional(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.string(),
  executedAt: z.coerce.date().optional()
}).strict();

export const AutomationActionUpdateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationActionUpdateWithoutAutomationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AutomationActionTypeSchema),z.lazy(() => EnumAutomationActionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AutomationActionUncheckedUpdateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationActionUncheckedUpdateWithoutAutomationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AutomationActionTypeSchema),z.lazy(() => EnumAutomationActionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AutomationActionUncheckedUpdateManyWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationActionUncheckedUpdateManyWithoutAutomationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  order: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  type: z.union([ z.lazy(() => AutomationActionTypeSchema),z.lazy(() => EnumAutomationActionTypeFieldUpdateOperationsInputSchema) ]).optional(),
  params: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  conditions: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  createdTime: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedTime: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
}).strict();

export const AutomationExecutionLogUpdateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogUpdateWithoutAutomationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusTypeSchema),z.lazy(() => NullableEnumStatusTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AutomationExecutionLogUncheckedUpdateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogUncheckedUpdateWithoutAutomationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusTypeSchema),z.lazy(() => NullableEnumStatusTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AutomationExecutionLogUncheckedUpdateManyWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationExecutionLogUncheckedUpdateManyWithoutAutomationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => StatusTypeSchema),z.lazy(() => NullableEnumStatusTypeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  eventData: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  error: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AutomationTestRunUpdateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunUpdateWithoutAutomationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AutomationTestRunUncheckedUpdateWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunUncheckedUpdateWithoutAutomationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AutomationTestRunUncheckedUpdateManyWithoutAutomationInputSchema: z.ZodType<Prisma.AutomationTestRunUncheckedUpdateManyWithoutAutomationInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  testData: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  result: z.union([ z.lazy(() => NullableJsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  executedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const TableCreateManyBaseInputSchema: z.ZodType<Prisma.TableCreateManyBaseInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string()
}).strict();

export const TableUpdateWithoutBaseInputSchema: z.ZodType<Prisma.TableUpdateWithoutBaseInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fields: z.lazy(() => FieldUpdateManyWithoutTableNestedInputSchema).optional()
}).strict();

export const TableUncheckedUpdateWithoutBaseInputSchema: z.ZodType<Prisma.TableUncheckedUpdateWithoutBaseInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fields: z.lazy(() => FieldUncheckedUpdateManyWithoutTableNestedInputSchema).optional()
}).strict();

export const TableUncheckedUpdateManyWithoutBaseInputSchema: z.ZodType<Prisma.TableUncheckedUpdateManyWithoutBaseInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const BaseCreateManySpaceInputSchema: z.ZodType<Prisma.BaseCreateManySpaceInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string()
}).strict();

export const BaseUpdateWithoutSpaceInputSchema: z.ZodType<Prisma.BaseUpdateWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tables: z.lazy(() => TableUpdateManyWithoutBaseNestedInputSchema).optional()
}).strict();

export const BaseUncheckedUpdateWithoutSpaceInputSchema: z.ZodType<Prisma.BaseUncheckedUpdateWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  tables: z.lazy(() => TableUncheckedUpdateManyWithoutBaseNestedInputSchema).optional()
}).strict();

export const BaseUncheckedUpdateManyWithoutSpaceInputSchema: z.ZodType<Prisma.BaseUncheckedUpdateManyWithoutSpaceInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const FieldCreateManyTableInputSchema: z.ZodType<Prisma.FieldCreateManyTableInput> = z.object({
  id: z.string().cuid().optional(),
  name: z.string(),
  fieldType: z.lazy(() => FieldTypeSchema),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]),
}).strict();

export const FieldUpdateWithoutTableInputSchema: z.ZodType<Prisma.FieldUpdateWithoutTableInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldType: z.union([ z.lazy(() => FieldTypeSchema),z.lazy(() => EnumFieldTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const FieldUncheckedUpdateWithoutTableInputSchema: z.ZodType<Prisma.FieldUncheckedUpdateWithoutTableInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldType: z.union([ z.lazy(() => FieldTypeSchema),z.lazy(() => EnumFieldTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

export const FieldUncheckedUpdateManyWithoutTableInputSchema: z.ZodType<Prisma.FieldUncheckedUpdateManyWithoutTableInput> = z.object({
  id: z.union([ z.string().cuid(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  fieldType: z.union([ z.lazy(() => FieldTypeSchema),z.lazy(() => EnumFieldTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ z.lazy(() => JsonNullValueInputSchema),InputJsonValueSchema ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AutomationFindFirstArgsSchema: z.ZodType<Prisma.AutomationFindFirstArgs> = z.object({
  select: AutomationSelectSchema.optional(),
  include: AutomationIncludeSchema.optional(),
  where: AutomationWhereInputSchema.optional(),
  orderBy: z.union([ AutomationOrderByWithRelationInputSchema.array(),AutomationOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationScalarFieldEnumSchema,AutomationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AutomationFindFirstOrThrowArgs> = z.object({
  select: AutomationSelectSchema.optional(),
  include: AutomationIncludeSchema.optional(),
  where: AutomationWhereInputSchema.optional(),
  orderBy: z.union([ AutomationOrderByWithRelationInputSchema.array(),AutomationOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationScalarFieldEnumSchema,AutomationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationFindManyArgsSchema: z.ZodType<Prisma.AutomationFindManyArgs> = z.object({
  select: AutomationSelectSchema.optional(),
  include: AutomationIncludeSchema.optional(),
  where: AutomationWhereInputSchema.optional(),
  orderBy: z.union([ AutomationOrderByWithRelationInputSchema.array(),AutomationOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationScalarFieldEnumSchema,AutomationScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationAggregateArgsSchema: z.ZodType<Prisma.AutomationAggregateArgs> = z.object({
  where: AutomationWhereInputSchema.optional(),
  orderBy: z.union([ AutomationOrderByWithRelationInputSchema.array(),AutomationOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AutomationGroupByArgsSchema: z.ZodType<Prisma.AutomationGroupByArgs> = z.object({
  where: AutomationWhereInputSchema.optional(),
  orderBy: z.union([ AutomationOrderByWithAggregationInputSchema.array(),AutomationOrderByWithAggregationInputSchema ]).optional(),
  by: AutomationScalarFieldEnumSchema.array(),
  having: AutomationScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AutomationFindUniqueArgsSchema: z.ZodType<Prisma.AutomationFindUniqueArgs> = z.object({
  select: AutomationSelectSchema.optional(),
  include: AutomationIncludeSchema.optional(),
  where: AutomationWhereUniqueInputSchema,
}).strict() ;

export const AutomationFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AutomationFindUniqueOrThrowArgs> = z.object({
  select: AutomationSelectSchema.optional(),
  include: AutomationIncludeSchema.optional(),
  where: AutomationWhereUniqueInputSchema,
}).strict() ;

export const AutomationActionFindFirstArgsSchema: z.ZodType<Prisma.AutomationActionFindFirstArgs> = z.object({
  select: AutomationActionSelectSchema.optional(),
  include: AutomationActionIncludeSchema.optional(),
  where: AutomationActionWhereInputSchema.optional(),
  orderBy: z.union([ AutomationActionOrderByWithRelationInputSchema.array(),AutomationActionOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationActionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationActionScalarFieldEnumSchema,AutomationActionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationActionFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AutomationActionFindFirstOrThrowArgs> = z.object({
  select: AutomationActionSelectSchema.optional(),
  include: AutomationActionIncludeSchema.optional(),
  where: AutomationActionWhereInputSchema.optional(),
  orderBy: z.union([ AutomationActionOrderByWithRelationInputSchema.array(),AutomationActionOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationActionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationActionScalarFieldEnumSchema,AutomationActionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationActionFindManyArgsSchema: z.ZodType<Prisma.AutomationActionFindManyArgs> = z.object({
  select: AutomationActionSelectSchema.optional(),
  include: AutomationActionIncludeSchema.optional(),
  where: AutomationActionWhereInputSchema.optional(),
  orderBy: z.union([ AutomationActionOrderByWithRelationInputSchema.array(),AutomationActionOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationActionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationActionScalarFieldEnumSchema,AutomationActionScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationActionAggregateArgsSchema: z.ZodType<Prisma.AutomationActionAggregateArgs> = z.object({
  where: AutomationActionWhereInputSchema.optional(),
  orderBy: z.union([ AutomationActionOrderByWithRelationInputSchema.array(),AutomationActionOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationActionWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AutomationActionGroupByArgsSchema: z.ZodType<Prisma.AutomationActionGroupByArgs> = z.object({
  where: AutomationActionWhereInputSchema.optional(),
  orderBy: z.union([ AutomationActionOrderByWithAggregationInputSchema.array(),AutomationActionOrderByWithAggregationInputSchema ]).optional(),
  by: AutomationActionScalarFieldEnumSchema.array(),
  having: AutomationActionScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AutomationActionFindUniqueArgsSchema: z.ZodType<Prisma.AutomationActionFindUniqueArgs> = z.object({
  select: AutomationActionSelectSchema.optional(),
  include: AutomationActionIncludeSchema.optional(),
  where: AutomationActionWhereUniqueInputSchema,
}).strict() ;

export const AutomationActionFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AutomationActionFindUniqueOrThrowArgs> = z.object({
  select: AutomationActionSelectSchema.optional(),
  include: AutomationActionIncludeSchema.optional(),
  where: AutomationActionWhereUniqueInputSchema,
}).strict() ;

export const AutomationExecutionLogFindFirstArgsSchema: z.ZodType<Prisma.AutomationExecutionLogFindFirstArgs> = z.object({
  select: AutomationExecutionLogSelectSchema.optional(),
  include: AutomationExecutionLogIncludeSchema.optional(),
  where: AutomationExecutionLogWhereInputSchema.optional(),
  orderBy: z.union([ AutomationExecutionLogOrderByWithRelationInputSchema.array(),AutomationExecutionLogOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationExecutionLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationExecutionLogScalarFieldEnumSchema,AutomationExecutionLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationExecutionLogFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AutomationExecutionLogFindFirstOrThrowArgs> = z.object({
  select: AutomationExecutionLogSelectSchema.optional(),
  include: AutomationExecutionLogIncludeSchema.optional(),
  where: AutomationExecutionLogWhereInputSchema.optional(),
  orderBy: z.union([ AutomationExecutionLogOrderByWithRelationInputSchema.array(),AutomationExecutionLogOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationExecutionLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationExecutionLogScalarFieldEnumSchema,AutomationExecutionLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationExecutionLogFindManyArgsSchema: z.ZodType<Prisma.AutomationExecutionLogFindManyArgs> = z.object({
  select: AutomationExecutionLogSelectSchema.optional(),
  include: AutomationExecutionLogIncludeSchema.optional(),
  where: AutomationExecutionLogWhereInputSchema.optional(),
  orderBy: z.union([ AutomationExecutionLogOrderByWithRelationInputSchema.array(),AutomationExecutionLogOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationExecutionLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationExecutionLogScalarFieldEnumSchema,AutomationExecutionLogScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationExecutionLogAggregateArgsSchema: z.ZodType<Prisma.AutomationExecutionLogAggregateArgs> = z.object({
  where: AutomationExecutionLogWhereInputSchema.optional(),
  orderBy: z.union([ AutomationExecutionLogOrderByWithRelationInputSchema.array(),AutomationExecutionLogOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationExecutionLogWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AutomationExecutionLogGroupByArgsSchema: z.ZodType<Prisma.AutomationExecutionLogGroupByArgs> = z.object({
  where: AutomationExecutionLogWhereInputSchema.optional(),
  orderBy: z.union([ AutomationExecutionLogOrderByWithAggregationInputSchema.array(),AutomationExecutionLogOrderByWithAggregationInputSchema ]).optional(),
  by: AutomationExecutionLogScalarFieldEnumSchema.array(),
  having: AutomationExecutionLogScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AutomationExecutionLogFindUniqueArgsSchema: z.ZodType<Prisma.AutomationExecutionLogFindUniqueArgs> = z.object({
  select: AutomationExecutionLogSelectSchema.optional(),
  include: AutomationExecutionLogIncludeSchema.optional(),
  where: AutomationExecutionLogWhereUniqueInputSchema,
}).strict() ;

export const AutomationExecutionLogFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AutomationExecutionLogFindUniqueOrThrowArgs> = z.object({
  select: AutomationExecutionLogSelectSchema.optional(),
  include: AutomationExecutionLogIncludeSchema.optional(),
  where: AutomationExecutionLogWhereUniqueInputSchema,
}).strict() ;

export const AutomationTestRunFindFirstArgsSchema: z.ZodType<Prisma.AutomationTestRunFindFirstArgs> = z.object({
  select: AutomationTestRunSelectSchema.optional(),
  include: AutomationTestRunIncludeSchema.optional(),
  where: AutomationTestRunWhereInputSchema.optional(),
  orderBy: z.union([ AutomationTestRunOrderByWithRelationInputSchema.array(),AutomationTestRunOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationTestRunWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationTestRunScalarFieldEnumSchema,AutomationTestRunScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationTestRunFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AutomationTestRunFindFirstOrThrowArgs> = z.object({
  select: AutomationTestRunSelectSchema.optional(),
  include: AutomationTestRunIncludeSchema.optional(),
  where: AutomationTestRunWhereInputSchema.optional(),
  orderBy: z.union([ AutomationTestRunOrderByWithRelationInputSchema.array(),AutomationTestRunOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationTestRunWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationTestRunScalarFieldEnumSchema,AutomationTestRunScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationTestRunFindManyArgsSchema: z.ZodType<Prisma.AutomationTestRunFindManyArgs> = z.object({
  select: AutomationTestRunSelectSchema.optional(),
  include: AutomationTestRunIncludeSchema.optional(),
  where: AutomationTestRunWhereInputSchema.optional(),
  orderBy: z.union([ AutomationTestRunOrderByWithRelationInputSchema.array(),AutomationTestRunOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationTestRunWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AutomationTestRunScalarFieldEnumSchema,AutomationTestRunScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AutomationTestRunAggregateArgsSchema: z.ZodType<Prisma.AutomationTestRunAggregateArgs> = z.object({
  where: AutomationTestRunWhereInputSchema.optional(),
  orderBy: z.union([ AutomationTestRunOrderByWithRelationInputSchema.array(),AutomationTestRunOrderByWithRelationInputSchema ]).optional(),
  cursor: AutomationTestRunWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AutomationTestRunGroupByArgsSchema: z.ZodType<Prisma.AutomationTestRunGroupByArgs> = z.object({
  where: AutomationTestRunWhereInputSchema.optional(),
  orderBy: z.union([ AutomationTestRunOrderByWithAggregationInputSchema.array(),AutomationTestRunOrderByWithAggregationInputSchema ]).optional(),
  by: AutomationTestRunScalarFieldEnumSchema.array(),
  having: AutomationTestRunScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AutomationTestRunFindUniqueArgsSchema: z.ZodType<Prisma.AutomationTestRunFindUniqueArgs> = z.object({
  select: AutomationTestRunSelectSchema.optional(),
  include: AutomationTestRunIncludeSchema.optional(),
  where: AutomationTestRunWhereUniqueInputSchema,
}).strict() ;

export const AutomationTestRunFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AutomationTestRunFindUniqueOrThrowArgs> = z.object({
  select: AutomationTestRunSelectSchema.optional(),
  include: AutomationTestRunIncludeSchema.optional(),
  where: AutomationTestRunWhereUniqueInputSchema,
}).strict() ;

export const BaseFindFirstArgsSchema: z.ZodType<Prisma.BaseFindFirstArgs> = z.object({
  select: BaseSelectSchema.optional(),
  include: BaseIncludeSchema.optional(),
  where: BaseWhereInputSchema.optional(),
  orderBy: z.union([ BaseOrderByWithRelationInputSchema.array(),BaseOrderByWithRelationInputSchema ]).optional(),
  cursor: BaseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BaseScalarFieldEnumSchema,BaseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BaseFindFirstOrThrowArgsSchema: z.ZodType<Prisma.BaseFindFirstOrThrowArgs> = z.object({
  select: BaseSelectSchema.optional(),
  include: BaseIncludeSchema.optional(),
  where: BaseWhereInputSchema.optional(),
  orderBy: z.union([ BaseOrderByWithRelationInputSchema.array(),BaseOrderByWithRelationInputSchema ]).optional(),
  cursor: BaseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BaseScalarFieldEnumSchema,BaseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BaseFindManyArgsSchema: z.ZodType<Prisma.BaseFindManyArgs> = z.object({
  select: BaseSelectSchema.optional(),
  include: BaseIncludeSchema.optional(),
  where: BaseWhereInputSchema.optional(),
  orderBy: z.union([ BaseOrderByWithRelationInputSchema.array(),BaseOrderByWithRelationInputSchema ]).optional(),
  cursor: BaseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ BaseScalarFieldEnumSchema,BaseScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const BaseAggregateArgsSchema: z.ZodType<Prisma.BaseAggregateArgs> = z.object({
  where: BaseWhereInputSchema.optional(),
  orderBy: z.union([ BaseOrderByWithRelationInputSchema.array(),BaseOrderByWithRelationInputSchema ]).optional(),
  cursor: BaseWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BaseGroupByArgsSchema: z.ZodType<Prisma.BaseGroupByArgs> = z.object({
  where: BaseWhereInputSchema.optional(),
  orderBy: z.union([ BaseOrderByWithAggregationInputSchema.array(),BaseOrderByWithAggregationInputSchema ]).optional(),
  by: BaseScalarFieldEnumSchema.array(),
  having: BaseScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const BaseFindUniqueArgsSchema: z.ZodType<Prisma.BaseFindUniqueArgs> = z.object({
  select: BaseSelectSchema.optional(),
  include: BaseIncludeSchema.optional(),
  where: BaseWhereUniqueInputSchema,
}).strict() ;

export const BaseFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.BaseFindUniqueOrThrowArgs> = z.object({
  select: BaseSelectSchema.optional(),
  include: BaseIncludeSchema.optional(),
  where: BaseWhereUniqueInputSchema,
}).strict() ;

export const SpaceFindFirstArgsSchema: z.ZodType<Prisma.SpaceFindFirstArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereInputSchema.optional(),
  orderBy: z.union([ SpaceOrderByWithRelationInputSchema.array(),SpaceOrderByWithRelationInputSchema ]).optional(),
  cursor: SpaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SpaceScalarFieldEnumSchema,SpaceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SpaceFindFirstOrThrowArgsSchema: z.ZodType<Prisma.SpaceFindFirstOrThrowArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereInputSchema.optional(),
  orderBy: z.union([ SpaceOrderByWithRelationInputSchema.array(),SpaceOrderByWithRelationInputSchema ]).optional(),
  cursor: SpaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SpaceScalarFieldEnumSchema,SpaceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SpaceFindManyArgsSchema: z.ZodType<Prisma.SpaceFindManyArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereInputSchema.optional(),
  orderBy: z.union([ SpaceOrderByWithRelationInputSchema.array(),SpaceOrderByWithRelationInputSchema ]).optional(),
  cursor: SpaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ SpaceScalarFieldEnumSchema,SpaceScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const SpaceAggregateArgsSchema: z.ZodType<Prisma.SpaceAggregateArgs> = z.object({
  where: SpaceWhereInputSchema.optional(),
  orderBy: z.union([ SpaceOrderByWithRelationInputSchema.array(),SpaceOrderByWithRelationInputSchema ]).optional(),
  cursor: SpaceWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SpaceGroupByArgsSchema: z.ZodType<Prisma.SpaceGroupByArgs> = z.object({
  where: SpaceWhereInputSchema.optional(),
  orderBy: z.union([ SpaceOrderByWithAggregationInputSchema.array(),SpaceOrderByWithAggregationInputSchema ]).optional(),
  by: SpaceScalarFieldEnumSchema.array(),
  having: SpaceScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const SpaceFindUniqueArgsSchema: z.ZodType<Prisma.SpaceFindUniqueArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereUniqueInputSchema,
}).strict() ;

export const SpaceFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.SpaceFindUniqueOrThrowArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereUniqueInputSchema,
}).strict() ;

export const TableFindFirstArgsSchema: z.ZodType<Prisma.TableFindFirstArgs> = z.object({
  select: TableSelectSchema.optional(),
  include: TableIncludeSchema.optional(),
  where: TableWhereInputSchema.optional(),
  orderBy: z.union([ TableOrderByWithRelationInputSchema.array(),TableOrderByWithRelationInputSchema ]).optional(),
  cursor: TableWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TableScalarFieldEnumSchema,TableScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TableFindFirstOrThrowArgsSchema: z.ZodType<Prisma.TableFindFirstOrThrowArgs> = z.object({
  select: TableSelectSchema.optional(),
  include: TableIncludeSchema.optional(),
  where: TableWhereInputSchema.optional(),
  orderBy: z.union([ TableOrderByWithRelationInputSchema.array(),TableOrderByWithRelationInputSchema ]).optional(),
  cursor: TableWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TableScalarFieldEnumSchema,TableScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TableFindManyArgsSchema: z.ZodType<Prisma.TableFindManyArgs> = z.object({
  select: TableSelectSchema.optional(),
  include: TableIncludeSchema.optional(),
  where: TableWhereInputSchema.optional(),
  orderBy: z.union([ TableOrderByWithRelationInputSchema.array(),TableOrderByWithRelationInputSchema ]).optional(),
  cursor: TableWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ TableScalarFieldEnumSchema,TableScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const TableAggregateArgsSchema: z.ZodType<Prisma.TableAggregateArgs> = z.object({
  where: TableWhereInputSchema.optional(),
  orderBy: z.union([ TableOrderByWithRelationInputSchema.array(),TableOrderByWithRelationInputSchema ]).optional(),
  cursor: TableWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TableGroupByArgsSchema: z.ZodType<Prisma.TableGroupByArgs> = z.object({
  where: TableWhereInputSchema.optional(),
  orderBy: z.union([ TableOrderByWithAggregationInputSchema.array(),TableOrderByWithAggregationInputSchema ]).optional(),
  by: TableScalarFieldEnumSchema.array(),
  having: TableScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const TableFindUniqueArgsSchema: z.ZodType<Prisma.TableFindUniqueArgs> = z.object({
  select: TableSelectSchema.optional(),
  include: TableIncludeSchema.optional(),
  where: TableWhereUniqueInputSchema,
}).strict() ;

export const TableFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.TableFindUniqueOrThrowArgs> = z.object({
  select: TableSelectSchema.optional(),
  include: TableIncludeSchema.optional(),
  where: TableWhereUniqueInputSchema,
}).strict() ;

export const FieldFindFirstArgsSchema: z.ZodType<Prisma.FieldFindFirstArgs> = z.object({
  select: FieldSelectSchema.optional(),
  include: FieldIncludeSchema.optional(),
  where: FieldWhereInputSchema.optional(),
  orderBy: z.union([ FieldOrderByWithRelationInputSchema.array(),FieldOrderByWithRelationInputSchema ]).optional(),
  cursor: FieldWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FieldScalarFieldEnumSchema,FieldScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FieldFindFirstOrThrowArgsSchema: z.ZodType<Prisma.FieldFindFirstOrThrowArgs> = z.object({
  select: FieldSelectSchema.optional(),
  include: FieldIncludeSchema.optional(),
  where: FieldWhereInputSchema.optional(),
  orderBy: z.union([ FieldOrderByWithRelationInputSchema.array(),FieldOrderByWithRelationInputSchema ]).optional(),
  cursor: FieldWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FieldScalarFieldEnumSchema,FieldScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FieldFindManyArgsSchema: z.ZodType<Prisma.FieldFindManyArgs> = z.object({
  select: FieldSelectSchema.optional(),
  include: FieldIncludeSchema.optional(),
  where: FieldWhereInputSchema.optional(),
  orderBy: z.union([ FieldOrderByWithRelationInputSchema.array(),FieldOrderByWithRelationInputSchema ]).optional(),
  cursor: FieldWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ FieldScalarFieldEnumSchema,FieldScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const FieldAggregateArgsSchema: z.ZodType<Prisma.FieldAggregateArgs> = z.object({
  where: FieldWhereInputSchema.optional(),
  orderBy: z.union([ FieldOrderByWithRelationInputSchema.array(),FieldOrderByWithRelationInputSchema ]).optional(),
  cursor: FieldWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FieldGroupByArgsSchema: z.ZodType<Prisma.FieldGroupByArgs> = z.object({
  where: FieldWhereInputSchema.optional(),
  orderBy: z.union([ FieldOrderByWithAggregationInputSchema.array(),FieldOrderByWithAggregationInputSchema ]).optional(),
  by: FieldScalarFieldEnumSchema.array(),
  having: FieldScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const FieldFindUniqueArgsSchema: z.ZodType<Prisma.FieldFindUniqueArgs> = z.object({
  select: FieldSelectSchema.optional(),
  include: FieldIncludeSchema.optional(),
  where: FieldWhereUniqueInputSchema,
}).strict() ;

export const FieldFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.FieldFindUniqueOrThrowArgs> = z.object({
  select: FieldSelectSchema.optional(),
  include: FieldIncludeSchema.optional(),
  where: FieldWhereUniqueInputSchema,
}).strict() ;

export const AutomationCreateArgsSchema: z.ZodType<Prisma.AutomationCreateArgs> = z.object({
  select: AutomationSelectSchema.optional(),
  include: AutomationIncludeSchema.optional(),
  data: z.union([ AutomationCreateInputSchema,AutomationUncheckedCreateInputSchema ]),
}).strict() ;

export const AutomationUpsertArgsSchema: z.ZodType<Prisma.AutomationUpsertArgs> = z.object({
  select: AutomationSelectSchema.optional(),
  include: AutomationIncludeSchema.optional(),
  where: AutomationWhereUniqueInputSchema,
  create: z.union([ AutomationCreateInputSchema,AutomationUncheckedCreateInputSchema ]),
  update: z.union([ AutomationUpdateInputSchema,AutomationUncheckedUpdateInputSchema ]),
}).strict() ;

export const AutomationCreateManyArgsSchema: z.ZodType<Prisma.AutomationCreateManyArgs> = z.object({
  data: z.union([ AutomationCreateManyInputSchema,AutomationCreateManyInputSchema.array() ]),
}).strict() ;

export const AutomationCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AutomationCreateManyAndReturnArgs> = z.object({
  data: z.union([ AutomationCreateManyInputSchema,AutomationCreateManyInputSchema.array() ]),
}).strict() ;

export const AutomationDeleteArgsSchema: z.ZodType<Prisma.AutomationDeleteArgs> = z.object({
  select: AutomationSelectSchema.optional(),
  include: AutomationIncludeSchema.optional(),
  where: AutomationWhereUniqueInputSchema,
}).strict() ;

export const AutomationUpdateArgsSchema: z.ZodType<Prisma.AutomationUpdateArgs> = z.object({
  select: AutomationSelectSchema.optional(),
  include: AutomationIncludeSchema.optional(),
  data: z.union([ AutomationUpdateInputSchema,AutomationUncheckedUpdateInputSchema ]),
  where: AutomationWhereUniqueInputSchema,
}).strict() ;

export const AutomationUpdateManyArgsSchema: z.ZodType<Prisma.AutomationUpdateManyArgs> = z.object({
  data: z.union([ AutomationUpdateManyMutationInputSchema,AutomationUncheckedUpdateManyInputSchema ]),
  where: AutomationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AutomationUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AutomationUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AutomationUpdateManyMutationInputSchema,AutomationUncheckedUpdateManyInputSchema ]),
  where: AutomationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AutomationDeleteManyArgsSchema: z.ZodType<Prisma.AutomationDeleteManyArgs> = z.object({
  where: AutomationWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AutomationActionCreateArgsSchema: z.ZodType<Prisma.AutomationActionCreateArgs> = z.object({
  select: AutomationActionSelectSchema.optional(),
  include: AutomationActionIncludeSchema.optional(),
  data: z.union([ AutomationActionCreateInputSchema,AutomationActionUncheckedCreateInputSchema ]),
}).strict() ;

export const AutomationActionUpsertArgsSchema: z.ZodType<Prisma.AutomationActionUpsertArgs> = z.object({
  select: AutomationActionSelectSchema.optional(),
  include: AutomationActionIncludeSchema.optional(),
  where: AutomationActionWhereUniqueInputSchema,
  create: z.union([ AutomationActionCreateInputSchema,AutomationActionUncheckedCreateInputSchema ]),
  update: z.union([ AutomationActionUpdateInputSchema,AutomationActionUncheckedUpdateInputSchema ]),
}).strict() ;

export const AutomationActionCreateManyArgsSchema: z.ZodType<Prisma.AutomationActionCreateManyArgs> = z.object({
  data: z.union([ AutomationActionCreateManyInputSchema,AutomationActionCreateManyInputSchema.array() ]),
}).strict() ;

export const AutomationActionCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AutomationActionCreateManyAndReturnArgs> = z.object({
  data: z.union([ AutomationActionCreateManyInputSchema,AutomationActionCreateManyInputSchema.array() ]),
}).strict() ;

export const AutomationActionDeleteArgsSchema: z.ZodType<Prisma.AutomationActionDeleteArgs> = z.object({
  select: AutomationActionSelectSchema.optional(),
  include: AutomationActionIncludeSchema.optional(),
  where: AutomationActionWhereUniqueInputSchema,
}).strict() ;

export const AutomationActionUpdateArgsSchema: z.ZodType<Prisma.AutomationActionUpdateArgs> = z.object({
  select: AutomationActionSelectSchema.optional(),
  include: AutomationActionIncludeSchema.optional(),
  data: z.union([ AutomationActionUpdateInputSchema,AutomationActionUncheckedUpdateInputSchema ]),
  where: AutomationActionWhereUniqueInputSchema,
}).strict() ;

export const AutomationActionUpdateManyArgsSchema: z.ZodType<Prisma.AutomationActionUpdateManyArgs> = z.object({
  data: z.union([ AutomationActionUpdateManyMutationInputSchema,AutomationActionUncheckedUpdateManyInputSchema ]),
  where: AutomationActionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AutomationActionUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AutomationActionUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AutomationActionUpdateManyMutationInputSchema,AutomationActionUncheckedUpdateManyInputSchema ]),
  where: AutomationActionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AutomationActionDeleteManyArgsSchema: z.ZodType<Prisma.AutomationActionDeleteManyArgs> = z.object({
  where: AutomationActionWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AutomationExecutionLogCreateArgsSchema: z.ZodType<Prisma.AutomationExecutionLogCreateArgs> = z.object({
  select: AutomationExecutionLogSelectSchema.optional(),
  include: AutomationExecutionLogIncludeSchema.optional(),
  data: z.union([ AutomationExecutionLogCreateInputSchema,AutomationExecutionLogUncheckedCreateInputSchema ]),
}).strict() ;

export const AutomationExecutionLogUpsertArgsSchema: z.ZodType<Prisma.AutomationExecutionLogUpsertArgs> = z.object({
  select: AutomationExecutionLogSelectSchema.optional(),
  include: AutomationExecutionLogIncludeSchema.optional(),
  where: AutomationExecutionLogWhereUniqueInputSchema,
  create: z.union([ AutomationExecutionLogCreateInputSchema,AutomationExecutionLogUncheckedCreateInputSchema ]),
  update: z.union([ AutomationExecutionLogUpdateInputSchema,AutomationExecutionLogUncheckedUpdateInputSchema ]),
}).strict() ;

export const AutomationExecutionLogCreateManyArgsSchema: z.ZodType<Prisma.AutomationExecutionLogCreateManyArgs> = z.object({
  data: z.union([ AutomationExecutionLogCreateManyInputSchema,AutomationExecutionLogCreateManyInputSchema.array() ]),
}).strict() ;

export const AutomationExecutionLogCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AutomationExecutionLogCreateManyAndReturnArgs> = z.object({
  data: z.union([ AutomationExecutionLogCreateManyInputSchema,AutomationExecutionLogCreateManyInputSchema.array() ]),
}).strict() ;

export const AutomationExecutionLogDeleteArgsSchema: z.ZodType<Prisma.AutomationExecutionLogDeleteArgs> = z.object({
  select: AutomationExecutionLogSelectSchema.optional(),
  include: AutomationExecutionLogIncludeSchema.optional(),
  where: AutomationExecutionLogWhereUniqueInputSchema,
}).strict() ;

export const AutomationExecutionLogUpdateArgsSchema: z.ZodType<Prisma.AutomationExecutionLogUpdateArgs> = z.object({
  select: AutomationExecutionLogSelectSchema.optional(),
  include: AutomationExecutionLogIncludeSchema.optional(),
  data: z.union([ AutomationExecutionLogUpdateInputSchema,AutomationExecutionLogUncheckedUpdateInputSchema ]),
  where: AutomationExecutionLogWhereUniqueInputSchema,
}).strict() ;

export const AutomationExecutionLogUpdateManyArgsSchema: z.ZodType<Prisma.AutomationExecutionLogUpdateManyArgs> = z.object({
  data: z.union([ AutomationExecutionLogUpdateManyMutationInputSchema,AutomationExecutionLogUncheckedUpdateManyInputSchema ]),
  where: AutomationExecutionLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AutomationExecutionLogUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AutomationExecutionLogUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AutomationExecutionLogUpdateManyMutationInputSchema,AutomationExecutionLogUncheckedUpdateManyInputSchema ]),
  where: AutomationExecutionLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AutomationExecutionLogDeleteManyArgsSchema: z.ZodType<Prisma.AutomationExecutionLogDeleteManyArgs> = z.object({
  where: AutomationExecutionLogWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AutomationTestRunCreateArgsSchema: z.ZodType<Prisma.AutomationTestRunCreateArgs> = z.object({
  select: AutomationTestRunSelectSchema.optional(),
  include: AutomationTestRunIncludeSchema.optional(),
  data: z.union([ AutomationTestRunCreateInputSchema,AutomationTestRunUncheckedCreateInputSchema ]),
}).strict() ;

export const AutomationTestRunUpsertArgsSchema: z.ZodType<Prisma.AutomationTestRunUpsertArgs> = z.object({
  select: AutomationTestRunSelectSchema.optional(),
  include: AutomationTestRunIncludeSchema.optional(),
  where: AutomationTestRunWhereUniqueInputSchema,
  create: z.union([ AutomationTestRunCreateInputSchema,AutomationTestRunUncheckedCreateInputSchema ]),
  update: z.union([ AutomationTestRunUpdateInputSchema,AutomationTestRunUncheckedUpdateInputSchema ]),
}).strict() ;

export const AutomationTestRunCreateManyArgsSchema: z.ZodType<Prisma.AutomationTestRunCreateManyArgs> = z.object({
  data: z.union([ AutomationTestRunCreateManyInputSchema,AutomationTestRunCreateManyInputSchema.array() ]),
}).strict() ;

export const AutomationTestRunCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AutomationTestRunCreateManyAndReturnArgs> = z.object({
  data: z.union([ AutomationTestRunCreateManyInputSchema,AutomationTestRunCreateManyInputSchema.array() ]),
}).strict() ;

export const AutomationTestRunDeleteArgsSchema: z.ZodType<Prisma.AutomationTestRunDeleteArgs> = z.object({
  select: AutomationTestRunSelectSchema.optional(),
  include: AutomationTestRunIncludeSchema.optional(),
  where: AutomationTestRunWhereUniqueInputSchema,
}).strict() ;

export const AutomationTestRunUpdateArgsSchema: z.ZodType<Prisma.AutomationTestRunUpdateArgs> = z.object({
  select: AutomationTestRunSelectSchema.optional(),
  include: AutomationTestRunIncludeSchema.optional(),
  data: z.union([ AutomationTestRunUpdateInputSchema,AutomationTestRunUncheckedUpdateInputSchema ]),
  where: AutomationTestRunWhereUniqueInputSchema,
}).strict() ;

export const AutomationTestRunUpdateManyArgsSchema: z.ZodType<Prisma.AutomationTestRunUpdateManyArgs> = z.object({
  data: z.union([ AutomationTestRunUpdateManyMutationInputSchema,AutomationTestRunUncheckedUpdateManyInputSchema ]),
  where: AutomationTestRunWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AutomationTestRunUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.AutomationTestRunUpdateManyAndReturnArgs> = z.object({
  data: z.union([ AutomationTestRunUpdateManyMutationInputSchema,AutomationTestRunUncheckedUpdateManyInputSchema ]),
  where: AutomationTestRunWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AutomationTestRunDeleteManyArgsSchema: z.ZodType<Prisma.AutomationTestRunDeleteManyArgs> = z.object({
  where: AutomationTestRunWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BaseCreateArgsSchema: z.ZodType<Prisma.BaseCreateArgs> = z.object({
  select: BaseSelectSchema.optional(),
  include: BaseIncludeSchema.optional(),
  data: z.union([ BaseCreateInputSchema,BaseUncheckedCreateInputSchema ]),
}).strict() ;

export const BaseUpsertArgsSchema: z.ZodType<Prisma.BaseUpsertArgs> = z.object({
  select: BaseSelectSchema.optional(),
  include: BaseIncludeSchema.optional(),
  where: BaseWhereUniqueInputSchema,
  create: z.union([ BaseCreateInputSchema,BaseUncheckedCreateInputSchema ]),
  update: z.union([ BaseUpdateInputSchema,BaseUncheckedUpdateInputSchema ]),
}).strict() ;

export const BaseCreateManyArgsSchema: z.ZodType<Prisma.BaseCreateManyArgs> = z.object({
  data: z.union([ BaseCreateManyInputSchema,BaseCreateManyInputSchema.array() ]),
}).strict() ;

export const BaseCreateManyAndReturnArgsSchema: z.ZodType<Prisma.BaseCreateManyAndReturnArgs> = z.object({
  data: z.union([ BaseCreateManyInputSchema,BaseCreateManyInputSchema.array() ]),
}).strict() ;

export const BaseDeleteArgsSchema: z.ZodType<Prisma.BaseDeleteArgs> = z.object({
  select: BaseSelectSchema.optional(),
  include: BaseIncludeSchema.optional(),
  where: BaseWhereUniqueInputSchema,
}).strict() ;

export const BaseUpdateArgsSchema: z.ZodType<Prisma.BaseUpdateArgs> = z.object({
  select: BaseSelectSchema.optional(),
  include: BaseIncludeSchema.optional(),
  data: z.union([ BaseUpdateInputSchema,BaseUncheckedUpdateInputSchema ]),
  where: BaseWhereUniqueInputSchema,
}).strict() ;

export const BaseUpdateManyArgsSchema: z.ZodType<Prisma.BaseUpdateManyArgs> = z.object({
  data: z.union([ BaseUpdateManyMutationInputSchema,BaseUncheckedUpdateManyInputSchema ]),
  where: BaseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BaseUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.BaseUpdateManyAndReturnArgs> = z.object({
  data: z.union([ BaseUpdateManyMutationInputSchema,BaseUncheckedUpdateManyInputSchema ]),
  where: BaseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const BaseDeleteManyArgsSchema: z.ZodType<Prisma.BaseDeleteManyArgs> = z.object({
  where: BaseWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SpaceCreateArgsSchema: z.ZodType<Prisma.SpaceCreateArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  data: z.union([ SpaceCreateInputSchema,SpaceUncheckedCreateInputSchema ]),
}).strict() ;

export const SpaceUpsertArgsSchema: z.ZodType<Prisma.SpaceUpsertArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereUniqueInputSchema,
  create: z.union([ SpaceCreateInputSchema,SpaceUncheckedCreateInputSchema ]),
  update: z.union([ SpaceUpdateInputSchema,SpaceUncheckedUpdateInputSchema ]),
}).strict() ;

export const SpaceCreateManyArgsSchema: z.ZodType<Prisma.SpaceCreateManyArgs> = z.object({
  data: z.union([ SpaceCreateManyInputSchema,SpaceCreateManyInputSchema.array() ]),
}).strict() ;

export const SpaceCreateManyAndReturnArgsSchema: z.ZodType<Prisma.SpaceCreateManyAndReturnArgs> = z.object({
  data: z.union([ SpaceCreateManyInputSchema,SpaceCreateManyInputSchema.array() ]),
}).strict() ;

export const SpaceDeleteArgsSchema: z.ZodType<Prisma.SpaceDeleteArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  where: SpaceWhereUniqueInputSchema,
}).strict() ;

export const SpaceUpdateArgsSchema: z.ZodType<Prisma.SpaceUpdateArgs> = z.object({
  select: SpaceSelectSchema.optional(),
  include: SpaceIncludeSchema.optional(),
  data: z.union([ SpaceUpdateInputSchema,SpaceUncheckedUpdateInputSchema ]),
  where: SpaceWhereUniqueInputSchema,
}).strict() ;

export const SpaceUpdateManyArgsSchema: z.ZodType<Prisma.SpaceUpdateManyArgs> = z.object({
  data: z.union([ SpaceUpdateManyMutationInputSchema,SpaceUncheckedUpdateManyInputSchema ]),
  where: SpaceWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SpaceUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.SpaceUpdateManyAndReturnArgs> = z.object({
  data: z.union([ SpaceUpdateManyMutationInputSchema,SpaceUncheckedUpdateManyInputSchema ]),
  where: SpaceWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const SpaceDeleteManyArgsSchema: z.ZodType<Prisma.SpaceDeleteManyArgs> = z.object({
  where: SpaceWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TableCreateArgsSchema: z.ZodType<Prisma.TableCreateArgs> = z.object({
  select: TableSelectSchema.optional(),
  include: TableIncludeSchema.optional(),
  data: z.union([ TableCreateInputSchema,TableUncheckedCreateInputSchema ]),
}).strict() ;

export const TableUpsertArgsSchema: z.ZodType<Prisma.TableUpsertArgs> = z.object({
  select: TableSelectSchema.optional(),
  include: TableIncludeSchema.optional(),
  where: TableWhereUniqueInputSchema,
  create: z.union([ TableCreateInputSchema,TableUncheckedCreateInputSchema ]),
  update: z.union([ TableUpdateInputSchema,TableUncheckedUpdateInputSchema ]),
}).strict() ;

export const TableCreateManyArgsSchema: z.ZodType<Prisma.TableCreateManyArgs> = z.object({
  data: z.union([ TableCreateManyInputSchema,TableCreateManyInputSchema.array() ]),
}).strict() ;

export const TableCreateManyAndReturnArgsSchema: z.ZodType<Prisma.TableCreateManyAndReturnArgs> = z.object({
  data: z.union([ TableCreateManyInputSchema,TableCreateManyInputSchema.array() ]),
}).strict() ;

export const TableDeleteArgsSchema: z.ZodType<Prisma.TableDeleteArgs> = z.object({
  select: TableSelectSchema.optional(),
  include: TableIncludeSchema.optional(),
  where: TableWhereUniqueInputSchema,
}).strict() ;

export const TableUpdateArgsSchema: z.ZodType<Prisma.TableUpdateArgs> = z.object({
  select: TableSelectSchema.optional(),
  include: TableIncludeSchema.optional(),
  data: z.union([ TableUpdateInputSchema,TableUncheckedUpdateInputSchema ]),
  where: TableWhereUniqueInputSchema,
}).strict() ;

export const TableUpdateManyArgsSchema: z.ZodType<Prisma.TableUpdateManyArgs> = z.object({
  data: z.union([ TableUpdateManyMutationInputSchema,TableUncheckedUpdateManyInputSchema ]),
  where: TableWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TableUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.TableUpdateManyAndReturnArgs> = z.object({
  data: z.union([ TableUpdateManyMutationInputSchema,TableUncheckedUpdateManyInputSchema ]),
  where: TableWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const TableDeleteManyArgsSchema: z.ZodType<Prisma.TableDeleteManyArgs> = z.object({
  where: TableWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const FieldCreateArgsSchema: z.ZodType<Prisma.FieldCreateArgs> = z.object({
  select: FieldSelectSchema.optional(),
  include: FieldIncludeSchema.optional(),
  data: z.union([ FieldCreateInputSchema,FieldUncheckedCreateInputSchema ]),
}).strict() ;

export const FieldUpsertArgsSchema: z.ZodType<Prisma.FieldUpsertArgs> = z.object({
  select: FieldSelectSchema.optional(),
  include: FieldIncludeSchema.optional(),
  where: FieldWhereUniqueInputSchema,
  create: z.union([ FieldCreateInputSchema,FieldUncheckedCreateInputSchema ]),
  update: z.union([ FieldUpdateInputSchema,FieldUncheckedUpdateInputSchema ]),
}).strict() ;

export const FieldCreateManyArgsSchema: z.ZodType<Prisma.FieldCreateManyArgs> = z.object({
  data: z.union([ FieldCreateManyInputSchema,FieldCreateManyInputSchema.array() ]),
}).strict() ;

export const FieldCreateManyAndReturnArgsSchema: z.ZodType<Prisma.FieldCreateManyAndReturnArgs> = z.object({
  data: z.union([ FieldCreateManyInputSchema,FieldCreateManyInputSchema.array() ]),
}).strict() ;

export const FieldDeleteArgsSchema: z.ZodType<Prisma.FieldDeleteArgs> = z.object({
  select: FieldSelectSchema.optional(),
  include: FieldIncludeSchema.optional(),
  where: FieldWhereUniqueInputSchema,
}).strict() ;

export const FieldUpdateArgsSchema: z.ZodType<Prisma.FieldUpdateArgs> = z.object({
  select: FieldSelectSchema.optional(),
  include: FieldIncludeSchema.optional(),
  data: z.union([ FieldUpdateInputSchema,FieldUncheckedUpdateInputSchema ]),
  where: FieldWhereUniqueInputSchema,
}).strict() ;

export const FieldUpdateManyArgsSchema: z.ZodType<Prisma.FieldUpdateManyArgs> = z.object({
  data: z.union([ FieldUpdateManyMutationInputSchema,FieldUncheckedUpdateManyInputSchema ]),
  where: FieldWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const FieldUpdateManyAndReturnArgsSchema: z.ZodType<Prisma.FieldUpdateManyAndReturnArgs> = z.object({
  data: z.union([ FieldUpdateManyMutationInputSchema,FieldUncheckedUpdateManyInputSchema ]),
  where: FieldWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const FieldDeleteManyArgsSchema: z.ZodType<Prisma.FieldDeleteManyArgs> = z.object({
  where: FieldWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;
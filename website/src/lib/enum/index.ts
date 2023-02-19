export enum validResultOfDomain {
  // ReasonOk is used when the value is ok
  ReasonOk = 'ok',
  // ReasonExistedValue is used when the value is existed
  ReasonExistedValue = 'value_existed',
  // ReasonRequired is used when the field is required
  ReasonRequired = 'required',
  // ReasonInvalidField is used when the field is not valid
  ReasonInvalidField = 'invalid_field',
  // ReasonNotSupport is used when the field is not supported
  ReasonNotSupport = 'not_support',
}

export enum RoleType {
  UserOfDeschool = 'UserOfDeschool',
  UserOfLens = 'UserOfLens',
  Visitor = 'Visitor',
}

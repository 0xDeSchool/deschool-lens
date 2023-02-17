// @ts-ignore
import omitDeep from 'omit-deep'

export const omit = (object: any, name: string) => omitDeep(object, name)

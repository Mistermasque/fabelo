type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/**
 * Type utilitaire permettant de dériver d'un type en rendant une propriété facultative
 * Ex: type MakePersonInput = PartialBy<{name: string, id: number}, 'name'> -> {name?: string, id: number}
 * https://stackoverflow.com/questions/43159887/make-a-single-property-optional-in-typescript
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

/**
 * Type utilitaire permettant de récupérer le type d'un élément d'un tableau
 * Ex: type A = ArrayElement<string[]>; -> string
 * https://stackoverflow.com/questions/41253310/typescript-retrieve-element-type-information-from-array-type
 */
export type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never

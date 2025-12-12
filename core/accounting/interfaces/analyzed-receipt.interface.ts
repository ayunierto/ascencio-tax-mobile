export interface AnalyzedReceipt {
  DocumentMetadata: DocumentMetadata;
  ExpenseDocuments: ExpenseDocument[];
}

export interface DocumentMetadata {
  Pages: number;
}

export interface ExpenseDocument {
  ExpenseIndex: number;
  SummaryFields: SummaryField[];
  LineItemGroups: LineItemGroup[];
  Blocks: Block[];
}

export interface Block {
  BlockType: BlockType;
  Geometry: Geometry;
  Id: string;
  Relationships?: Relationship[];
  Confidence?: number;
  Text?: string;
  TextType?: TextType;
  Page?: number;
}

export enum BlockType {
  Line = 'LINE',
  Page = 'PAGE',
  Word = 'WORD',
}

export interface Geometry {
  BoundingBox: BoundingBox;
  Polygon: Polygon[];
}

export interface BoundingBox {
  Width: number;
  Height: number;
  Left: number;
  Top: number;
}

export interface Polygon {
  X: number;
  Y: number;
}

export interface Relationship {
  Type: TypeEnum;
  Ids: string[];
}

export enum TypeEnum {
  Child = 'CHILD',
}

export enum TextType {
  Printed = 'PRINTED',
}

export interface LineItemGroup {
  LineItemGroupIndex: number;
  LineItems: LineItem[];
}

export interface LineItem {
  LineItemExpenseFields: LineItemExpenseField[];
}

export interface LineItemExpenseField {
  Type: TypeClass;
  LabelDetection?: Detection;
  ValueDetection: Detection;
  PageNumber: number;
}

export interface Detection {
  Text: string;
  Geometry: Geometry;
  Confidence: number;
}

export interface TypeClass {
  Text: string;
  Confidence: number;
}

export interface SummaryField {
  Type: TypeClass;
  ValueDetection: Detection;
  PageNumber: number;
  GroupProperties?: GroupProperty[];
  LabelDetection?: Detection;
  Currency?: Currency;
}

export interface Currency {
  Code: string;
}

export interface GroupProperty {
  Types: string[];
  Id: string;
}

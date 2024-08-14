export const BLOCK_SIZE = 6;
export const ELEMENT_SIZE = 10;

export const allocCode = `
sample::MyType* sample::mypool_AllocMaybe() {
  sample::MyType *row = (sample::MyType*)mypool_AllocMem(sizeof(sample::MyType));
  if (row) {
    new (row) sample::MyType; // call constructor
  }
  return row;
}`;

export const freeCode = `
void sample::mypool_Delete(sample::MyType &row) {
  int length = sizeof(sample::MyType);
  row.~MyType();
  mypool_FreeMem(&row, length);
}`;

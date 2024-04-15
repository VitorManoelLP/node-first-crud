export default interface Query {
  create(query: string, values?: any): Promise<any>;
}
import Request from "./request";

export class DeleteRequest extends Request {
  constructor(readonly id: string) {
    super();
    this.id = id;
  }
}
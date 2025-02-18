export class Pager {
  public page: number;
  public perPage: number;
  public total: number;
  public slide: number;
  constructor(page = 1, perPage = 10, total = 0,slide=3) {
    this.page = page;
    this.perPage = perPage;
    this.total = total;
    this.slide = slide;
  }
}

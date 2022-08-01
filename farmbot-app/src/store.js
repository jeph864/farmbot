export const jobName = {
  Name : '',
  set setName(theName) {
    this.Name = theName;
  },
  get getName() {
    return this.Name;
  }
};
export const coordinates = {
  x1 : '',
  x2 : '',
  y1 : '',
  y2 : '',
  getFlag()
  {return this.flag;},
  set setx1(x1) {
    this.x1 = x1;
  },
  set setx2(x2) {
    this.x2 = x2;
  },
  set sety1(y1) {
    this.y1 = y1;
  },
  set sety2(y2) {
    this.y2 = y2;
  },
  get getx1() {
    return this.x1;
  },
  get getx2() {
    return this.x2;
  },
  get gety1() {
    return this.y1;
  },
  get gety2() {
    return this.y2;
  }
};
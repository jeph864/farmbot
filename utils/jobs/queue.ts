import { Job } from "./job";
export class JobQueue {
  private queue : Array<Job>;
  constructor() {
    this.queue = [];
  }
  add = (job : Job) => {
    this.queue.push(job);
  }
  remove = (job: Job) => {
    job;
}

}
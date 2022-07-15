import * as events from "events";
import {Agenda} from "agenda";
import { MongoClient } from "mongodb";


export class FMEventEmitter extends  events.EventEmitter{}

export class RadishAgenda {
  private agenda :Agenda;
  private client
  constructor(client) {
    // @ts-ignore
    this.agenda = new Agenda({mongo: client})
      .processEvery('5 seconds')
      .maxConcurrency(1)
      .lockLimit(0)
      .defaultLockLifetime(10000)
      .sort({ nextRunAt: 1, priority: -1 })
    this.client = client;
  };
  start = async () =>{
    return await this.agenda.start();
  }
  define = (jobname, [options], handler) => {
    return this.agenda.define(jobname, options, handler);
  }
}
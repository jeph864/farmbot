const baseUrl = "http://localhost:3001";
// const baseUrl = ""
export const jobName = {
  Name : '',
  set setName(theName) {
    this.Name = theName;
  },
  get getName() {
    return this.Name;
  }
};

async function createJob(job) {
  const url = `${baseUrl}/jobs/seeding/update`
  console.log(JSON.stringify(job))
  const init = {
    method: "POST",
    mode: "cors",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job)
  }
  fetch(url, init).then((res) => {
    console.log(res)
    return res.json();
  }).catch(err => {
    console.error(err)
  });

}

async function getJobs() {
  const url = `${baseUrl}/jobs/get`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });
  return res.json();
}


async function getWateringJobs() {
  const url = `${baseUrl}/jobs/watering/get`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });
  return res.json();
}



async function searchJobs(query) {
  //console.log("searching for "+query);
  const url = `${baseUrl}/search?name=${query}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  return res.json();
}

async function updateJob(job,query) {
  const url = `${baseUrl}/jobs/seeding/update?name=${query}`
  //console.log(JSON.stringify(job))
  const init = {
    method: "POST",
    mode: "cors",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(job)
  }
  fetch(url, init).then((res) => {
    console.log(res)
    return res.json();
  }).catch(err => {
    console.error(err)
  });


}
async function executeJob(job_id) {
  const url = `${baseUrl}/jobs/seeding/execute?id=${job_id}`
  const res = await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.json();

}

async function getStatus(){
  const url = `${baseUrl}/status`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });
  return res.json();
}


async function getPlantPos(){
  //TODO: create fetcher for getting plant positions

  //for test purpose:  -> delete after fetcher is implemented
  let plant1 = {
    location:{
      x: 2000,
      y: 700,
      z: 0
    },
    name: "radish",
    stage: "planted"
  }
  let plant3 = {
    location:{
      x: 2200,
      y: 700,
      z: 0
    },
    name: "radish",
    stage: "planted"
  }
  let plant2 = {
    location:{
      x: 2000,
      y: 600,
      z: 0
    },
    name: "apple",
    stage: "planned"
  }
  let plants=[plant1,plant2,plant3]
  return plants
}

async function getUnsafeAreas(){
  //TODO create fetcher to get the unsafe areas

  //for test purpose:  -> delete after fetcher is implemented
  let area1 = {
    beg_pos :{
      x: 1000,
      y: 600,
      z: 0
    },
    end_pos :{
      x: 1300,
      y: 800,
      z: 0
    },
    name: "seed tray"
  }
  let area2 = {
    beg_pos :{
      x: 1600,
      y: 200,
      z: 0
    },
    end_pos :{
      x: 1700,
      y: 300,
      z: 0
    },
    name: "obstacle"
  }
  let unsafeAreas=[area1,area2]
  return unsafeAreas
}

async function createWateringJob(watering_Job) {
  const url = `${baseUrl}/jobs/watering/update/`
  console.log(JSON.stringify(watering_Job))
  const init = {
    method: "POST",
    mode: "cors",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(watering_Job)
  }
  fetch(url, init).then((res) => {
    console.log(res)
    return res.json();
  }).catch(err => {
    console.error(err)
  });

}

async function executeWateringJob(watering_job_id) {
  const url = `${baseUrl}/jobs/watering/execute?id=${watering_job_id}`
  console.log(url)
  const res = await fetch(url, {
    method: "POST",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: {job_id : watering_job_id}
  });
  return res.json();
}


export {getUnsafeAreas, createJob, searchJobs, executeJob, getStatus,getJobs, getWateringJobs,createWateringJob, executeWateringJob, updateJob, getPlantPos}
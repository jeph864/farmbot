const baseUrl = "http://localhost:3001";
// const baseUrl = ""

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
  const url = `${baseUrl}/jobs/search/${query}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });
  return res.json();
}

async function executeJob(job_id) {
  const url = `${baseUrl}/jobs/seeding/execute`
  const res = await fetch(url, {
    method: "GET",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: {job_id : job_id}
  });
  return res.json();
}
async function executeWateringJob(job_id) {
  const url = `${baseUrl}/jobs/watering/execute`
  const res = await fetch(url, {
    method: "GET",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: {job_id : job_id}
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

  //for test purpose:
  let plant1 = {
    location:{
      x: 2000,
      y: 700,
      z: 0
    },
    name: "test",
    stage: "planted"
  }
  let plant2 = {
    location:{
      x: 2000,
      y: 600,
      z: 0
    },
    name: "test",
    stage: "planned"
  }
  let plants=[plant1,plant2]
  return plants
}


export {createJob, searchJobs,getJobs, getWateringJobs, executeJob, executeWateringJob, getStatus, getPlantPos}
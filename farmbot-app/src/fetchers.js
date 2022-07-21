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
export function get(name){val = name;}
export function set(){
  console.log()
}


export async function getJobs() {
  const url = `${baseUrl}/jobs/get`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });
  return res.json();
}


export async function getWateringJobs() {
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
  console.log("searching for "+query);
  const url = `${baseUrl}/search?name=${query}`
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });

  return res.json();
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

<<<<<<< HEAD

async function updateJob(job) {
  const url = `${baseUrl}/jobs/seeding/update`

  console.log(JSON.stringify(job))
=======
async function createWateringJob(watering_Job) {
  const url = `${baseUrl}/jobs/watering/update/`
  console.log(JSON.stringify(watering_Job))
>>>>>>> 2fb75426a52714c89b4e31fd0d08bc65a543aa48
  const init = {
    method: "POST",
    mode: "cors",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
<<<<<<< HEAD
    body: JSON.stringify(job)
=======
    body: JSON.stringify(watering_Job)
>>>>>>> 2fb75426a52714c89b4e31fd0d08bc65a543aa48
  }
  fetch(url, init).then((res) => {
    console.log(res)
    return res.json();
  }).catch(err => {
    console.error(err)
  });

}
<<<<<<< HEAD
export {createJob, searchJobs, executeJob, getStatus,updateJob}
=======

async function executeWateringJob(watering_job_id) {
  const url = `${baseUrl}/jobs/watering/execute`
  const res = await fetch(url, {
    method: "GET",
    mode: "no-cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: {job_id : watering_job_id}
  });
  return res.json();
}


export {createJob, searchJobs, executeJob, getStatus, createWateringJob, executeWateringJob}
>>>>>>> 2fb75426a52714c89b4e31fd0d08bc65a543aa48

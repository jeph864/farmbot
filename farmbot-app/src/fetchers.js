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
  const url = `${baseUrl}/jobs/execute`
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


async function updateJob(job) {
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
export {createJob, searchJobs, executeJob, getStatus,updateJob}
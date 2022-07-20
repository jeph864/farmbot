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
  const url = `${baseUrl}/jobs/execute/${job_id}`
  const res = await fetch(url, {
    method: "GET",
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

export {createJob, searchJobs, executeJob, getStatus}
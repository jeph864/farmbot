const baseUrl = "127.0.0.1";

async function createJob(job) {
  const url = `${baseUrl}/jobs/create/`
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(job)
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
    headers: {
      "Content-Type": "application/json"
    },
  });
  return res.json();
}
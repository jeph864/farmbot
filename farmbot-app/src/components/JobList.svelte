<script>
  import Job from "./Job.svelte";
  import { getJobs } from "../fetchers.js";

  let jobs
  let names

  async function gettingJobs(){
    jobs = await getJobs();
    if (jobs) return jobs;
    else throw  new Error("Error occured")
  }
  jobs = gettingJobs();



</script>






{#await  jobs}
  <p> Still waiting</p>
  {:then  data}


<table id>
  <caption>
    <th>Seeding jobs</th>
  </caption>
  <thead>
  <tr>
      <th>{"Name"}</th>
      <th>{"Plant-Type"}</th>
  </tr>
  </thead>
  <tbody>

  {#each Object.values(data) as value}
    <tr>
      <td>{value.name}</td>
      <td>{value.plant}</td>
    </tr>
  {/each}
  </tbody>
</table>





    {:catch error}
      <p>Got some error while processing</p>
    {/await}



<style>
    table {
        border-collapse: collapse;
        width: 100%;
    }

    td, th {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 6px;
    }

    tr:nth-child(even) {
        background-color: #dddddd;
    }
</style>


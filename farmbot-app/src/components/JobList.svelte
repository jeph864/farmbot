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


  <table>
    <thead>
    <tr>
      {#each Object.keys(data[0]) as columnHeading}
        <th>{columnHeading}</th>
      {/each}
    <tr/>
    </thead>
    <tbody>
    {#each Object.values(data) as row}
      <tr>
        {#each Object.values(row) as cell}
          <td>{cell}</td>
        {/each}
      </tr>
    {/each}
    </tbody>
  </table>

  {:catch error}
    <p>Got some error while processing</p>
  {/await}


<div>




</div>
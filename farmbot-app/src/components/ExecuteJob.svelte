<script>
  import ActionItem from "./ActionItem.svelte";
  import { executeJob } from "../fetchers.js";
  import { getJobs } from "../fetchers.js";

  //only example, need all the jobs from the database (names)
  //TODO: het all the jobs
  let selected;
  let options = [];
  let jobs;


  async function gettingJobs(){
    jobs = await getJobs();
    if (jobs) return jobs;
    else throw  new Error("Error occured")
  }

  jobs = gettingJobs();



  function execute() {

    executeJob(selected.id);
    console.log(selected.id);
    //TODO: execute "executeJob" from fetchers.js to pass the job to execute
  }


</script>




<ActionItem description="Execute a seeding job">

  <div>


    {#await  jobs}
      <p> Still waiting</p>
    {:then  data}

    <select bind:value={selected}>
      {#each Object.values(data) as value}
      <option {value}>{value.name}</option>
      {/each}
    </select>

    {:catch error}
      <p>Got some error while processing</p>
    {/await}

    <button on:click={execute}>
      Execute job
    </button>

  </div>

</ActionItem>

<style></style>
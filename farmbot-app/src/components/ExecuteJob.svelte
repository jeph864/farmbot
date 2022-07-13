<script>
  import ActionItem from "./ActionItem.svelte";
  import { executeJob } from "../fetchers.js";

  //only example, need all the jobs from the database (names)
  //TODO: het all the jobs
  let selected = 'Job 1';
  let options = [
    'Job 1',
    'Job 2',
    'Job 3'
  ]

  function execute() {

    console.log(selected);
    //TODO: execute "executeJob" from fetchers.js to pass the job to execute
  }


</script>




<ActionItem description="Execute a job">

  <div>

    <select bind:value={selected}>
      {#each options as value}<option {value}>{value}</option>{/each}
    </select>

    <button on:click={execute}>
      Execute job
    </button>

  </div>

</ActionItem>

<style></style>
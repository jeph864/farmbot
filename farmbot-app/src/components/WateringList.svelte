<script>
  import { executeWateringJob, getWateringJobs } from "../fetchers.js";
  import ActiveJob from "./ActiveJob.svelte";

  export let wateringJobs
  let names
  let x=true;

  export async function gettingWateringJobs(){
    wateringJobs = await getWateringJobs();
    if (wateringJobs) return wateringJobs;
    else throw  new Error("Error occurred")
  }
  wateringJobs = gettingWateringJobs();


  export async function onUpdate(){
    wateringJobs = undefined;
    wateringJobs = gettingWateringJobs();
  }

  function toggleJob(id,active){
    //TODO: activate/deactivate watering job
    //update(id, active -> !active)
    x=!x;

  }

  function execute(id){
    executeWateringJob(id);
  }

</script>



{#await  wateringJobs}
  <p> Still waiting</p>
{:then  data}

  <table id>
    <caption>
      <th><p style="">Watering jobs</p></th>
    </caption>
    <thead>
    <tr>
      <th>{"Name"}</th>
      <th>{"Plant-Type"}</th>
      <th>{"scheduled at"}</th>
      <th>{"active"}</th>
      <th>{"activate/ deactivate"} </th>
      <th>{"directly execute job"} </th>
    </tr>
    </thead>
    <tbody>

    {#each Object.values(data) as value}
      <tr>
        <td>{value.name}</td>
        <td>{value.plant}</td>
        <td>{value.next}</td>
        <td>

          <ActiveJob active={value.active} y={x} />

        </td>
        <td><button on:click={toggleJob(value.id, value.active)}>toggle job</button></td>
        <td><button on:click={execute(value.id)}>execute now</button></td>
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
        width: 50%;

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


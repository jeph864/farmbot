<script>
  import {executeWateringJob, getWateringJobs} from "../fetchers.js";

  export let wateringJobs
  let names

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

  function toggleJob(name){
    //TODO: activate/deactivate watering job


  }

  function execute(id){
    //TODO: directly execute watering job
    executeWateringJob(id)
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
        <td>{value.plant_type}</td>
        <td>{value.nextRunAt}</td>
        <td>{#if value.active}  <p style="color: green;">{"active"} </p>
        {:else}                 <p style="color: red;"> {"not active"} </p>
            {/if}
        </td>
        <td><button on:click={toggleJob(value.id)}>toggle job</button></td>
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


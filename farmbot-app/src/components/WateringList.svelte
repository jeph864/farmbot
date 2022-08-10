<script>
  import { executeWateringJob, getWateringJobs, toggleWateringJob } from "../fetchers.js";
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


  function toggleJob(id,active){
    if(active){
      toggleWateringJob(id, 0)
    }
    else{
      toggleWateringJob(id, 1)
    }
    gettingWateringJobs()

  }

  function execute(id){
    executeWateringJob(id);
  }

</script>



{#await  wateringJobs}
  <p> Still waiting</p>
{:then  data}

  <table style="width:100%;" id>
    <caption style="background-color: #b3d9b3">
      <th><p style="">Watering jobs</p></th>
      <th>
        <button style="background-color: #edfded" on:click={gettingWateringJobs}>
          Refresh
        </button>
      </th>
    </caption>
    <thead style="background-color: #b3d9b3">
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
        <td>{value.nextRunAt.toString()}</td>
        <td style="width: 70px">

          <ActiveJob active={value.scheduled} />

        </td>
        <td style="width: 70px"><button on:click={toggleJob(value.id, value.scheduled)}>toggle job</button></td>
        <td style="width: 100px"><button on:click={execute(value.id)}>execute now</button></td>
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

    th {
        text-align: center;
        padding: 6px;
    }
    td {
        border: 1px solid #dddddd;
        text-align: center;
        padding: 6px;
    }
    thead tr th {
        position:sticky; top:0; background: #b3d9b3;
    }

    tr:nth-child(even) {
        background-color: #cbe1cb;
    }
    thead tr th {
        position:sticky; top:0; background: #b3d9b3;
    }
    button{
        background-color: #f5ffff;
        border-color: grey;
        border-radius: 8px;
        font-size: 15px;
        cursor: pointer;
        user-select: none;
        padding: 3px;
    }
    button:hover {
        background-color: #e2ecec;
        border-radius: 12px;
    }


</style>


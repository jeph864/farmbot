<script>
  import { getWateringJobs } from "../fetchers.js";

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

</script>



{#await  wateringJobs}
  <p> Still waiting</p>
{:then  data}

  <table id>
    <caption>
      <th>Watering jobs</th>
    </caption>
    <thead>
    <tr>
      <th>{"Name"}</th>
      <th>{"Plant-Type"}</th>
      <th>{"scheduled at"}</th>
      <th>{"active"}</th>
      <th>{"activate/deactivate"} </th>
    </tr>
    </thead>
    <tbody>

    {#each Object.values(data) as value}
      <tr>
        <td>{value.name}</td>
        <td>{value.plant}</td>
        <td>{value.next}</td>
        <td>{#if value.active}  <p style="color: green;">{"active"} </p>
        {:else}                 <p style="color: red;"> {"not active"} </p>
            {/if}
        </td>
        <td><button on:click={toggleJob(value.name)}>toggle watering job</button></td>
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


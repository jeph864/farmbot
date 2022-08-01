<script>

  import { executeJob, getJobs} from "../fetchers.js";
  import {jobName} from "../store.js";



  let jobs
  let names

  async function gettingJobs(){
    jobs = await getJobs();
    if (jobs) return jobs;
    else throw  new Error("Error occurred")
  }
  jobs = gettingJobs();


  export async function onUpdate(){
    jobs = undefined;
    jobs = gettingJobs();
  }

  function execute(id){

    executeJob(id);
    console.log(id);
  }

  function edit(name){
    //TODO
    jobName.Name = name;
  }

</script>



{#await  jobs}
  <p> Still waiting</p>
{:then  data}


  <table style="width:100%;"id>
    <caption style="background-color: #b3d9b3">
      <th><p style="">Seeding jobs</p></th>
      <th>
        <button style="background-color: #edfded" on:click={gettingJobs}>
          Refresh
        </button>
      </th>

    </caption>
    <thead style="background-color: #b3d9b3">
    <tr>
      <th>{"Name"}</th>
      <th>{"Plant-Type"}</th>
      <th>{"Planting depth"}</th>
      <th>{"Plant distance"}</th>
      <th>{"Area width"}</th>
      <th>{"Area length"}</th>
      <th>{"execute job"}</th>
      <th>{"choose job to edit"}</th>
    </tr>
    </thead>
    <tbody>

    {#each Object.values(data) as value}
      <tr>
        <td><p style="">{value.name}</p></td>
        <td>{value.plant_type}</td>
        <td>{value.depth}</td>
        <td>{value.min_dist}</td>
        <td>{value.working_area.width}</td>
        <td>{value.working_area.length}</td>
        <td><button on:click={execute(value.id)}>execute</button></td>
        <td><button on:click={edit(value.name)}>Edit</button></td>
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

    thead tr th {
        position:sticky; top:0; background: #b3d9b3;
    }

    th {
        text-align: left;
        padding: 6px;
    }
    td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 6px;
    }
    thead tr th {
        position:sticky; top:0; background: #b3d9b3;
    }

    tr:nth-child(even) {
        background-color: #cbe1cb;
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


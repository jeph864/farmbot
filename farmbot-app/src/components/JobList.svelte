<script>
  import { executeJob, getJobs , jobName} from "../fetchers.js";

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
  //TODO: execute "executeJob" from fetchers.js to pass the job to execute
}
  function edit(name){
    jobName.Name = name;
    //console.log(jobName.Name);
  }

</script>



{#await  jobs}
  <p> Still waiting</p>
  {:then  data}


<table id>
  <caption>
    <th><p style="">Seeding jobs</p></th>
    <br>
    <button on:click={gettingJobs}>
      Refresh
    </button>

  </caption>
  <thead>
  <tr>
      <th>{"Name"}</th>
      <th>{"Plant-Type"}</th>
      <th>{"Planting depth"}</th>
      <th>{"Plant distance"}</th>
      <th>{"Area width"}</th>
      <th>{"Area length"}</th>
    <th>{"execute job"}</th>
    <th>{"edit job"}</th>
  </tr>
  </thead>
  <tbody>

  {#each Object.values(data) as value}
    <tr>
      <td>{value.name}</td>
      <td>{value.plant}</td>
      <td>{value.depth}</td>
      <td>{value.dist}</td>
      <td>{value.working_area.width}</td>
      <td>{value.working_area.length}</td>
      <td><button on:click={execute(value.id)}>execute</button></td>
      <td><button on:click={edit(value.id)}>edit</button></td>
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


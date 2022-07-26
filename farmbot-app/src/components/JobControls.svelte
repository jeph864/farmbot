<script>
  import CreateSeedingJob from "./CreateSeedingJob.svelte";
  import BotStatus from "./BotStatus.svelte";
  import CreateWateringJob from "./CreateWateringJob.svelte";
  //import ExecuteWateringJob from "./ExecuteWateringJob.svelte";
  import EditSeedingJob from "./EditSeedingJob.svelte";
  import EditWateringJob from "./EditWateringJob.svelte";
  import JobList from "./JobList.svelte";
  import { spring } from 'svelte/motion';
  import WateringList from "./WateringList.svelte";
  import { getJobs, getPlantPos } from "../fetchers.js";

  export let l=0;
  export let t=0;
  let y=0;

  export let first=true;
  let coords = spring({ x: 0, y: 0 } );
  let coords1 = spring({ x: 30, y: 30 } );
  let coords2 = spring({ x: 100, y: 200 } );

  let selectedPlant;

  let plants

  let selected_1, selected_2, selected_3, selected_4, selected_5, selected_6;
  let selected = [selected_1, selected_2, selected_3, selected_4, selected_5, selected_6];
  let options = [
    '---',
    'Seeding',
    'Watering'
  ]


  async function gettingPlantPos(){
    plants = await getPlantPos();
    if (plants) return plants;
    else throw  new Error("Error occurred")
  }

  plants=gettingPlantPos();


  function getField(){
    let element = document.getElementById('field');
    let position = element.getBoundingClientRect();
    l = position.left;
    t = position.top;
  }

</script>

<div class="container">

  <div class="jobs">
    <CreateSeedingJob x1={$coords1.x*3} y1={$coords1.y*3} x2={$coords2.x*3} y2={$coords2.y*3} />
    <EditSeedingJob x11={$coords1.x*3} y11={$coords1.y*3} x22={$coords2.x*3} y22={$coords2.y*3}/>
    <CreateWateringJob />
    <EditWateringJob />
    <!-- <ExecuteWateringJob />  -->
    <BotStatus />
  </div>


  <div class="wrapper">


    <div id="one">
      <select bind:value={selected[0]}>
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>

    </div>

    <div id="two">
      <select bind:value={selected[1]}>
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>
    </div>

    <div id="three">
      <select bind:value={selected[2]}>
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>
    </div>

    <div id="four">
      <select bind:value={selected[3]}>
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>
    </div>

    <div id="five">
      <select bind:value={selected[4]}>
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>
    </div>

    <div id="six">
      <select bind:value={selected[5]}>
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>
    </div>

    <button on:click={null}>
      Set toolbox positions
    </button>

  </div>





  <div class="field">
    <svg
      on:mousemove="{e => {coords.set({ x: e.offsetX, y: e.offsetY })}}"
      on:mousedown="{e => {if (first){
        coords1.set({ x: e.offsetX, y: e.offsetY }), first=false}
        else{
          coords2.set({ x: e.offsetX, y: e.offsetY}), first=true}
        }}"
    >
      <circle style="fill: rgba(220,128,51,0.76)" cx={$coords.x} cy={$coords.y} r=5 />
      <circle cx={$coords1.x} cy={$coords1.y} r=10 id="circle1" />
      <circle cx={$coords2.x} cy={$coords2.y} r=10 id="circle2"/>
      <rect x="{$coords1.x}" y={$coords1.y} width={$coords2.x-$coords1.x} height={$coords2.y-$coords1.y} style="fill:black;stroke:rgba(68,68,68,0.94);stroke-width:2;fill-opacity:0"/>

      {#await  plants}
      {:then  data}

        {#each Object.values(data) as plant}

          {#if plant.stage === "planted"}
            <circle style="fill:green" cx={plant.location.x/3} cy={plant.location.y/3} r=10 />
          {:else}
            <circle style="fill: darkseagreen; opacity: 0.5" cx={plant.location.x/3} cy={plant.location.y/3} r=8 />
          {/if}

        {/each}
      {:catch error}
      {/await}
    </svg>

  </div>



</div>

<div class="container2">

  <div class="table">
    <JobList />
  </div>

  <div class="table">
    <WateringList />
  </div>

</div>

<style>
    .container {
        width: 100%;
        padding-bottom: 8px;
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: start;
        overflow-x: auto;
    }
    .wrapper {
        width: 7%;
        display: flex;
        flex-direction: column;
    }
    .container2 {
        display: flex;
        justify-content: center;
        flex-direction: row;
        align-items: center;
    }
    .jobs{
        height: 402px;
        display: inline;
        justify-content: center;
        flex-direction: column;
        align-items: start;
        overflow-y: auto;
        margin-right: 20px;
    }
    .field{
        border: 2px solid #c7c7c7;
        border-radius: 8px;
        box-shadow: rgba(0, 0, 0, 100) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        background: rgba(110, 69, 19, 0.95);
        display: inline;
        justify-content: center;
        flex-direction: column;
        align-items: center;
    }
    .table {
        width: 50%;
        height: 400px;
        border: 2px solid #c7c7c7;
        border-radius: 8px;
        box-shadow: rgba(0, 0, 0, 100) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
        display: flex;
        justify-content: start;
        flex-direction: column;
        align-items: center;
        overflow-y: auto;
        margin: 10px;
    }
    circle {
        fill: rgba(255, 62, 0, 0.7);
    }
    svg {
        width: 896px;
        height: 402px;
    }
    select {
        border-radius: 6px;
        background-color: #f8f7e5;
        font-size: 15px;
        border: #dddddd;
        padding: 3px;
    }
    button{
        background-color: #f8f7e5;
        border-color: grey;
        border-radius: 8px;
        padding: 3px;
        font-size: 14px;
    }
    button:hover {
        background-color: #eae9d4;
        border-radius: 12px;
    }

</style>
<script>
  import CreateSeedingJob from "./CreateSeedingJob.svelte";
  import BotStatus from "./BotStatus.svelte";
  import CreateWateringJob from "./CreateWateringJob.svelte";
  import EditSeedingJob from "./EditSeedingJob.svelte";
  import EditWateringJob from "./EditWateringJob.svelte";
  import {updateTools} from "../fetchers.js";
  import {getTools} from "../fetchers.js";
  import JobList from "./JobList.svelte";
  import { spring } from 'svelte/motion';
  import WateringList from "./WateringList.svelte";
  import {coordinates} from "../store.js";
  import { getUnsafeAreas, getPlantPos } from "../fetchers.js";
  import CreateUnsafeZone from "./CreateUnsafeZone.svelte";
  import DeleteUnsafeZone from "./DeleteUnsafeZone.svelte";

  export let l=0;
  export let t=0;
  let y=0;

  export let first=true;
  let coords = spring({ x: 0, y: 0 } );
  let coords1 = spring({ x: 30, y: 30 } );
  let coords2 = spring({ x: 100, y: 200 } );


  let plants

  let selected_0, selected_1, selected_2, selected_3, selected_4, selected_5;
  selected_0 = "Seeding"
  let selected = [selected_0, selected_1, selected_2, selected_3, selected_4, selected_5];
  let options = [
    '',
    'seeding',
    'watering'
  ]


  async function gettingPlantPos(){
    plants = await getPlantPos();
    if (plants) return plants;
    else throw  new Error("Error occurred")
  }

  plants=gettingPlantPos();


  let unsafeAreas;
  async function gettingUnsafeAreas(){
    unsafeAreas = await getUnsafeAreas();
    if (unsafeAreas) return unsafeAreas;
    else throw  new Error("Error occurred")
  }

  unsafeAreas=gettingUnsafeAreas();


  function getField(){
    let element = document.getElementById('field');
    let position = element.getBoundingClientRect();
    l = position.left;
    t = position.top;
  }
  function setData(x1,y1,x2,y2) {
    coordinates.x1= x1;
    coordinates.y1= y1;
    coordinates.x2= x2;
    coordinates.y2= y2;
  }


  let markedPlant="test";
  let showPlantType=false;
  let mouseOnPlant=false;

  export function clickPlants(s){
    showPlantType=true;
    markedPlant=s;
  }

  let colourL='green'
  function handleMouseOverL(e) {
    colourL = '#015201';
    mouseOnPlant=true;
  }

  function handleMouseOutL(e) {
    colourL = 'green';
    mouseOnPlant=false;
  }

  let colourRG='green'
  let colourRR='red'
  function handleMouseOverR(e) {
    colourRG = '#015201';
    colourRR = '#b40606';
    mouseOnPlant=true;
  }

  function handleMouseOutR(e) {
    colourRG = 'green';
    colourRR = 'red';
    mouseOnPlant=false;
  }

  let colourUP='rgba(143, 188, 143, 0.68)'
  function handleMouseOverUP(e) {
    colourUP = 'rgba(79,107,79,0.96)';
    mouseOnPlant=true;
  }

  function handleMouseOutUP(e) {
    colourUP = 'rgba(143, 188, 143, 0.68)';
    mouseOnPlant=false;
  }


  function setPositions(){
    //set here the different tools that are available and check if they are only selected once
    if(nodoubles(tools, "seeding")){
      if(nodoubles(tools, "watering")){

      //let data= {selected}
       updateTools(tools);

      }
      else { alert("Watering tool has to be selected exactly once!"); }
    }
    else { alert("Seeding tool has to be selected exactly once!"); }
  }

  export async function tools(){
    tools = await getTools();
    if (tools) return tools;
    else throw  new Error("Error occured")
  }
  tools = tools();


  function getPositions(){

    console.log(tools)
  }





  function nodoubles (array, word){
    let counter = 0;
    for ( let i=0; i<=5; i++ ) {
      if (array[i] == word) {
        counter++;
      }
    }
    if (counter ==1){
      return true
    }else{
      return false
    }

  }


</script>

<div class="container">

  <div class="jobs">
    <CreateSeedingJob x1={$coords1.x*3} y1={$coords1.y*3} x2={$coords2.x*3} y2={$coords2.y*3} />
    <EditSeedingJob x1={$coords1.x*3} y1={$coords1.y*3} x2={$coords2.x*3} y2={$coords2.y*3} />
    <CreateWateringJob />
    <!-- <EditWateringJob /> -->
    <CreateUnsafeZone x1={$coords1.x*3} y1={$coords1.y*3} x2={$coords2.x*3} y2={$coords2.y*3} />
    <DeleteUnsafeZone />
    <BotStatus />
  </div>


  <div class="wrapper">

    <p style="font-weight: bold">Toolbox: </p>
    Current tool attached: {tools[tools[6]]}

    <div style="margin-top: 5px" id="one">
      <select bind:value={tools[5]} style="background-color: rgba(238, 236, 193, 0.85);">
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>

    </div>

    <div id="two">
      <select bind:value={tools[4]} style="background-color: rgba(238, 236, 193, 0.85);">
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>
    </div>

    <div id="three">
      <select bind:value={tools[3]} style="background-color: rgba(238, 236, 193, 0.85);">
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>
    </div>

    <div style="margin-top: 10px" id="four">
      <select bind:value={tools[2]} style="background-color: rgba(238, 236, 193, 0.85);">
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>
    </div>

    <div id="five">
      <select bind:value={tools[1]} style="background-color: rgba(238, 236, 193, 0.85);">
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>
    </div>

    <div id="six">
      <select bind:value={tools[0]} style="background-color: rgba(238, 236, 193, 0.85);">
        {#each options as value}<option {value}>{value}</option>{/each}
      </select>
    </div>

    <br />
    <button on:click={setPositions} style="background-color: rgba(238, 236, 193, 0.85);">
      Set toolbox positions
    </button>


    {#if showPlantType}
      <p>The plant you clicked is: <br />{markedPlant} </p>
    {:else}
      <p>Click a plant to find out what it is!</p>
    {/if}

  </div>



  <div class="field">
      <svg
        on:mouseover="{coords1.set({ x: coordinates.x1/3, y: coordinates.y1/3 })}" on:mouseover="{coords2.set({ x: coordinates.x2/3, y: coordinates.y2/3 })}"
        on:mousemove="{e => {coords.set({ x: e.offsetX, y: e.offsetY })}}"
        on:mousedown="{e => {if (first && !mouseOnPlant){
        coords1.set({ x: e.offsetX, y: 402-e.offsetY });
        coordinates.x1 = e.offsetX*3;
        coordinates.y1 = (402-e.offsetY)*3;
        first=false;
      }
        else{if(!mouseOnPlant){
          coords2.set({ x: e.offsetX, y: 402-e.offsetY});
          coordinates.x2 = e.offsetX*3;
          coordinates.y2 = (402-e.offsetY)*3;
          first=true;
        }
        }}}"

      >

      <circle style="fill: rgba(220,128,51,0.76)" cx={$coords.x} cy={$coords.y} r=5 />
      <circle cx={$coords1.x} cy={402-$coords1.y} r=10 id="circle1" />
      <circle cx={$coords2.x} cy={402-$coords2.y} r=10 id="circle2"/>
      <rect x="{$coords1.x}" y={402-$coords1.y-($coords2.y-$coords1.y)} width={$coords2.x-$coords1.x} height={($coords2.y-$coords1.y)} style="fill:black;stroke:rgba(68,68,68,0.94);stroke-width:2;fill-opacity:0"/>


    {#await  plants}
    {:then  data}

        {#each Object.values(data) as plant}

              {#if plant.plant_type === "radish"}
                <circle on:mouseover={handleMouseOverR} on:mouseout={handleMouseOutR} on:click={() => clickPlants('radish')} style="fill:{colourRG}" cx={plant.x_coord/3} cy={402-plant.y_coord/3} r=10 />
                <circle on:mouseover={handleMouseOverR} on:mouseout={handleMouseOutR} on:click={() => clickPlants('radish')} style="fill:{colourRR}" cx={plant.x_coord/3} cy={402-plant.y_coord/3+8} r=6 />
                {:else} <!-- maybe more types later:  {#if plant.name === "lettuce"} -->
                  <circle on:mouseover={handleMouseOverL} on:mouseout={handleMouseOutL} on:click={() => clickPlants(plant.plant_type)} style="fill:{colourL}" cx={plant.x_coord/3} cy={402-plant.y_coord/3} r=12 />
                <!--  {:else} --><!-- default case
                    <circle on:click={() => clickPlants(plant.name)} style="fill:green" cx={plant.x_coords/3} cy={plant.y_coords/3} r=10 />
                {/if}-->
              {/if}

      {/each}
    {:catch error}
    {/await}

      {#await unsafeAreas}
      {:then  data}

        {#each Object.values(data) as area}

              <rect class="unsafe" x={area.location.beg.x/3} y={402-(area.location.beg.y/3)-((area.location.end.y-area.location.beg.y)/3)} width={(area.location.end.x-area.location.beg.x)/3} height={(area.location.end.y-area.location.beg.y)/3}>{area.name}</rect>
              <text x={(area.location.beg.x/3)+10} y={(402-(area.location.beg.y/3))-((area.location.end.y-area.location.beg.y)/6)+5}>{area.name}</text>

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

  }
  .wrapper {
    width: 7%;
    display: flex;
    flex-direction: column;
      margin-right: 10px;
  }
  .container2 {
      display: flex;
      justify-content: center;
      flex-direction: row;
      align-items: center;
  }
  .jobs{
      width: 440px;
      height: 402px;
      display: inline;
      justify-content: center;
      flex-direction: column;
      align-items: start;
      overflow-y: auto;
      margin-right: 5px;
      overflow-x: hidden;
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
      overflow-x: auto;
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
  .unsafe{
      fill: rgba(203, 5, 5, 0.81);
      text-decoration-color: #00CC00;
      align-content: center;
      rx: 6px;
      ry: 6px;
  }
  select{
      border-radius: 16px;
      box-shadow: rgba(50, 50, 93, 0.15) 0px 2px 5px -1px, rgba(0, 0, 0, 0.2) 0px 1px 3px -1px;
  }

</style>
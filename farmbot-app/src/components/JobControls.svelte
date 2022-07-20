<script>
  import CreateSeedingJob from "./CreateSeedingJob.svelte";
  import BotStatus from "./BotStatus.svelte";
  import ExecuteJob from "./ExecuteJob.svelte";
  import CreateWateringJob from "./CreateWateringJob.svelte";
  import ExecuteWateringJob from "./ExecuteWateringJob.svelte";
  import EditSeedingJob from "./EditSeedingJob.svelte";
  import EditWateringJob from "./EditWateringJob.svelte";
  import JobList from "./JobList.svelte";
  import { spring } from 'svelte/motion';

  export let l=0;
  export let t=0;

  export let first=true;
  let coords = spring({ x: 50, y: 50 } );
  let coords1 = spring({ x: 10, y: 10 } );
  let coords2 = spring({ x: 50, y: 50 } );

  function getField(){
    let element = document.getElementById('field');
    let position = element.getBoundingClientRect();
    l = position.left;
    t = position.top;
  }

</script>

<div class="container">
  <div class="jobs">
    <CreateSeedingJob x1={$coords1.x*4} y1={$coords1.y*4} x2={$coords2.x*4} y2={$coords2.y*4} />
    <!-- <EditSeedingJob /> -->
    <ExecuteJob />
    <CreateWateringJob />
    <!-- <EditWateringJob /> -->
    <ExecuteWateringJob />
    <BotStatus />
  </div>

  <div class="container2">
  <div class="field">


    <svg
      on:mousemove="{e => {coords.set({ x: e.offsetX, y: e.offsetY })}}"
      on:mousedown="{e => {if (first){
        coords1.set({ x: e.offsetX, y: e.offsetY }), first=false}
        else{
          coords2.set({ x: e.offsetX, y: e.offsetY}), first=true}
        }}"
    >

    <circle cx={$coords.x} cy={$coords.y} r=5 />
    <circle cx={$coords1.x} cy={$coords1.y} r=10 id="circle1" />
    <circle cx={$coords2.x} cy={$coords2.y} r=10 id="circle2"/>
    <rect x="{$coords1.x}" y={$coords1.y} width={$coords2.x-$coords1.x} height={$coords2.y-$coords1.y} style="fill:black;stroke:black;stroke-width:2;fill-opacity:0"/>
    </svg>

  </div>
</div>


</div>

<div class="table">
  <JobList />
</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    flex-direction: row;
    align-items: start;
  }
  .container2 {
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
  }
  .jobs{
      height: 380px;
      display: inline;
      justify-content: center;
      flex-direction: column;
      align-items: start;
      overflow-y: auto;
  }
  .field{
      border: 2px solid #c7c7c7;
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 100) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
      background: rgba(110,69,19, 50);
      display: inline;
      justify-content: center;
      flex-direction: column;
      align-items: center;
  }
  .table {
      width: 50%;
      border: 2px solid #c7c7c7;
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 100) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
  }
  circle {
      fill: #ff3e00;
  }
  svg {
      width: 672px;
      height: 302px;
  }

</style>
<script>
  import CreateSeedingJob from "./CreateSeedingJob.svelte";
  import BotStatus from "./BotStatus.svelte";
  import ExecuteJob from "./ExecuteJob.svelte";
  import CreateWateringJob from "./CreateWateringJob.svelte";
  import ExecuteWateringJob from "./ExecuteWateringJob.svelte";
  import EditSeedingJob from "./EditSeedingJob.svelte";
  import EditWateringJob from "./EditWateringJob.svelte";
  import { Canvas, Layer, t } from "svelte-canvas";
  import JobList from "./JobList.svelte";

  let test="";

  $: render = ({ context, width, height }) => {
    context.fillStyle = `hsl(${$t / 40}, 100%, 50%)`;
    context.fill();
  };

  let pos = { x: 0, y: 0 };

  function handleMousemove(event) {
    pos.x = event.clientX-658;
    pos.y = event.clientY-104;
  }

  function handleClick(){

  }

  export {pos};
</script>

<div class="container">
  <div class="jobs">
    <CreateSeedingJob />
    <!-- <EditSeedingJob /> -->
    <ExecuteJob />
    <CreateWateringJob />
    <!-- <EditWateringJob /> -->
    <ExecuteWateringJob />
    <BotStatus />
    {test}
  </div>
  <div on:mousemove={handleMousemove} class="field">
    <Canvas on:click={handleClick} width={640} height={320}>
      <Layer {render} />
    </Canvas>
    ({pos.x},{pos.y})
  </div>

</div>

<div class="table">
  <JobList />
</div>

<style>
  .container {
    display: inline-flex;
    justify-content: center;
    flex-direction: row;
    align-items: start;
  }
  .jobs{
      height: 320px;
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
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: end;
  }
  .table {
      border: 2px solid #c7c7c7;
      border-radius: 8px;
      box-shadow: rgba(0, 0, 0, 100) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
      display: flex;
      justify-content: center;
      flex-direction: column;
      align-items: center;
  }
</style>
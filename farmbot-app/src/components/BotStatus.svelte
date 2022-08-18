<script>
  import ActionItem from "./ActionItem.svelte";
  import { getStatus } from "../fetchers.js";

  let state
  let status

  async function gettingStatus() {
    while (true){
      status = await getStatus();
    if (status) {
      state = status;
    } else throw  new Error("Error occurred")
  }
  }
  status = gettingStatus();




</script>

<ActionItem description="Status of the bot">


  {#await  state}
    <p> Still waiting</p>
  {:then  data}
    <p style="font-weight: bold">
    {#if data.busy=="busy"}
        executing {data.running.type} job: {data.running.name}  <br/> <progress value="{data.running.progress*100}" max="100"></progress> {parseInt(data.running.progress*100+0.5)}%
    {:else}
        inactive
    {/if}
    </p>
    <p>
    current position:
    x: {data.location.x}
    y: {data.location.y}
    z: {data.location.z}
    </p>


  {:catch error}
    <p>Got some error while processing</p>
  {/await}

</ActionItem>

<style>

    progress{
        width:300px;
        height:18px;
        color: #09b209;
        background-color: rgba(211, 210, 165, 0.85);
        border-radius: 4px;
        box-shadow: 0 3px 6px rgb(222, 220, 171) inset;
    }

</style>
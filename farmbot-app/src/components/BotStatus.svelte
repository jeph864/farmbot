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
    current position:
    x: {data.x}
    y: {data.y}
    z: {data.z}



  {:catch error}
    <p>Got some error while processing</p>
  {/await}

</ActionItem>
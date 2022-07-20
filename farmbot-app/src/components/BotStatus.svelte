<script>
  import ActionItem from "./ActionItem.svelte";
  import { getStatus } from "../fetchers.js";

  //TODO: remove comment when frontend-backend connection is fixed:
  //let status = getStatus();
  //TODO: remove when frontend-backend connection is fixed:
  //let status = "No status yet";


  let status

  async function gettingStatus(){
    status = await getStatus();
    if (status) {
      console.log(status);
     return status;}
    else throw  new Error("Error occurred")
  }
  status = gettingStatus();




</script>

<ActionItem description="Status">

  {#await  status}
    <p> Still waiting</p>
  {:then  data}

    x: {data.x}
    y: {data.y}
    z: {data.z}



  {:catch error}
    <p>Got some error while processing</p>
  {/await}

</ActionItem>
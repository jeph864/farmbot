<script>
  import ActionItem from "./ActionItem.svelte";
  import { getStatus } from "../fetchers.js";

  //TODO: remove comment when frontend-backend connection is fixed:
  //let status = getStatus().toString;
  //TODO: remove when frontend-backend connection is fixed:
  let status = "No status yet";

  export function gettingStatus(){
    return status;
  }

</script>

<ActionItem description="Status">

  {gettingStatus()}

</ActionItem>
<script>
  import ActionItem from "./ActionItem.svelte";

  export function getStatus(){
      //TODO
    return "no status yet";
  }

</script>

<ActionItem description="Status">

  {getStatus()}

</ActionItem>
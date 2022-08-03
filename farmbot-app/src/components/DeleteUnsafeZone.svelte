<script>
  import {getUnsafeAreas} from "../fetchers.js";
  import ActionItem from "./ActionItem.svelte";


  let zones

  async function gettingZones(){
    zones = await getUnsafeAreas();
    if (zones) return zones;
    else throw  new Error("Error occurred")
  }
  zones = gettingZones();

  function deleteZone(id){
    //TODO
  }

</script>

<ActionItem description="Delete an unsafe zone">

{#await  zones}
  <p> Still waiting</p>
{:then  data}


  <table style="width:100%;"id>
    <thead style="background-color: #b3d9b3">
    <tr>
      <th>{"Name"}</th>
      <th>{"Delete Zone"}</th>
    </tr>
    </thead>
    <tbody>

    {#each Object.values(data) as value}
      <tr>
        <td><p style="">{value.name}</p></td>
        <td><button on:click={deleteZone(value.id)}>delete</button></td>
      </tr>
    {/each}
    </tbody>
  </table>





{:catch error}
  <p>Got some error while processing</p>
{/await}
</ActionItem>


<style>
    table {
        border-collapse: collapse;
        width: 100%;
    }

    thead tr th {
        position:sticky; top:0; background: #b3d9b3;
    }

    th {
        text-align: left;
        padding: 6px;
    }
    td {
        border: 1px solid #dddddd;
        text-align: left;
        padding: 6px;
    }
    thead tr th {
        position:sticky; top:0; background: rgba(222, 220, 171, 0.85);
    }

    tr:nth-child(even) {
        background-color: rgba(232, 230, 180, 0.85);
    }
    button{
        background-color: #f5ffff;
        border-color: grey;
        border-radius: 8px;
        font-size: 15px;
        cursor: pointer;
        user-select: none;
        padding: 3px;
    }
    button:hover {
        background-color: #e2ecec;
        border-radius: 12px;
    }

</style>


<script>
  import ActionItem from "./ActionItem.svelte";
  import { coordinates } from "../store.js";
  import { createUnsafeArea } from "../fetchers.js";


    let name;
    export let x1;
    export let y1;
    export let x2;
    export let y2;
    let zoneCreated="";
    let height;

  function show(){
    coordinates.x1=x1;
    coordinates.y1=y1;
    coordinates.x2=x2;
    coordinates.y2=y2;
  }

    function  create() {
      if (x1 <= x2) {
        if (y1 <= y2) {
            createUnsafeArea({
              name,
              location: {
                beg: {
                  x: x1,
                  y: y1
                },
                end: {
                  x: x2,
                  y: y2
                },
                height
              }
            })
          zoneCreated="Unsafe area created successfully!"
        }else { alert("y1 cannot be greater than y2"); }
      } else { alert("x1 cannot be greater than x2"); }

    }

</script>

<ActionItem description="Create a new unsafe zone">

  <div>
    <table id="myTable" border="0" cellpadding="3">
      <tr>
        <td>Name of the zone: </td>
        <td><input bind:value={name}></td>
      </tr>
      <tr>
        <td>Unsafe area: <br /><br /> (coordinates in mm) <br />(x1,y1): lower left corner<br />(x2,y2): upper right corner</td>
        <td>x1: <input type = "number" bind:value={x1}><br /> y1: <input type = "number" bind:value={y1}> <br /> x2: <input type = "number" bind:value={x2}> <br /> y2: <input type = "number" bind:value={y2}></td>
      </tr>
      <tr>
        <td>&ensp;</td>
        <td>&ensp;</td>
      </tr>
      <tr>
        <td>Height (in mm): </td>
        <td><input type = "number" bind:value={height}></td>
      </tr>
      <tr>
        <td>&ensp;</td>
        <td>&ensp;</td>
      </tr>
    </table>
    <button on:click={show}>
      show area
    </button>
    <button on:click={create}>
      Create unsafe zone
    </button>
    <br /> <p style="color: green;">{zoneCreated}</p>
  </div>

</ActionItem>


<style>
    main {
        text-align: center;
        padding: 16px;
        margin: auto;
    }

    #myTable {
        table-layout: fixed;
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
    input{
        border-radius: 6px;
        background-color: #f8f7e5;
        border-color: #dddddd;
    }


</style>
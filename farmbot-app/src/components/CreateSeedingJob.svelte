<script>
    import ActionItem from "./ActionItem.svelte";
    import onUpdate from "./JobList.svelte";
    import { createJob } from "../fetchers.js";
    import {coordinates} from "../store.js";

    let name;
    let depth;
    let min_dist;
    let plant_type = "radish";
    export let x1;
    export let y1;
    export let x2;
    export let y2;
    let jobCreated="";

    function show(){
        coordinates.x1=x1;
        coordinates.y1=y1;
        coordinates.x2=x2;
        coordinates.y2=y2;
    }

      function  create() {
        if(min_dist>0){
            if(depth>=0) {
                if (x1 <= x2) {
                    if (y1 <= y2) {

                        createJob({
                            name,
                            plant_type,
                            depth,
                            min_dist,
                            working_area: {
                                beg_pos: {
                                    x: x1,
                                    y: y1
                                },
                                end_pos: {
                                    x: x2,
                                    y: y2
                                }
                            }
                        })

                        jobCreated="Seeding Job created successfully!"
                        //this can be used to automatically reload the whole page
                        //location.reload();

                    }
                    else { alert("y1 cannot be greater than y2"); }
                } else { alert("x1 cannot be greater than x2"); }
            } else{ alert("planting depth must be a positive number") }
        } else{ alert("plant distance must be a positive number") }

    }

</script>

<ActionItem description="Create a new seeding job">
    <div>
        <table id="myTable" border="0" cellpadding="3">
            <tr>
                <td>Name of the job:</td>
                <td><input bind:value={name}></td>
            </tr>
            <tr>
                <td>Plant type:</td>
                <td><input bind:value={plant_type}></td>
            </tr>
            <tr>
                <td>Plant distance (in mm):</td>
                <td><input type = "number" bind:value={min_dist}></td>
            </tr>
            <tr>
                <td>Seeding depth (in mm):</td>
                <td><input type = "number" bind:value={depth}></td>
            </tr>
            <tr>
                <td>&ensp;</td>
                <td>&ensp;</td>
            </tr>
            <tr>
                <td>Working area: <br /><br /> (coordinates in mm) <br />(x1,y1): lower left corner<br />(x2,y2): upper right corner</td>
                <td>x1: <input type = "number" bind:value={x1}><br /> y1: <input type = "number" bind:value={y1}> <br /> x2: <input type = "number" bind:value={x2}> <br /> y2: <input type = "number" bind:value={y2}></td>
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
            Create job
        </button>
        <br /> <p style="color: green;">{jobCreated}</p>
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
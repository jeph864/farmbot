<script>
// @ts-nocheck

    import ActionItem from "./ActionItem.svelte";
    import { editJob } from "../fetchers.js"; 
    //only example, need all the jobs from the database (names)
    //TODO: get all the jobs
    let selected = 'Job 1';
    let options = [
        'Job 1',
        'Job 2',
        'Job 3'
    ]

    //fill in the selected data here
    let jobName = 'test';
    let plantingDepth = 1;
    let dist = 1;
    let plant = "radish";
    let x1 = 0;
    let y1 = 0;
    let x2 = 200;
    let y2 = 300;
    let jobCreated="";

    function edit() {
        
        if(dist>=0){
            if(plantingDepth>=0) {
                if (x1 <= x2) {
                    if (y1 <= y2) {
                        editJob({
                            jobName,
                            plant,
                            dist,
                            working_area: {
                                pos: {
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

                    }
                    else { alert("y2 cannot be greater than y1"); }
                } else { alert("x2 cannot be greater than x1"); }
            } else{ alert("planting depth must be a positive number") }
        } else{ alert("plant distance must be a positive number") }
    }

    </script>

<ActionItem description="Edit a seeding job">

    <div>

        <select bind:value={selected}>
            {#each options as value}<option {value}>{value}</option>{/each}
        </select>

    </div>

    <div>
        <table id="myTable" border="0" cellpadding="3">
            <tr>
                <td>Name of the job:</td>
                <td><input bind:value={jobName}></td>
            </tr>
            <tr>
                <td>Plant type:</td>
                <td><input bind:value={plant}></td>
            </tr>
            <tr>
                <td>Plant distance (in mm):</td>
                <td><input type = "number" bind:value={dist}></td>
            </tr>
            <tr>
                <td>Seeding depth (in mm):</td>
                <td><input type = "number" bind:value={plantingDepth}></td>
            </tr>
            <tr>
                <td>&ensp;</td>
                <td>&ensp;</td>
            </tr>
            <tr>
                <td>Working area: <br /><br /> (coordinates in mm) <br />(x1,y1): upper left corner<br />(x2,y2): lower right corner</td>
                <td>x1: <input type = "number" bind:value={x1}><br /> y1: <input type = "number" bind:value={y1}> <br /> x2: <input type = "number" bind:value={x2}> <br /> y2: <input type = "number" bind:value={y2}></td>
            </tr>
        </table>

        <button on:click={edit}>
            Update seeding job
        </button>


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


</style>
<script>
    import ActionItem from "./ActionItem.svelte";
    import {updateJob, getJobs, searchJobs, createJob} from "../fetchers.js";
    import {jobName,coordinates} from "../store.js";
    import swal from 'sweetalert';


    let name ;
    let id;
    let min_dist;
    let plant_type;
    let depth;
    export let x1;
    export let y1;
    export let x2;
    export let y2;
    let jobCreated=""
    export let job;

    function setData(x1Data,y1Data,x2Data,y2Data)
    {
        x1 = x1Data;
        y1 = y1Data;
        x2 = x2Data;
        y2 = y2Data;
        coordinates.x1 = x1Data;
        coordinates.y1 = y1Data;
        coordinates.x2 = x2Data;
        coordinates.y2 = y2Data;
    }
    function refresh()
    {
        name = document.getElementById("name").value;
        min_dist = parseInt(document.getElementById("dist").value);
        plant_type = document.getElementById("plant_type").value;
        depth = parseInt(document.getElementById("depth").value);
        x1 = parseInt(document.getElementById("x1").value);
        y1 = parseInt(document.getElementById("y1").value);
        x2 = parseInt(document.getElementById("x2").value);
        y2 = parseInt(document.getElementById("y2").value);
        coordinates.x1 = document.getElementById("x1").value;
        coordinates.y1 = document.getElementById("y1").value;
        coordinates.x2 = document.getElementById("x2").value;
        coordinates.y2 = document.getElementById("y2").value;
    }
    export async function names(){
        names = await getJobs();
        if (names) return names;
        else throw  new Error("Error occured")
    }
    names = names();

    function edit() {
        name = document.getElementById("name").value;
        min_dist = parseInt(document.getElementById("dist").value);
        plant_type = document.getElementById("plant_type").value;
        depth = parseInt(document.getElementById("depth").value);
        x1 = parseInt(document.getElementById("x1").value);
        y1 = parseInt(document.getElementById("y1").value);
        x2 = parseInt(document.getElementById("x2").value);
        y2 = parseInt(document.getElementById("y2").value);
        id = jobName.ID;


        if(min_dist>=0){
            if(depth>=0) {
                if (x1 <= x2) {
                    if (y1 <= y2) {

                        updateJob({
                            id,
                            depth,
                            min_dist,
                            name,
                            plant_type,
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
                        });
                        swal("Job Update Successful");
                        jobName.Name='';
                        jobName.ID='';
                        coordinates.x1 = '';
                        coordinates.x2 = '';
                        coordinates.y1 = '';
                        coordinates.y2 = '';

                    }
                    else { swal("y2 cannot be greater than y1"); }
                } else { swal("x2 cannot be greater than x1"); }
            } else{ swal("planting depth must be a positive number") }
        } else{ swal("plant distance must be a positive number") }
    }
    export async function  searchJob(data){
        job = await searchJobs(data);
        if (job){
            return job;
        }
        else throw  new Error("Search error");
    }

    job = searchJob();


</script>



<ActionItem description="Edit a seeding job" >

    <div class="container">

        {#if jobName.Name!==''}
            <p use = {searchJob(jobName.Name)}></p>


        <div>

            {#await  job}
            {:then  editData}

                {#each Object.values(editData) as editValue}
                    <table id="myTable" border="0" cellpadding="3">
                        <tr>
                            <td>Name of the job:</td>
                            <td><input value={editValue.name} id="name"></td>
                        </tr>


                        <tr>
                            <td>Plant type:</td>
                            <td><input value={editValue.plant_type} id="plant_type"></td>

                        </tr>
                        <tr>
                            <td>Plant distance (in mm):</td>
                            <td><input type = "number" value={editValue.min_dist} id="dist"></td>
                        </tr>
                        <tr>
                            <td>Seeding depth (in mm):</td>
                            <td><input type = "number" value={editValue.depth} id="depth"></td>
                        </tr>
                        <tr>
                            <td>&ensp;</td>
                            <td>&ensp;</td>
                        </tr>
                        <tr>
                            <td>Working area: <br /><br /> (coordinates in mm) <br />(x1,y1): lower left corner<br />(x2,y2): upper right corner</td>
                            <td use = {setData(editValue.working_area.beg_pos.x,editValue.working_area.beg_pos.y,editValue.working_area.end_pos.x,editValue.working_area.end_pos.y)}>x1: <input  type = "number" value={x1} id="x1"><br /> y1: <input type = "number" value={y1} id="y1"> <br /> x2: <input type = "number" value={x2} id="x2"> <br /> y2: <input type = "number" value={y2} id="y2"></td>

                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>

                    <button on:click={refresh}>
                        show area
                    </button>
                    <button on:click={edit}>
                        Update seeding job
                    </button>


                {/each}
            {/await}



            <br /> <p style="color: green;">{jobCreated}</p>
        </div>
        {/if}

    </div>

</ActionItem>

<style>
    main {
        text-align: center;
        padding: 16px;
        margin: auto;
    }
    .container{
        flex-direction: column;
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
    select{
        border-radius: 6px;
        background-color: #f8f7e5;
        font-size: 15px;
        border: #dddddd;
        padding: 3px;

    }


</style>

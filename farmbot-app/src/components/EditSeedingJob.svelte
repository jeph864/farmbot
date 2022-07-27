<script>
    import ActionItem from "./ActionItem.svelte";
    import {updateJob, getJobs, searchJobs, createJob,jobName} from "../fetchers.js";




    //only example, need all the jobs from the database (names)
    //TODO: get all the jobs
    let selected = '';
    let options = [];

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
    export async function names(){
        names = await getJobs();
        if (names) return names;
        else throw  new Error("Error occured")
    }
    names = names();

    function edit() {
        //TODO: edit seeding job, send data to endpoint
        name = document.getElementById("name").value;
        min_dist = parseInt(document.getElementById("dist").value);
        plant_type = document.getElementById("plant_type").value;
        depth = parseInt(document.getElementById("depth").value);
        x1 = parseInt(document.getElementById("x1").value);
        y1 = parseInt(document.getElementById("y1").value);
        x2 = parseInt(document.getElementById("x2").value);
        y2 = parseInt(document.getElementById("y2").value);
        id = parseInt(document.getElementById("id").value);


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

                        jobCreated="Seeding Job edited successfully!";

                    }
                    else { alert("y2 cannot be greater than y1"); }
                } else { alert("x2 cannot be greater than x1"); }
            } else{ alert("planting depth must be a positive number") }
        } else{ alert("plant distance must be a positive number") }

        /*updateJob({
            id,
            depth,
            dist,
            name,
            plant,
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
        });*/


        //alert(document.getElementById("id").value);
        //jobCreated="Seeding Job edited successfully!"


    }
    export async function  searchJob(data){
        /*if(jobName.Name!=='')
        {
            job = await searchJobs(jobName.Name);
            if (job) return job;
            else throw  new Error("Search error");
        }*/
        job = await searchJobs(data);
        if (job) return job;
        else throw  new Error("Search error");
    }

    job = searchJob();

</script>



<ActionItem description="Edit a seeding job" >

    <div class="container">
    {#await  names}
    {:then  nameData}

        {#if selected==''}
            select job: &ensp;
            {/if}

            <select bind:value={selected}>
                {#each Object.values(nameData) as nameValue}
                    <option {nameValue}>{nameValue.name}</option>
                {/each}
            </select>

            {#if selected!==''}

                <button on:click={searchJob(selected)}>
                    Load Job Data
                </button>
            {/if}
    {/await}
    <br/>


    <div>

        {#await  job}
        {:then  editData}

                {#each Object.values(editData) as editValue}
                    <table id="myTable" border="0" cellpadding="3">
                    <tr>
                        <td>ID of the job:</td>
                        <td><input type = "number" value={editValue.id} id="id" readonly></td>
                    </tr>
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
                        <td>Working area: <br /><br /> (coordinates in mm) <br />(x1,y1): upper left corner<br />(x2,y2): lower right corner</td>
                        <td>x1: <input type = "number" value={editValue.working_area.beg_pos.x} id="x1"><br /> y1: <input type = "number" value={editValue.working_area.beg_pos.y} id="y1"> <br /> x2: <input type = "number" value={editValue.working_area.end_pos.x} id="x2"> <br /> y2: <input type = "number" value={editValue.working_area.end_pos.y} id="y2"></td>
                    </tr>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                    </table>
                        <button on:click={edit}>
                            Update seeding job
                        </button>

                {/each}


        {/await}
        <!--{#await  job}
        {:then  editData}
            {#each Object.values(editData) as editValue}

            {/each}
        {/await}-->


        <br /> <p style="color: green;">{jobCreated}</p>
    </div>

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

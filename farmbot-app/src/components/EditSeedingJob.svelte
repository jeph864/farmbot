<script>
    import ActionItem from "./ActionItem.svelte";
    import {updateJob, getJobs, searchJobs} from "../fetchers.js";




    //only example, need all the jobs from the database (names)
    //TODO: het all the jobs
    let selected = '';
    let options = [];

    let name;
    let id;
    let dist;
    let plant;
    let depth;
    let x1;
    let y1;
    let x2;
    let y2;
    let jobCreated=""
    export let job;
    export async function names(){
        names = await getJobs();
        if (names) return names;
        else throw  new Error("Error occured")
    }
    names = names();

    function set(val)
    {
        dist = val;
    }
    function edit() {
        //TODO: edit seeding job, send data to endpoint
        name = document.getElementById("name").value;
        dist = document.getElementById("dist").value;
        plant = document.getElementById("plant_type").value;
        depth = document.getElementById("depth").value;
        x1 = document.getElementById("x1").value;
        y1 = document.getElementById("y1").value;
        x2 = document.getElementById("x2").value;
        y2 = document.getElementById("y2").value;
        id = document.getElementById("id").value;

        updateJob({
            name,
            plant,
            depth,
            dist,
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
        },id);


        //alert(document.getElementById("id").value);
        jobCreated="Seeding Job edited successfully!"


    }
    export async function  searchJob(){
        job = await searchJobs(selected);
        if (job) return job;

        /*{
            const data = Object.values(job);
            plant = data.plant;
        }*/
        else throw  new Error("Search error");
    }

    job = searchJob();

</script>



<ActionItem description="Edit a seeding job">
    {#await  names}
    {:then  nameData}

    <div>
        <select bind:value={selected}>
            {#each Object.values(nameData) as nameValue}<option {nameValue}>{nameValue.name}</option>{/each}
        </select>

        <button on:click={searchJob(selected)}>
            Select job
        </button>
    </div>
    {/await}
    <br/>


    <div>

        {#await  job}
        {:then  editData}
        <table id="myTable" border="0" cellpadding="3">
            {#each Object.values(editData) as editValue}
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
                <td><input value={editValue.plant} id="plant_type"></td>

            </tr>
            <tr>
                <td>Plant distance (in mm):</td>
                <td><input type = "number" value={editValue.dist} id="dist"></td>



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

            {/each}
        </table>
        {/await}
        <!--{#await  job}
        {:then  editData}
            {#each Object.values(editData) as editValue}

            {/each}
        {/await}-->
        <button on:click={edit}>
            Update seeding job
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


</style>
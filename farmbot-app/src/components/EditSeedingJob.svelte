<script>
    import ActionItem from "./ActionItem.svelte";



    //only example, need all the jobs from the database (names)
    //TODO: het all the jobs
    let selected = 'Job 1';
    let options = [
        'Job 1',
        'Job 2',
        'Job 3'
    ]

    //fill in the selected data here
    let jobName;
    let plantingDepth;
    let dist;
    let plant;
    let x1;
    let y1;
    let x2;
    let y2;
    let jobCreated;

    function edit() {
        //TODO: edit seeding job, send data to endpoint
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

        <button on:click={null}>
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
    button{
        background-color: #f8f7e5;
        border-color: grey;
        border-radius: 8px;
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

    }


</style>
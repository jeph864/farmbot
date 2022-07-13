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
    let plantType;
    let amountOfWater;
    let height;



    function edit() {
        //TODO: edit watering job, send data to endpoint
    }




</script>

<ActionItem description="Edit a watering job">

    <div>

        <select bind:value={selected}>
            {#each options as value}<option {value}>{value}</option>{/each}
        </select>

    </div>

    <div>
        <table id="myTable" border="0" cellpadding="3">
            <tr>
                <td>Plant type:</td>
                <td><input bind:value={plantType}></td>
            </tr>
            <tr>
                <td>Amount of water per plant (in ml):</td>
                <td><input type = "number" bind:value={amountOfWater}></td>
            </tr>
            <tr>
                <td>Height (in mm):</td>
                <td><input type = "number" bind:value={height}></td>
            </tr>
        </table>
        <button on:click={null}>
            Update watering job
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
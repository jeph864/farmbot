<script>
    import ActionItem from "./ActionItem.svelte";



    let plantType = "radish";
    let amountOfWater = 100;
    let height = 0;



    function create() {
        //TODO: create watering job, send data to endpoint
    }




</script>

<ActionItem description="Create a new watering job">
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
        <button on:click={create}>
            Create job
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
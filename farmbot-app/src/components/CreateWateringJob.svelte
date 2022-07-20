<script>
    import ActionItem from "./ActionItem.svelte";



    let plantType = "radish";
    let amountOfWater = 100;
    let height = 0;
    let date;
    let interval;


    function create() {
        //TODO: create watering job, send data to endpoint
        console.log(date)
    }




</script>

<ActionItem description="Create a new watering job">
    <div>
        <table id="myTable" border="0" cellpadding="3">
            <tr>

            </tr>
            <tr>
                <td>Amount of water per plant (in ml):</td>
                <td><input type = "number" bind:value={amountOfWater}></td>
            </tr>
            <tr>
                <td>Height (in mm):</td>
                <td><input type = "number" bind:value={height}></td>
            </tr>

            <tr>
                <td>Date:</td>
                <input type="datetime-local" bind:value={date}>
            </tr>
            <tr>
                <td>Interval in hours:</td>
                <td><input type = "number" bind:value={interval}></td>
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
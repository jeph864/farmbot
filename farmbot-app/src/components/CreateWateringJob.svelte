<script>
    import ActionItem from "./ActionItem.svelte";



    let plantType = "radish";
    let amountOfWater = 100;
    let height = 0;


    let selected_day = '1';
    let options_day = [
        '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15', '16',
        '17','18','19','20','21','22','23','24','25','26','27','28','29', '30', '31'
    ]
    let selected_month = '1';
    let options_month = [
        '1', '2', '3','4', '5', '6','7', '8', '9', '10', '11', '12',
    ]
    let selected_year = '2022';
    let options_year = [
        '2022', '2023', '2024', '2025'
    ]


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
            <tr>
                <td>Date (d/m/y):</td>
                <select bind:value={selected_day}>
                    {#each options_day as value}<option {value}>{value}</option>{/each}
                </select>
                <select bind:value={selected_month}>
                    {#each options_month as value}<option {value}>{value}</option>{/each}
                </select>
                <select bind:value={selected_year}>
                    {#each options_year as value}<option {value}>{value}</option>{/each}
                </select>
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
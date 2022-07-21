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
            <tr>
                <td>&ensp;</td>
                <td>&ensp;</td>
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
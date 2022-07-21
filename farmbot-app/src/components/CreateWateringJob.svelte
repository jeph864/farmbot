<script>
    import ActionItem from "./ActionItem.svelte";
    import { createWateringJob } from "../fetchers.js";
    import { getJobs } from "../fetchers.js";



    let seeding_id;
    let amount;
    let height;
    let next;
    let interval;

    let selected;
    let options = [];
    let jobs;
    let date;


    async function gettingJobs(){
        jobs = await getJobs();
        if (jobs) return jobs;
        else throw  new Error("Error occured")
    }

    jobs = gettingJobs();



    function create() {

        seeding_id = selected.id;
        next = new Date(date)
        console.log(next)
        createWateringJob({
            seeding_id,
            amount,
            height,
            next
            //interval,
        })
    }




</script>

<ActionItem description="Create a new watering job">
    <div>
        <table id="myTable" border="0" cellpadding="3">
            <tr>
                <td>Select plants from seeding jobs:</td>
                <td>
                {#await  jobs}
                    <p> Still waiting</p>
                {:then  data}

                    <select bind:value={selected}>
                        {#each Object.values(data) as value}
                            <option {value}>{value.name}</option>
                        {/each}
                    </select>

                {:catch error}
                    <p>Got some error while processing</p>
                {/await}
                </td>

            </tr>
            <tr>
                <td>Amount of water per plant (in ml):</td>
                <td><input type = "number" bind:value={amount}></td>
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
            <tr>
                <td>&ensp;</td>
                <td>&ensp;</td>
            </tr>
        </table>
        <button on:click={create}>
            Create watering job
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
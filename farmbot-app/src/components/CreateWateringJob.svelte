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


</style>
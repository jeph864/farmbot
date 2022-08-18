<script>
    import ActionItem from "./ActionItem.svelte";
    //import { executeWateringJob } from "../fetchers.js";

    //only example, need all the jobs from the database (names)
    //TODO: get all the jobs
    let selected = 'W_Job 1';
    let options = [
        'W_Job 1',
        'W_Job 2',
        'W_Job 3'
    ]

    function execute() {

        console.log(selected);
        //TODO: execute "executeWateringJob" (not existing yet) from fetchers.js to pass the job to execute
    }


</script>




<ActionItem description="Execute a watering job">

    <div>

        <select bind:value={selected}>
            {#each options as value}<option {value}>{value}</option>{/each}
        </select>

        <button on:click={execute}>
            Execute job
        </button>

    </div>

</ActionItem>

<style></style>

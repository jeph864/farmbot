<script>
    import ActionItem from "./ActionItem.svelte";

    let name, depth, min_dist;
    let plant_type = "e.g. radish";
    let x1 = 0;
    let y1 = 0;
    let x2 = 200;
    let y2 = 300;

    function create() {
        createJob({
            name,
            plant_type,
            min_dist,
            working_area: {
                pos: {
                    x: x1,
                    y: y1
                },
                end_pos: {
                    x: x2,
                    y: y2
                }
            }
        })
    }

</script>

<ActionItem description="Create a new seeding job">
    <div>
        <table id="myTable" border="0" cellpadding="3">
            <tr>
                <td>name:</td>
                <td><input bind:value={name}></td>
            </tr>
            <tr>
                <td>plant type:</td>
                <td><input bind:value={plant_type}></td>
            </tr>
            <tr>
                <td>plant distance (in mm):</td>
                <td><input bind:value={min_dist}></td>
            </tr>
            <tr>
                <td>seeding depth (in mm):</td>
                <td><input bind:value={depth}></td>
            </tr>
            <tr>
                <td>&ensp;</td>
                <td>&ensp;</td>
            </tr>
            <tr>
                <td>working area: <br /> (coordinates in mm)</td>
                <td>x1: <input bind:value={x1}><br /> y1: <input bind:value={y1}> <br /> x2: <input bind:value={x2}> <br /> y2: <input bind:value={y2}></td>
            </tr>
            <tr>
                <td>&ensp;</td>
                <td>&ensp;</td>
            </tr>
            <tr>
                <td><button on:click={create}>
                    Create job
                </button></td>
            </tr>
        </table>
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
<script>

    let depth;
    let dist;
    let plant = "e.g. radish";
    let x1 = 0;
    let y1 = 0;
    let x2 = 200;
    let y2 = 300;

    function cancel() {
        //TODO: go back to App.svelte
    }

    function create() {
        //TODO: create new job and close window (go back to App.svelte)
    }

</script>

<main>
    <h1>Create a new seeding job</h1>

    <div>
        <table id="myTable" border="0" cellpadding="3">
            <tr>
                <td>plant type:</td>
                <td><input bind:value={plant}></td>
            </tr>
            <tr>
                <td>plant distance (in mm):</td>
                <td><input bind:value={dist}></td>
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
                <td><button on:click={cancel}>
                    cancel
                </button></td>
                <td><button on:click={create}>
                    create job
                </button></td>
            </tr>
        </table>
    </div>
</main>

<style>
    main {
        text-align: center;
        padding: 2em;
        margin: auto;
    }


    #myTable {
        width:30%;
        table-layout: fixed;
        background-color:lightblue;
        outline: 2px solid green;
        margin-left: 35%;
    }

    h1 {
        text-align: center;
        color: #00aa00;
        text-transform: uppercase;
        font-size: 4em;
        font-weight: 200;
    }

</style>
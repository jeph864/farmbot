<script>
	import JobControls from "./JobControls.svelte";
</script>

<main>
	<div>
	<h1>Digital Farming Project</h1>
	</div>
	<JobControls />
</main>

<style>
	main {
		font-family: Inter, Helvetica, sans-serif;
		text-align: center;
		padding: 16px;
		margin: auto;
		background-color: #cceecc;
	}

	h1 {

		font-size: 50px;
		text-align: center;
		color: #00CC00;
		text-transform: uppercase;
		font-weight: 300;


		border: 1px solid #c7c7c7;
		border-radius: 8px;
		box-shadow: rgba(0, 0, 0, 0.88) 0px 2px 5px -1px, rgba(0, 0, 0, 0.2) 0px 1px 3px -1px;

	}
	div{
		align-items: center;
	}
</style>
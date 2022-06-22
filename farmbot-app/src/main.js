import App from './App.svelte';
import createSeedingJob from "./createSeedingJob.svelte";

const app = new createSeedingJob({
	target: document.body,
	props: {

	}
});

export default app;
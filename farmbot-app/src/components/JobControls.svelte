<script>
  import CreateSeedingJob from "./CreateSeedingJob.svelte";
  import BotStatus from "./BotStatus.svelte";
  import ExecuteJob from "./ExecuteJob.svelte";
  import CreateWateringJob from "./CreateWateringJob.svelte";
  import ExecuteWateringJob from "./ExecuteWateringJob.svelte";
</script>

<div class="container">
  <CreateSeedingJob />
  <ExecuteJob />
  <CreateWateringJob />
  <ExecuteWateringJob />
  <BotStatus />

</div>

<style>
  .container {
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
</style>
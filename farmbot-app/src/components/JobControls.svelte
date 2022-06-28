<script>
  import CreateSeedingJob from "./CreateSeedingJob.svelte";
  import BotStatus from "./BotStatus.svelte";
  import ExecuteJob from "./ExecuteJob.svelte";
</script>

<div class="container">
  <CreateSeedingJob />
  <ExecuteJob />
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
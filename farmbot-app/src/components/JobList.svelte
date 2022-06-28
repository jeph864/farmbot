<script>
  import Job from "./Job.svelte";

  export let jobs;
</script>


<div>
  <ul>
    {#each jobs as job}
      <li>
        <Job />
      </li>
    {/each}
  </ul>
</div>
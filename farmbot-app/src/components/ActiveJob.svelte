<script>
  export let active;
</script>

{#if active}
  <p style="color:green">{"active"}</p>
{:else}
  <p style="color:red">{"not active"}</p>
{/if}
<script>
  export let active;
  export let y;
</script>

{#if active}
  <p style="color:green">{"active"}</p>
{:else}
  <p style="color:red">{"not active"}</p>
{/if}
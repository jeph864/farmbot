<script>
  // 'export let {name}' allows you to provide data (called 'props')
  // to this component.

  // See: https://svelte.dev/tutorial/declaring-props
  export let description;

  let open = false;

  function toggleOpen() {
    open = !open;
  }
</script>

<div class="container">
  <div class="description" on:click={toggleOpen}>{description}</div>
  <!--
   {#if someCondition} if an if-block.
   It's content will only be displayed if the condition is true.

   See: https://svelte.dev/tutorial/if-blocks
   -->
  {#if open}
    <div class="content">
      <slot></slot>
      <!--
        'slot' allows you to put children into a component.
        Example:

          <ActionItem>
            <SomeChildComponent>
          </ActionItem>

        In this case, SomeChildComponent will be placed where <slot> is.
      -->
      <!-- See: https://svelte.dev/tutorial/slots -->
    </div>
  {/if}
</div>

<style>
  .container {
    border: 1px solid #c7c7c7;
    background-color: rgba(246, 244, 199, 0.85);
    border-radius: 16px;
    width: 420px;

    /*box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;*/
    box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
  }

  .description:hover {
    background-color: #d5d3af;
    border-radius: 16px;
  }

  .description {
    cursor: pointer;
    user-select: none;
    padding: 16px;
      border-radius: 16px;
      box-shadow: rgba(50, 50, 93, 0.15) 0px 2px 5px -1px, rgba(0, 0, 0, 0.2) 0px 1px 3px -1px;
      background-color: rgba(238, 236, 193, 0.85);
  }

  .content {
    display: flex;
    justify-content: center;
    padding: 16px;

  }

</style>
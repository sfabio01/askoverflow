<script lang="ts">
    import { screen, PAGE } from "./stores";
    import AskPage from "./AskPage.svelte";
    import Homepage from "./Homepage.svelte";
</script>

{#if $screen == PAGE.home}
    <Homepage />
{:else if $screen == PAGE.ask}
    <AskPage />
{/if}

<script lang="ts">
    import { screen, PAGE } from "./stores";
    import AskPage from "./AskPage.svelte";
    import Homepage from "./Homepage.svelte";
    import MyQuestionsPage from "./MyQuestionsPage.svelte";
</script>

{#if $screen == PAGE.home}
    <Homepage />
{:else if $screen == PAGE.ask}
    <AskPage />
{:else if $screen == PAGE.questions}
    <MyQuestionsPage />
{/if}

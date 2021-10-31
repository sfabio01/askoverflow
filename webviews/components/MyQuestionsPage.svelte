<script>
    import { screen, PAGE } from "./stores";

    function navigateToHomePage() {
        screen.set(PAGE.home);
    }
</script>

<button on:click={navigateToHomePage}>back</button>
<h1>My questions</h1>
